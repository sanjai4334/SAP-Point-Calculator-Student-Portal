const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors'); // Include cors package

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
    
    
    console.log({regno:doc.regno}, { $set: {claimed:doc.claimed} });
    await collection.updateOne({regno:doc.regno}, { $set: {claimed:doc.claimed} });

    res.sendStatus(200); // Respond with success status
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
