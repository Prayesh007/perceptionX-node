// app.js
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const File = require("./models/perceps.js");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const http = require("http");
const socketIo = require("socket.io");
const os = require("os");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json()); // for JSON API forwarding (POST /detect)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB Connection
const dbUrl = process.env.MONGO_URI;
if (!dbUrl) {
    console.error("❌ MONGO_URI environment variable is not set. Exiting.");
    process.exit(1);
}
mongoose.connect(dbUrl, {})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Failed:", err);
        process.exit(1);
    });

// Multer config (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Socket
io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Views
app.get("/", (req, res) => {
    res.render("./perceps/index.ejs");
});

app.get("/detect", (req, res) => {
    res.render("./perceps/detect.ejs");
});

// Timeout for python processing (ms)
const PY_TIMEOUT = parseInt(process.env.PY_TIMEOUT || "5") * 60 * 1000; // default 5 minutes

// Primary upload & process route
app.post("/process", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const fileType = req.file.mimetype && req.file.mimetype.startsWith("image") ? "image" : "video";
    console.log("➡️ Received file of type:", fileType);

    try {
        const newFile = new File({
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer,
            processedData: null
        });
        const savedFile = await newFile.save();
        console.log("✅ File successfully saved with ID:", savedFile._id.toString());
        
        const pythonApi = process.env.PYTHON_API_URL || process.env.PY_SERVICE_URL;
        if (!pythonApi) {
            console.error("❌ PYTHON_API_URL environment variable is not set. Cannot call Python service.");
            return res.status(500).json({ error: "Python service URL not configured." });
        }
        
        const endpoint = pythonApi.replace(/\/$/, "") + "/process";
        console.log(`➡️ Calling Python service at ${endpoint} for file ${savedFile._id}`);

        await axios.post(endpoint, {
            fileId: savedFile._id.toString(),
            fileType: fileType
        }, {
            timeout: PY_TIMEOUT + 10000
        });

        io.emit("progress", 100);
        return res.json({ fileId: savedFile._id });
        
    } catch (error) {
        console.error("❌ Error processing file:", error.message || error);
        return res.status(500).json({ error: "Error processing file." });
    }
});

// Add a JSON-forwarding endpoint for direct API use
app.post("/detect", async (req, res) => {
    const { fileId, fileType } = req.body || {};
    if (!fileId || !fileType) {
        return res.status(400).json({ error: "fileId and fileType required" });
    }

    const pythonApi = process.env.PYTHON_API_URL || process.env.PY_SERVICE_URL;
    if (!pythonApi) {
        return res.status(500).json({ error: "Python API URL not configured." });
    }
    
    const endpoint = pythonApi.replace(/\/$/, "") + "/process";
    
    try {
        console.log(`➡️ Calling Python service at ${endpoint} for file ${fileId}`);
        const resp = await axios.post(
            endpoint,
            { fileId: fileId.toString(), fileType },
            { timeout: PY_TIMEOUT }
        );
        return res.status(resp.status).json(resp.data);
    } catch (err) {
        console.error("❌ Error calling Python service:", err.message || err);
        return res.status(500).json({ error: "Processing failed" });
    }
});

// Show file (decide image vs video). Returns HEAD content-type for detection and renders for GET.
app.get("/file/:id", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).send("File not found");
        if (req.method === "HEAD") {
            if (file.mimetype) res.set("Content-Type", file.mimetype);
            return res.status(200).end();
        }
        let originalBase64 = null;
        let processedBase64 = null;
        if (file.mimetype && file.mimetype.startsWith("image")) {
            originalBase64 = file.data.toString("base64");
            if (file.processedData) {
                processedBase64 = file.processedData.toString("base64");
            }
        }
        res.render("showFile.ejs", {
            fileId: file._id,
            filename: file.filename,
            mimetype: file.mimetype,
            originalBase64,
            processedBase64
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving file");
    }
});

// HEAD + GET for original file
app.head("/file/:id/original", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).end();
        if (file.mimetype) res.set("Content-Type", file.mimetype);
        return res.status(200).end();
    } catch (err) {
        console.error("Error (HEAD original):", err);
        return res.status(500).end();
    }
});
app.get("/file/:id/original", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ error: "Original file not found" });
        res.set("Content-Type", file.mimetype || "application/octet-stream");
        return res.send(file.data);
    } catch (err) {
        console.error("Error retrieving original file:", err);
        return res.status(500).json({ error: "Error retrieving file." });
    }
});

// HEAD + GET for processed file
app.head("/file/:id/processed", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file || !file.processedData) return res.status(404).end();
        if (file.mimetype) res.set("Content-Type", file.mimetype);
        return res.status(200).end();
    } catch (err) {
        console.error("Error (HEAD processed):", err);
        return res.status(500).end();
    }
});
app.get("/file/:id/processed", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file || !file.processedData) {
            return res.status(404).json({ error: "Processed file not found" });
        }
        res.set("Content-Type", file.mimetype || "application/octet-stream");
        return res.send(file.processedData);
    } catch (err) {
        console.error("Error retrieving processed file:", err);
        return res.status(500).json({ error: "Error retrieving file." });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
