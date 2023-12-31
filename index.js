const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


/* Midelware */

app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
    res.send('Baby Toys Server Running')
})






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyhhy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();


        const toysCollection = client.db("babyToysDB").collection("allToys");




        app.get('/alltoys', async (req, res) => {
            const result = await toysCollection.find().toArray()
            res.send(result)


        })

        app.get('/mytoys', async (req, res) => {
            const email = req.query.email;
            let query = {}
            if (req.query?.email) {
                query = { sellerEmail: email }
            }
            const result = await toysCollection.find(query).toArray()
            res.send(result)
        })




        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const toy = await toysCollection.findOne(query);
            res.send(toy)


        })


        app.post('/alltoys', async (req, res) => {
            const toy = req.body;
            console.log(toy);
            const result = await toysCollection.insertOne(toy);
            res.send(result)
        })


        app.delete('/mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query);
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





















app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})