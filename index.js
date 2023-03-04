const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//middle wares

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://musicademydb:${process.env.DB_PASS}@musicademy.7cb9w1y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const courseCollection = client.db('musicademy').collection('courses');
        const reviewCollection = client.db('musicademy').collection('myreviews');
        const myCoursesCollection = client.db('musicademy').collection('mycourses');
        //Show all courses with 2 different object,one for all, one for limited items
        app.get('/courses', async(req,res)=>{
            const query= {};
            // sort in ascending (+1) order by length
            const sort = { course_id: 1 };
            const cursorFilter = courseCollection.find({course_id: { $lt:"4"}});
            const cursorAll = courseCollection.find(query);
            const courses =await cursorFilter.limit(3).sort(sort).toArray();
            const coursesAll =await cursorAll.sort(sort).toArray();
            res.send({courses,coursesAll});
        });
        //GET each course according to request 
        app.get('/courses/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const courseDetails = await courseCollection.findOne(query);
            res.send(courseDetails);
        });

        //POST a Review
        app.post('/myreviews', async(req,res) =>{
            const postReview = req.body;
            const Review = await reviewCollection.insertOne(postReview);
            res.send(Review);
        });
        //GET all review from review collection
        app.get('/myreviews', async(req,res)=>{
            const query = {};
            const showReviews = await reviewCollection.find(query).toArray();
            res.send(showReviews);
        });
        //GET specific review from review collection according to the user email
        app.get('/myreviews/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { Reviewer_email: id};
            const showIndividualReviews = await reviewCollection.find(query).toArray();
            res.send(showIndividualReviews);
        });
        //DELETE specific review from review collection
        app.delete('/myreviews/:id', async(req,res) =>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const deleteSingleReviews = await reviewCollection.deleteOne(query);
            res.send(deleteSingleReviews);
        })
        //UPDATE specific review from review collection
        app.put('/myreviews/:id', async(req,res) =>{
            const id = req.param.id;
            console.log(id);
            const filter = { _id: new ObjectId(id)};
            const updatedMessageBox = req.body;
            const option = {upsert: true};
            const updateMessage = {
                $set: {
                    Review: updatedMessageBox
                }
            }
            const updatedMessage = await reviewCollection.updateOne(filter, updateMessage, option);
            res.send(updatedMessage);
            console.log(updatedMessageBox);
        })
        //POST courses to mycourses collection
        app.post('/mycourses', async(req,res) =>{
            const courseDetails = req.body;
            const myCourses = await myCoursesCollection.insertOne(courseDetails);
            res.send(myCourses);
        });
        //GET all courses from mycourses collection
        app.get('/mycourses', async(req,res)=>{
            const query = {};
            const allCourses = await myCoursesCollection.find(query).toArray();
            res.send(allCourses);
        });
        //GET my courses from mycourses collection according to the user email
        app.get('/mycourses/:id', async(req,res)=>{
            const emailId = req.params.id;
            const query = { user_email: emailId};
            const showIndividualCourses = await myCoursesCollection.find(query).toArray();
            res.send(showIndividualCourses);
        });
        //DELETE specific course from course collection
        app.delete('/mycourses/:id', async(req,res) =>{
            const id = req.params.id;
            console.log(id)
            const query = { _id: id};
            const deleteSingleCourses = await myCoursesCollection.deleteOne(query);
            res.send(deleteSingleCourses);
        })
        
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