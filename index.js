const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

//middle wares

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://musicademydb:${process.env.DB_PASS}@musicademy.7cb9w1y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db()
    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/',(req,res) =>{
    res.send('***Musicademy Server is running***')
})

app.listen(port, () => {
    console.log(`Musicademy server is running on ${port}`);
})