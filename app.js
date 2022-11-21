 const express=require("express");
 const bodyParser=require("body-parser");
 const mongoose= require("mongoose");
 var _ = require('lodash');

 const app=express();
 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))


const lorem="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
let posts=[];


mongoose.connect("mongodb+srv://admin-abdulillah:test123@cluster0.ur1gykz.mongodb.net/bloogDB",{useNewUrlParser:true});

const bloogContactSchema={
  title:String,
  bodyContant:String
}

const Bloog=mongoose.model("Bloog",bloogContactSchema);


const mainPageSchema={
  name:String,
  posts:[bloogContactSchema]
}

const Post=mongoose.model("Post",mainPageSchema);



app.get("/",function(req,res){


   Bloog.find({},function(err , foundItems){


    res.render("index",{ipsum:lorem,posts:foundItems});

   })

    
})

app.get("/about",function(req,res){
  res.render("about" ,{ipsum:lorem})
})

app.get("/contacts",function(req,res){
  res.render("contacts" ,{ipsum:lorem})
})

app.get("/compose" ,function(req,res){
  
  res.render("compose")
  
})


app.get("/posts/:postName",function(req,res){
  const paramsID=_.capitalize(req.params.postName) ;
  Post.findOne({name:paramsID},function(err , foundItems){
    res.render("post",{
            title:foundItems.posts[0].title,
            content:foundItems.posts[0].bodyContant
        })
      
        
  });

   });
 

app.post("/compose" ,function(req,res){
  Post.findOne({name:_.capitalize(req.body.title)}, function(err,foundItem){
  const bloog=new Bloog({
    title:_.capitalize(req.body.title),
    bodyContant:req.body.postt
  })

 const post= new Post({

  name:_.capitalize(req.body.title),
  posts:bloog
 })
 
  if(!foundItem){
    
    bloog.save();
    post.save();


  }else{
    Post.findOneAndDelete({name:_.capitalize(req.body.title)},function(err,foundList){
      if(!err){
        post.save();
        Bloog.findOneAndDelete({title:_.capitalize(req.body.title)},function(err,foundList){
        if(!err){
          bloog.save();
        }
        })
        
      }else{
        console.log(err)
      }
    })

  }
 
  })
 
  res.redirect("/")
})


app.listen(process.env.PORT|| 3000, function() {
  console.log("Server started on port 3000");
});

