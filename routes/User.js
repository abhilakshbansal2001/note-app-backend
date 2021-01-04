const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Doc = require('../models/Doc');
const Notes = require('../NotesJSON')


const signToken = userID =>{
    return JWT.sign({
        iss : "abhilakshBansal",
        sub : userID
    },"abhilakshBansal",
    {expiresIn : "1d"});
}

userRouter.post('/register',(req,res)=>{
    const { username,password,name } = req.body;
    User.findOne({username},(err,user)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        if(user)
            res.status(400).json({message : {msgBody : "Email is already taken", msgError: true}});
        else{
/////
        const doc = new Doc({
            notes:[...Notes],
            trash:[...Notes],
        });

        doc.save(err=>{
            if(err)
                res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
            else{

                const newUser = new User({username,name,password});

                newUser.doc_id = doc;
                newUser.save((err,doc)=>{
                    if(err)
                        res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
                    else{
                        const token = signToken(doc._id);
                        res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
                        res.status(200).json({message : {msgBody : "User created", msgError : false},isAuthenticated : true,user:{doc_id:doc.doc_id._id,username:doc.username,name:name}});}
                });
            }
        })
/////
            
        }
    })
});


userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{
    if(req.isAuthenticated()){
       const {doc_id ,_id,username,name} = req.user;
       const token = signToken(_id);
       res.cookie('access_token',token,{httpOnly: true, sameSite:true}); 
       res.status(200).json({isAuthenticated : true,user : {username,name,doc_id}});
    }
    
});

userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
    res.clearCookie('access_token');
    res.json({user:{username : "",doc_id:"",name:""},success : true});
});

userRouter.post('/note',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {notes , doc_id} = req.body;
    var query = { _id: doc_id };
    Doc.findOneAndUpdate(query, { notes: notes }, (err,result) => {
        if(!err){
            res.status(200).json({message : {msgBody : "NoteDoc Updated", msgError : false}});
        }
        else{
            res.status(500).json({message : {msgBody : "Error has occured while updating", msgError: true}});
        }
    })
    

});
//trash update
userRouter.post('/trash',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {trash , doc_id} = req.body;
    var query = { _id: doc_id };
    Doc.findOneAndUpdate(query, { trash: trash }, (err,result) => {
        if(!err){
            res.status(200).json({message : {msgBody : "Trash Updated", msgError : false}});
        }
        else{
            res.status(500).json({message : {msgBody : "Error has occured while updating", msgError: true}});
        }
    })
    

});

userRouter.get('/note',passport.authenticate('jwt',{session : false}),(req,res)=>{
    User.findById({_id : req.user._id}).populate('doc_id').exec((err,document)=>{
        if(err)
            res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else{
            res.status(200).json({notes : document.doc_id, isAuthenticated : true,message : {msgBody : "Trash Updated", msgError : false}});
        }
    });
});



userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
    const {username,doc_id,name} = req.user;
    res.status(200).json({isAuthenticated : true, user : {username,name,doc_id}});
});





module.exports = userRouter;