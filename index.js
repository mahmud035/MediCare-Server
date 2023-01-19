const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('colors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MediCare server is running');
});

//* Mongodb Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yeflywl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Database connected'.yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
};

dbConnect();

//* Collections
const allRecordCollection = client.db('mediCareDBUser').collection('allRecord');

//* -------------------------GET(READ)-------------------------
// get all patient records
app.get('/records', async (req, res) => {
  try {
    const doctorEmail = req.query.email;
    const query = {
      doctorEmail: doctorEmail,
    };
    const allRecord = await allRecordCollection.find(query).toArray();
    res.send(allRecord);
  } catch (error) {
    console.log(error.message.bold);
  }
});

// get specific patient's record for updating
app.get('/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) };
    console.log(query);
    const record = await allRecordCollection.findOne(query);
    res.send(record);
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* -------------------------POST(CREATE)-------------------------
// post a new patient record
app.post('/records', async (req, res) => {
  try {
    const patientRecordObj = req.body;
    const result = await allRecordCollection.insertOne(patientRecordObj);
    res.send(result);
  } catch (error) {
    console.log(error.message.bold);
  }
});

//* ----------------------PUT/PATCH(UPDATE)----------------------
/* app.put('/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const filter = { _id: ObjectId(id) };
    // console.log(filter);
    const updatedRecord = req.body;
    // console.log(updatedRecord);
    const updatedRecordObject = {
      $set: {
        patientName: updatedRecord.patientName,
        age: updatedRecord.age,
        bloodPressure: updatedRecord.bloodPressure,
        phoneNumber: updatedRecord.phoneNumber,
        diseaseName: updatedRecord.diseaseName,
        treatment: updatedRecord.treatment,
        nextAppointment: updatedRecord.nextAppointment,
      },
    };
    const result = await allRecordCollection.updateOne(
      filter,
      updatedRecordObject
    );
    res.send(result);
  } catch (error) {
    console.log(error.message.bold);
  }
}); */

//* ---------------------DELETE(DELETE)------------------------
// delete a patient record
app.delete('/records/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await allRecordCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.log(error.message.bold);
  }
});

app.listen(port, () => {
  console.log('Server up and running'.cyan.bold);
});
