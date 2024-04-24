const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected to MongoDB');

        // Accessing the database and collection
        const database = client.db('kec'); // Replace 'your_database_name' with your actual database name
        const collection = database.collection('studentDetails'); // Replace 'your_collection_name' with your actual collection name

        // Document to be inserted
        const documentToInsert = {
            "regno": "22ITR066",
            "name": "Nadin C",
            "dpmt": "Information Technology",
            "year": "2",
            "sec": "B",
            "sem": "4",
            "academicYear": "2023-2024",
            "mentor": "Dr. Shantha Kumari R",
            "email": "nadinc.22it@kongu.edu",
            "phone": "7904623774",
            "dob": "30/03/2005",
            "claimed": 0
        };

        // Insert the document into the collection
        const result = await collection.insertOne(documentToInsert);
        console.log(`${result.insertedCount} document(s) inserted with the _id: ${result.insertedId}`);

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Close the connection when your app is terminated
        await client.close();
        console.log('MongoDB connection closed');
    }
}

run().catch(console.error);
