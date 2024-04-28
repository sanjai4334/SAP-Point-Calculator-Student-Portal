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


    console.log({ regno: doc.regno }, { $set: doc });
    
    // Remove _id from doc since it cannot be updated
    delete doc._id;

    await collection.updateOne({ regno: doc.regno }, { $set: doc });

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
    // Extract registration number from request body
    const regno = req.body.regno;
    // Get current timestamp
    const timestamp = Date.now();
    // Get file extension
    const ext = path.extname(file.originalname);
    // Construct new filename
    const filename = `${regno}_${timestamp}${ext}`;
    // Pass the new filename to multer
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Handle POST request to upload file
app.post('/upload', upload.single('file'), (req, res) => {
  // File has been uploaded
  // Get the filename from req.file
  const filename = req.file.filename;
  // Send the filename back to the client
  res.json({ filename });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
