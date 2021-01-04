const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const  cors = require('cors')
const session = require("express-session")
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Doc = require('./models/Doc');


// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;




const findOrCreate = require('mongoose-findorcreate');
app.use(express.json())
app.use(cookieParser())


mongoose.connect("mongodb://localhost:27017/virtualNoteDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    });
  mongoose.set("useCreateIndex",true);
mongoose.set('useFindAndModify', false);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', ' POST, GET, OPTIONS');
    next();
})



const PORT = process.env.PORT || 8000;

app.get("/publish/:id",(req,res) => {
    const id = req.params.id;
    const document_id = id.slice(0,24)
    const note_id = id.slice(24,id.length);

    Doc.findById(document_id, function (err, doc) {
        if(!err){
            const note = doc.notes.find(e => e.id === note_id)
            if(note && note.isShared){
                res.status(200).send(note)
            }

            else{
            res.status(404).send("No Document")

            }
            
        }
        else{
            res.status(400).send(err);
        }
    });

})



const userRouter = require('./routes/User');
app.use('/user',userRouter);

//  const User = new mongoose.model("User",userSchema);
//  const Doc = new mongoose.model("Doc",docSchema);
//  const Trash = new mongoose.model("Trash",trashSchema);

//  const docData = new Doc({
     
//     notes:[{
//     id:'18',
    
//     time:new Date(),
//     tags:[
//         'virtual',"AI","note"
//     ],
//     isShared:false,
//     link:'',
//     note:'<h1><u>Welcome to Virtual note!</u></h1><p><br></p><p>To create a new note, click on the new note button.</p><p><br></p><p>To search your notes, type in the search bar and enter any text. Virtual note will show you matching results instantly.</p><p><br></p><p>Got a really important note? Open the note info bar and press the button to pin it to the top of the list.</p><p><br></p><p>Use tags to help organize your notes. Look for the tag bar at the bottom of the note editor.</p><p><br></p><p>Deleted notes go in the trash. You can restore them if you want, or empty the trash to get rid of them forever.</p><p><br></p><p>We hope you enjoy using Virtual note!</p>'
// }],

// trash:[{
//     id:'18',
    
//     time:new Date(),
//     tags:[
//         'virtual',"AI","note"
//     ],
//     isShared:false,
//     link:'',
//     note:'<h1><u>Welcome to Virtual note!</u></h1><p><br></p><p>To create a new note, click on the new note button.</p><p><br></p><p>To search your notes, type in the search bar and enter any text. Virtual note will show you matching results instantly.</p><p><br></p><p>Got a really important note? Open the note info bar and press the button to pin it to the top of the list.</p><p><br></p><p>Use tags to help organize your notes. Look for the tag bar at the bottom of the note editor.</p><p><br></p><p>Deleted notes go in the trash. You can restore them if you want, or empty the trash to get rid of them forever.</p><p><br></p><p>We hope you enjoy using Virtual note!</p>'
// }],
// userID:'123456',

// },)
// docData.save()
  
//   app.post("/user" ,(req ,res) => {
//       const data = {
//           name : req.body.name,
//           email : req.body.email

//       }

//       const user = new User(data)
//       user.save(function(err,result){
//           if(err){
//               res.status(400).send(JSON.stringify("Something went wrong"))
//           }
//           else {
//               res.status(201).send(JSON.stringify("Created"))
//           }
//       })
//   })



//   app.get("/note",(req,res) => {
//       const userId = '123456';
//       Doc.findOne({ userID: userId },'notes trash _id', function (err, note) {
//           if(!err){
//       res.status(200).send(JSON.stringify(note))
//     }
//       else{
//       res.status(401).send(err)}

//       });
//   })


  


app.listen(PORT , () => {
    console.log('Backend server successfully started at PORT' + PORT);
})