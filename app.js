const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected to MongoDB');

        // Accessing the database and collection
        const database = client.db('kec'); // Replace 'your_database_name' with your actual database name
        const collection = database.collection('studentDetails'); // Replace 'your_collection_name' with your actual collection name

        // Document to be inserted
        const documentToInsert = {
            "regno":"22ITR089",
            "name":"Sanjai S",
            "dpmt":"Information Technology",
            "year":"2",
            "sec":"B",
            "sem":"4",
            "academicYear":"2023-2024",
            "mentor":"",
            "email":"sanjais.22it@kongu.edu",
            "phone":"6381296600",
        };

        // Insert the document into the collection
        const result = await collection.insertOne(documentToInsert);
        console.log(`${result.insertedCount} document(s) inserted with the _id: ${result.insertedId}`);
        
    } finally {
        // Close the connection when your app is terminated
        await client.close();
    }
}

run().catch(console.error);
