
const { MongoClient, ServerApiVersion } = import('mongodb');

const uri = "mongodb://Umarmk01:TrustPayEcommerceEcommerceGlobal1967@ac-4c4oalj-shard-00-00.qcsvwc2.mongodb.net:27017,ac-4c4oalj-shard-00-01.qcsvwc2.mongodb.net:27017,ac-4c4oalj-shard-00-02.qcsvwc2.mongodb.net:27017/?ssl=true&replicaSet=atlas-lazzf4-shard-0&authSource=admin&appName=Cluster0";


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

    // Connect the client to the server    (optional starting in v4.7)

    await client.connect();

    // Send a ping to confirm a successful connection

    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {

    // Ensures that the client will close when you finish/error

    await client.close();

  }

}

run().catch(console.dir);


