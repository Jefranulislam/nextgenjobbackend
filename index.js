const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://rakibjefranulislam:5r5kYNrNQnlWdRic@clusterone.sr3eetu.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
 
async function run() {
  try {
    
    const jobsCollection = client.db("jobsCollection").collection("jobs");
    const userCollection = client.db("jobsCollection").collection("applicant");
    await client.connect();
    app.get("/jobs", async (req, res) => {
      try {

        const query = {};
        const cursor = jobsCollection.find(query);
        const jobsinfo = await cursor.toArray();
        res.send(jobsinfo);
      } catch (error) {
        console.error(error);
        res.status(500).send("Serve error");
      }
    });

    app.get("/jobdetails/:jobId", async (req, res) => {
      try {
        const jobId = req.params.jobId;
        console.log(jobId);
        const query = { _id: new ObjectId(jobId) };
        const jobDetails = await jobsCollection.findOne(query);
        res.send(jobDetails);
        console.log(jobDetails);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }
    });

    app.post("/jobs", async (req, res) => {
      try {
        const jobInfo = req.body;
        const result = await jobsCollection.insertOne(jobInfo);
        if (result.insertedCount === 1) {
          return res
            .status(201)
            .json({
              message: "Job created successfully",
              jobId: result.insertedId,
            });
        } else {
          return res.status(500).json({ error: "Failed to create job" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }
    });
    

      //Signin 

      app.put('/user/:email',async(req,res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter ={email: new email, role: new role};
        const options = {upsert: true};
        const updateDoc = {
          $set : user,
        };
        const result = await userCollection.updateOne(filter,updateDoc,options);
        res.send(result);
      })

      app.post('/signin', async (req, res) => {
        try {
          const user = req.body;
          // const { name, email, password, role } = req.body;
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
        res.send(accessToken);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });

      //Signup 
      app.post('/signup', async (req, res) => {
        try {
          const { name, email, password, role } = req.body;
          const accessToken = jwt.sign({ name, email, password, role}, process.env.ACCESS_TOKEN);
          res.json({accessToken});
        res.send(accessToken);
          console.log(accessToken);
        } catch (error) {
          res.status(500).json({ error: error.message });
          console.log(error);
        }
      });


























  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run();

app.get("/", (req, res) => {
  res.send("i am Going to hospital ");
});
app.listen(port, () => {
  console.log("i am Going to hospital ");
});
