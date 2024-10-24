const express = require("express");
const cors = require("cors"); // Import CORS
const multer = require("multer");
const vision = require("@google-cloud/vision");
const path = require("path"); // Import path module

const app = express();
const upload = multer(); // To handle file uploads

// Enable CORS for all routes and origins
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Path where client is stored

const client = new vision.ImageAnnotatorClient();

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const request = {
      image: { content: req.file.buffer },
    };

    const [result] = await client.labelDetection(request);
    console.log("Vision API result:", result);

    const labels = result.labelAnnotations.map((label) => label.description);
    res.json({ labels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
