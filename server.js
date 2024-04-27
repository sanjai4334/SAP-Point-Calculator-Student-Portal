const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors'); // Include cors package
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Replace this URI with your actual MongoDB connection string
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri); // No deprecated options

app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // Allow CORS requests from all origins

app.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    await client.connect();
    const database = client.db('kec');
    const collection = database.collection('studentDetails');

    const doc = { regno: req.body.registerNumber };

    const result = await collection.findOne(doc);
    console.log(`Document found: ${result}`);
    res.json(result); // Send user data back to client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.put('/update', async (req, res) => {
  console.log(req.body);
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    await client.connect();
    const database = client.db('kec');
    const collection = database.collection('studentDetails');

    const doc = req.body.userDetails;


    console.log({ regno: doc.regno }, { $set: { claimed: doc.claimed } });
    await collection.updateOne({ regno: doc.regno }, { $set: { claimed: doc.claimed } });

    res.sendStatus(200); // Respond with success status
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});


// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now(); // Get current timestamp
    const ext = path.extname(file.originalname); // Get file extension
    const filename = `${timestamp}${ext}`; // Concatenate timestamp and extension
    cb(null, filename); // Use the new filename
  }
});

const upload = multer({ storage: storage });

// Handle POST request to upload file
app.post('/upload', upload.single('file'), (req, res) => {
  // File has been uploaded
  const timestamp = Date.now(); // Get current timestamp
  const ext = path.extname(req.file.originalname); // Get file extension
  const newFilename = `${timestamp}${ext}`; // Concatenate timestamp and extension
  res.send(`http://localhost:3000/uploads/${newFilename}`); // Send the new filename back to the user
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
