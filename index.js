// Import required modules
const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const path = require('path');

// Initialize Express app
const app = express();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize Google Cloud Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, 'qwiklabs-gcp-00-edd6a845c2e8-3a7472895710.json'), // Update with your JSON key file path
});

// Serve static files
app.use(express.static('public'));

// Define a route to serve the HTML form
app.get('/', (req, res) => {
  res.send(`
    <h1>Upload an Image for Label Detection</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="pic" accept="image/*" required>
      <input type="submit" value="Upload Image">
    </form>
  `);
});

// Define a route to handle image uploads and process with Google Cloud Vision API
app.post('/upload', upload.single('pic'), async (req, res) => {
  try {
    // Perform label detection on the uploaded image
    const [result] = await client.labelDetection(req.file.path);
    const labels = result.labelAnnotations.map(label => label.description);

    // Send back the detected labels in a formatted HTML response
    res.send(`
      <h1>Detected Labels</h1>
      <ul>${labels.map(label => `<li>${label}</li>`).join('')}</ul>
      <a href="/">Upload Another Image</a>
    `);
  } catch (error) {
    console.error('Error processing the image:', error);
    res.status(500).send('Error processing the image. Please try again later.');
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
