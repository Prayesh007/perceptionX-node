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

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB Connection
const dbUrl = process.env.MONGO_URI || "mongodb+srv://aitools2104:kDTRxzV6MgO4nicA@cluster0.tqkyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(dbUrl, {})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Failed:", err));

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Socket.IO
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// Views
app.get("/", (req, res) => res.render("./perceps/index.ejs"));
app.get("/detect", (req, res) => res.render("./perceps/detect.ejs"));

// ==================== PROCESS FILE ====================
const PYTHON_API = (process.env.PYTHON_API_URL || "").replace(/\/$/, "");

async function callPythonService(fileId, fileType) {
    try {
        const resp = await axios.post(`${PYTHON_API}/process`, { fileId, fileType }, {
            timeout: (parseInt(process.env.PY_TIMEOUT) || 300000)  // 5 min default
        });
        io.emit("progress", 100);
        return resp.data;
    } catch (err) {
        console.error("Python service error:", err.message || err);
        throw new Error("Python service failed");
    }
}

// Upload & process endpoint
app.post("/process", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";

    try {
        const newFile = new File({
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer,
            processedData: null
        });
        const savedFile = await newFile.save();
        console.log("File saved with ID:", savedFile._id.toString());

        if (!PYTHON_API) throw new Error("PYTHON_API_URL not set");

        await callPythonService(savedFile._id.toString(), fileType);

        return res.json({ status: "ok", fileId: savedFile._id });
    } catch (err) {
        console.error("Processing failed:", err);
        return res.status(500).json({ error: "Processing failed" });
    }
});

// ==================== GET FILE ====================
app.get("/file/:id", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).send("File not found");

        const originalBase64 = file.data.toString("base64");
        const processedBase64 = file.processedData ? file.processedData.toString("base64") : null;

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

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));



// if (process.env.NODE_ENV !== "production") {
//     require("dotenv").config();
// }

// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const File = require("./models/perceps.js");
// const { spawn } = require("child_process");
// const cors = require("cors");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const http = require("http");
// const socketIo = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Middleware
// app.use(cors());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", ejsMate);
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public")));

// // MongoDB Connection
// const dbUrl = "mongodb+srv://aitools2104:kDTRxzV6MgO4nicA@cluster0.tqkyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true&tlsInsecure=false";

// mongoose.connect(dbUrl, {
//     serverSelectionTimeoutMS: 30000, // 30s to find server
//     socketTimeoutMS: 45000           // 45s to perform operations
// }).then(() => {
//     console.log("MongoDB Connected");

//     // Start server only after DB connection
//     server.listen(3000, () => {
//         console.log("Server running on http://localhost:3000/");
//     });

// }).catch(err => {
//     console.error("MongoDB Connection Failed:", err);
// });

// // Multer Configuration (Memory Storage)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Routes
// app.get("/", (req, res) => {
//     res.render("./perceps/index.ejs");
// });

// app.get("/detect", (req, res) => {
//     res.render("./perceps/detect.ejs");
// });

// // File Upload and Processing
// app.post("/process", upload.single("file"), async (req, res) => {
//     if (!req.file) {
//         console.error("No file uploaded.");
//         return res.status(400).json({ error: "No file uploaded" });
//     }

//     const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";
//     console.log("Received file of type:", fileType);

//     try {
//         const newFile = new File({
//             filename: req.file.originalname,
//             mimetype: req.file.mimetype,
//             size: req.file.size,
//             data: Buffer.from(req.file.buffer),
//             processedData: null
//         });

//         const savedFile = await newFile.save();
//         console.log("File saved to MongoDB with ID:", savedFile._id.toString());

//         const pythonScript = path.join(__dirname, "app.py");
//         const pythonProcess = spawn("python", [pythonScript, savedFile._id.toString(), fileType]);

//         pythonProcess.stdout.on("data", (data) => {
//             console.log(`Python Output: ${data.toString()}`);
//             let progressMatch = data.toString().match(/Progress: (\d+)%/);
//             if (progressMatch) {
//                 io.emit("progress", parseInt(progressMatch[1]));
//             }
//         });

//         pythonProcess.stderr.on("data", (data) => {
//             console.error(`Python Error: ${data.toString()}`);
//         });

//         pythonProcess.on("close", async (code) => {
//             console.log("Python process closed with code:", code);
//             if (code === 0) {
//                 io.emit("progress", 100);
//                 res.json({ fileId: savedFile._id });
//             } else {
//                 console.error("Python script failed with code:", code);
//                 res.status(500).json({ error: "Processing failed" });
//             }
//         });

//     } catch (error) {
//         console.error("Error processing file:", error);
//         res.status(500).json({ error: "Error processing file." });
//     }
// });

// // File Retrieval
// app.get("/file/:id", async (req, res) => {
//     try {
//         const file = await File.findById(req.params.id);
//         if (!file) {
//             return res.status(404).json({ error: "File not found" });
//         }

//         res.set("Content-Type", file.mimetype);
//         res.send(file.data);
//     } catch (error) {
//         console.error("Error fetching file:", error);
//         res.status(500).json({ error: "Error retrieving file." });
//     }
// });

// app.get("/file/:id/processed", async (req, res) => {
//     try {
//         const file = await File.findById(req.params.id);
//         if (!file || !file.processedData) {
//             return res.status(404).json({ error: "Processed file not found" });
//         }

//         if (file.mimetype.startsWith("video")) {
//             res.set("Content-Type", file.mimetype);
//             res.send(file.processedData);
//         } else if (file.mimetype.startsWith("image")) {
//             res.set("Content-Type", "image/jpeg");
//             res.send(file.processedData);
//         } else {
//             res.status(400).json({ error: "Unsupported file type" });
//         }

//     } catch (error) {
//         console.error("Error retrieving processed file:", error);
//         res.status(500).json({ error: "Error retrieving file." });
//     }
// });
