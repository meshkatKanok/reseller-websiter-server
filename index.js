const express=require('express')
const app=express();
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const port=process.env.port || 5000;
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.get('',(req,res)=>{
    res.send("car is running")
})


const uri =`mongodb+srv://${process.env.car_user}:${process.env.car_pass}@cluster0.tasnahm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function verifyJWT(req,res,next){
    const authHeader=req.headers.authorization
    if(!authHeader){
        return res.status(401).send('unauthorized access')
    }
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN,function(err,decoded){
        if(err){
            return res.status(403).send({message:'forbidden access'})
        }
        req.decoded=decoded
        next()
    })

}
async function run(){
    try{
        const carsData=client.db("car").collection("catagorey");
        const Userdata=client.db("car").collection("userData");
        const bookingCollection=client.db("car").collection("bookingdata");
        const addpruductCollection=client.db("car").collection("addproduct");
        const addppost=client.db("car").collection("addpost");
        app.get('/categorey',async(req,res)=>{
            const query={}
            const cursor=carsData.find(query)
            const services=await cursor.toArray()
            res.send(services);
        })
        app.get('/ads',async(req,res)=>{
    const query={}
    const cursor= addppost.find(query)
    const addpost=await cursor.toArray()
    res.send(addpost)
        })
        app.get('/catagoreyitem/:id',async(req,res)=>{
            const id=req.params.id
            const query={ _id:ObjectId(id)}
            const allcars=await carsData.findOne(query)
            res.send(allcars)
        })
        app.get('/bookingdata',async(req,res)=>{
            const query={}
            const cursor=bookingCollection.find(query)
            const bookdata=await cursor.toArray()
            res.send(bookdata)
        })
        //jwt token--------------------------------
        app.get('/jwt',async(req,res)=>{
            const email=req.query.email
            const query={email:email};
            const user=await Userdata.findOne(query)
            if(user){
                const token=jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn:'1h'})
              return  res.send({accesstoken:token})
            }
            console.log(user);
            res.status(403).send({accesstoken:"invaild Access"})
        })

        app.get('/userdata',async(req,res)=>{
            const query={}
            const cursor=Userdata.find(query)
            const alluser=await cursor.toArray()
            res.send(alluser)

        })
        app.get('/addpruduct', async(req,res)=>{
            const query={}
            const cursor= addpruductCollection.find(query)
            const alladddata= await cursor.toArray()
            res.send(alladddata)
        })
        app.get('/ads/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const cursor= addpruductCollection.find(query)
            const alladddata= await cursor.toArray()
            res.send(alladddata)

        })
        // Seler data------------
    app.get('/user/seler/:email',async(req,res)=>{
        const email=req.params.email
        console.log(email);
        const query={email:email}
        const user=await Userdata.findOne(query)
        res.send({isSeller:user?.selectoption==='Seller'})
    })
    //Buyer data---------
    app.get('/user/buyer/:email',async(req,res)=>{
        const email=req.params.email
        console.log(email);
        const query={email:email}
        const user=await Userdata.findOne(query)
        res.send({isBuyer:user?.selectoption==='Buyer'})
    })


    // Admin pannel-----------
    app.get('/user/admin/:email',async(req,res)=>{
        const email=req.params.email
        console.log(email);
        const query={email:email}
        const user=await Userdata.findOne(query)
        res.send({isAdmin:user?.selectoption==='Admin'})
    })

    app.get('/allseller',async(req,res)=>{
        const query={
            selectoption:"Seller"};
            const cursor=Userdata.find(query)
            const result=await cursor.toArray()
            res.send(result)
    })

app.get('/allbuyer',async(req,res)=>{
    const query={selectoption:'Buyer'};
    const cursor=Userdata.find(query)
    const result=await cursor.toArray()
    res.send(result)
})



        app.get('/signupuser',async(req,res)=>{
            const query={}
            const cursor=Userdata.find(query)
            const signupdata= await cursor.toArray()
            res.send(signupdata)
          })

        app.delete('/addpruduct/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const addprodelete=await addpruductCollection.deleteOne(query)
            res.send(addprodelete)
        })
        app.delete('/allseller/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const sellerdete=await Userdata.deleteOne(query)
            res.send(sellerdete)
        })
        app.delete('/allbuyer/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const buyerdelte=await Userdata.deleteOne(query)
            res.send(buyerdelte);
          })
        app.post('/ads',async(req,res)=>{
            const data=req.body
            const postdata=await addppost.insertOne(data)
            res.send(postdata)
        })
         
        
        app.post('/signupuser', async (req, res) => {
            const data = req.body;
            const userData = await Userdata.insertOne(data)
            res.send(userData)
          })
        app.post('/addpruduct', async (req, res) => {
            const data = req.body;
            const addpruductcoll = await addpruductCollection.insertOne(data)
            res.send(addpruductcoll)
          })

          app.post('/bookingcollection',async(req,res)=>{
            const data=req.body
            const bookdata=await bookingCollection.insertOne(data)
            res.send(bookdata)
          })
          
          
      

    }
    finally{

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`carr running on ${port}`)
})