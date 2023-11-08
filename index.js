const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzichn4.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const serviceCollection = client.db('tourTravel').collection('tour');
const BookingCollection = client.db('tourTravel').collection('booking');
app.get('/service', async(req,res)=>{
    const cursor = serviceCollection.find();
    const result = await cursor.toArray();
    res.send(result);
});




app.get('/service/:id',async(req,res)=>{
  const id =req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await serviceCollection.findOne(query);
  res.send(result);
  
});

// search email
app.get('/service/:service_email', async (req,res)=>{
  console.log(req.query);
  
  const service_email = req.params.service_email;
  const result = await serviceCollection.find({service_email: service_email}).toArray();
  res.send(result)
})
// Add Services 
app.post('/service', async(req,res)=>{
  const AddNewService = req.body;
  console.log(AddNewService);
  const result = await serviceCollection.insertOne(AddNewService);
  res.send(result);
});
// search by email


// bookings 


app.post('/bookings', async(req,res)=>{
  const BookProducts = req.body;
  console.log(BookProducts);
  const result = await BookingCollection.insertOne(BookProducts);
  res.send(result);
});
app.get('/bookings/:ServiceEmail', async (req,res)=>{
  console.log(req.query.ServiceEmail);
  
  
  const result = await BookingCollection.find(query).toArray();
  res.send(result)
})

app.get('/bookings', async(req,res)=>{
  const cursor = BookingCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get('/',(req,res)=>{
    res.send('Server Running Successfully');
});

app.listen(port,()=>{
    console.log(`Server Running at Port ${port}`)
});
