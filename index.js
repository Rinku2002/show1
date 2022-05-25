const express = require("express");
const app = express();
const mclient=require("mongodb").MongoClient;
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const expressAsyncHandler = require("express-async-handler");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, "./frontend/build")));

//DB connection URL
const DBurl="mongodb+srv://rinku:Rinku%402002@cluster0.u9rsl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.get(
  "/api/courses",
  expressAsyncHandler( (req, res) => {

    //connect with mongoDB server
    mclient.connect(DBurl)
    .then( async (client)=>{

      //get DB object
      let dbObj=client.db("FE");
      //create collection objects
      let coursesCollectionObject=dbObj.collection("courses");
      console.log("DB connection success")
      //get all courses
      let courses = await coursesCollectionObject.find().toArray();
      //send res
      res.send({ message: "courses list", payload: courses });
    })
    .catch(err=>console.log('Error in DB connection ',err))

  })
);

app.get("/api/test", (req, res) => {
  res.send("test");
});

//dealing with page refresh
app.use('*', (request, response)=>{
  response.sendFile(path.join(__dirname, './frontend/build/index.html'))
})

//handling invalid paths
app.use((request, response, next) => {
  response.send({ message: `path ${request.url} is invalid` });
});

//error handling middleware
app.use((error, request, response, next) => {
  response.send({ message: "Error occurred", reason: `${error.message}` });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Running on port ${port}`));

module.exports = app;