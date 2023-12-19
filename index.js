const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const uri = process.env.URI;
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
    const userCollection = client.db("userCollection").collection("user");
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
            
          app.put("/jobs/:id", async (req, res) => {
            try {
              const jobId = req.params.id;
              const updatedJobInfo = req.body;

              const result = await jobsCollection.updateOne(
                { _id: new ObjectId(jobId) },
                {
                  $set: updatedJobInfo,
                  $push: { applications: updatedJobInfo.applicationData } 
                }
              );

              if (result.modifiedCount === 1) {
                return res.status(200).json({
                  message: "Job Updated",
                  jobId: jobId,
                });
              } else {
                return res.status(404).json({ error: "Job not found or not updated" });
              }
            } catch (error) {
              console.error(error);
              res.status(500).send("Server error");
            }
          });



app.put('/signin/:email', async (req,res)=>{

try{
  const userInfo = req.body;
  
  const result = await userCollection.insertOne({ userInfo});
  if (result.insertedCount === 1) {
    return res
      .status(201)
      .json({
        message: "User updated successfully",
        userInfo: result.insertedId,
      });
  }
  res.send(result);
}
catch (error){
console.log(error);
}

})


      //Signup 
      app.put('/api/signup', async (req, res) => {
        try {
          const  userInfo  = req.body;
      
        const result = await userCollection.insertOne({ userInfo});
        if (result.insertedCount === 1) {
          return res
            .status(201)
            .json({
              message: "User updated successfully",
              userInfo: result.insertedId,
            });
        }
        res.send(result);
        res.send(result._id);
        console.log(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
          console.log(error);
        }
      });
      
      
      //Signup 
      app.post('/api/signup', async (req, res) => {
        try {
          const { name, email, password, role } = userInfo; 
          userInfo = req.body;
      
        const result = await userCollection.insertOne({ name, email, password, role });
        if (result.insertedCount === 1) {
          return res
            .status(201)
            .json({
              message: "User created successfully",
              userInfo: result.insertedId,
            });
        }
        res.send(result);
        console.log(result);
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
  res.send("WELCOME TO NEXTGENJOB");
});
app.get("/next", (req, res) => {
  res.send("WELCOME TO NEXTGENJOB");
});
app.listen(port, () => {
  console.log("WELCOME TO NEXTGENJOB ");
});
