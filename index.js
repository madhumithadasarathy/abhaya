import express from "express";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

let latestFrame = null;

// ESP32 uploads image here
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image");
  }
  latestFrame = req.file.buffer;
  res.send("OK");
});

// Browser fetches latest image here
app.get("/stream", (req, res) => {
  if (!latestFrame) {
    return res.status(404).send("No frame yet");
  }
  res.set("Content-Type", "image/jpeg");
  res.set("Cache-Control", "no-store");
  res.send(latestFrame);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
