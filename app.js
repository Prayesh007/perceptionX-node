// app.js
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const File = require("./models/perceps.js");
const { spawn } = require("child_process");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const http = require("http");
const socketIo = require("socket.io");
const os = require("os");


const pythonAPI = process.env.PYTHON_API_URL;  // dynamically read from env

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
const dbUrl = process.env.MONGO_URI || "mongodb+srv://aitools2104:kDTRxzV6MgO4nicA@cluster0.tqkyb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbUrl, {})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Failed:", err));

// Multer config (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Socket
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Views
app.get("/", (req, res) => {
    res.render("./perceps/index.ejs");
});

app.get("/detect", (req, res) => {
    res.render("./perceps/detect.ejs");
});

// Determine correct python command (fallback)
function getPythonCmd() {
    if (process.env.PYTHON_CMD) return process.env.PYTHON_CMD;
    return os.platform() === "win32" ? "python" : "python3";
}

// Timeout for python processing (ms)
const PY_TIMEOUT = parseInt(process.env.PY_TIMEOUT || "5") * 60 * 1000; // default 5 minutes

// Helper: spawn local python script and stream progress to socket.io
function spawnLocalPython(fileId, fileType) {
    return new Promise((resolve, reject) => {
        const pythonCmd = getPythonCmd();
        const pythonScript = path.join(__dirname, "app.py");
        console.log(`🚀 Spawning local Python using: ${pythonCmd} ${pythonScript} ${fileId} ${fileType}`);

        const pythonProcess = spawn(pythonCmd, [pythonScript, fileId, fileType], {
            env: { ...process.env }
        });

        let timedOut = false;
        const timeoutHandle = setTimeout(() => {
            timedOut = true;
            try { pythonProcess.kill(); } catch (e) {}
            console.error("Python process killed due to timeout.");
            reject(new Error("python_timeout"));
        }, PY_TIMEOUT);

        pythonProcess.stdout.on("data", (data) => {
            const str = data.toString();
            process.stdout.write(`Python Output: ${str}`);
            const progressMatch = str.match(/Progress:\s*(\d+)%/);
            if (progressMatch) {
                io.emit("progress", parseInt(progressMatch[1]));
            }
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`Python Error: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            clearTimeout(timeoutHandle);
            if (timedOut) return; // already rejected
            console.log("Python process closed with code:", code);
            if (code === 0) {
                io.emit("progress", 100);
                resolve();
            } else {
                reject(new Error(`python_exit_${code}`));
            }
        });

        pythonProcess.on("error", (err) => {
            clearTimeout(timeoutHandle);
            reject(err);
        });
    });
}

// Primary upload & process route
app.post("/process", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const fileType = req.file.mimetype && req.file.mimetype.startsWith("image") ? "image" : "video";
    console.log("Received file of type:", fileType);

    try {
        const newFile = new File({
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer,
            processedData: null
        });

        const savedFile = await newFile.save();
        console.log("File successfully saved with ID:", savedFile._id.toString());

        // If a Python microservice URL is provided, prefer calling it
        const pythonApi = (process.env.PYTHON_API_URL || process.env.PY_SERVICE_URL || "").trim() || null;

        if (pythonApi) {
            const endpoint = pythonApi.replace(/\/$/, "") + "/process";
            try {
                console.log(`➡️ Calling Python service at ${endpoint} for file ${savedFile._id}`);
                await axios.post(endpoint, {
                    fileId: savedFile._id.toString(),
                    fileType: fileType
                }, {
                    timeout: PY_TIMEOUT + 10000
                });

                // assume service processed and saved result
                io.emit("progress", 100);
                return res.json({ fileId: savedFile._id });
            } catch (err) {
                console.error("Error calling Python service:", err.message || err);
                // fallback to local python spawn
                try {
                    await spawnLocalPython(savedFile._id.toString(), fileType);
                    return res.json({ fileId: savedFile._id });
                } catch (err2) {
                    console.error("Fallback local python failed:", err2);
                    return res.status(500).json({ error: "Processing failed (both service + local)" });
                }
            }
        }

        // No python service configured — use local spawn
        try {
            await spawnLocalPython(savedFile._id.toString(), fileType);
            return res.json({ fileId: savedFile._id });
        } catch (err) {
            console.error("Local python processing failed:", err);
            return res.status(500).json({ error: "Processing failed (local)" });
        }
    } catch (error) {
        console.error("Error processing file:", error);
        return res.status(500).json({ error: "Error processing file." });
    }
});

// Add a JSON-forwarding endpoint for direct API use (POST /detect)
app.post("/detect", async (req, res) => {
    const { fileId, fileType } = req.body || {};

    if (!fileId || !fileType) {
        return res.status(400).json({ error: "fileId and fileType required" });
    }

    // Read Python API URL from env (set on Render)
    const pythonApi = (process.env.PYTHON_API_URL || "").trim();
    const endpoint = pythonApi ? pythonApi.replace(/\/$/, "") + "/process" : null;

    if (endpoint) {
        // Call remote Python service
        try {
            const resp = await axios.post(
                endpoint,
                { fileId: fileId.toString(), fileType },
                { timeout: (parseInt(process.env.PY_TIMEOUT) || 30000) }
            );
            return res.status(resp.status).json(resp.data);
        } catch (err) {
            console.error("Error calling Python service:", err.message || err);
            // fallback to local Python if remote fails
        }
    }

    // Spawn local Python as fallback
    try {
        await spawnLocalPython(fileId.toString(), fileType);
        return res.json({ status: "ok", fileId });
    } catch (e) {
        console.error("Local Python processing failed:", e);
        return res.status(500).json({ error: "Processing failed" });
    }
});


// Show file (decide image vs video). Returns HEAD content-type for detection and renders for GET.
app.get("/file/:id", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).send("File not found");

        // For HEAD requests Express will call this route with method 'HEAD' automatically,
        // but we still check and return only headers if method is HEAD.
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
