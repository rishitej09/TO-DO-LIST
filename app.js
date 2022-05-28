//Package Requirements -->

const express = require ( "express" ) ; 
const bodyParser = require ( "body-parser" ) ;
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.set('view engine' , 'ejs');

//Data Base Connection -->

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB',{useNewUrlParser:true});

//Body Parser To Log The Input Given By User -->

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//Schema For DataBase

const itemsSchema = {
    name : String
};

//Model

const Item = mongoose.model('Item',itemsSchema);

//Constant Item Array -->

const item1 = new Item ({
    name: 'Welcome to your Todolist !'
});

const item2 = new Item ({
    name: 'Hit + button to Add !'
});

const item3 = new Item ({
    name: '<-- Hit Delete Button To Del !'
});

const defaultItems = [ item1 , item2 , item3];


//Schema -->

const listSchema = {
    name : String,
    items : [itemsSchema]
};

//Mongoose Model -->

const List = mongoose.model("List",listSchema);

//Falling Back To Default List Items If The List Is Empty -->

app.get("/" , function (req , res) {
    Item.find({},function(err,foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log('Successfuly Data Added To DB');
                }
            });
            res.redirect('/');
        }else{
    res.render("app" , {listTitle:'Today' , toDoList:foundItems });
        }
 });
});

// List For Willing Title (eg : Shopping , Groceries etc..)
//Express Route Parameters -->

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName) ;

    List.findOne({name: customListName},function(err , foundList){
        if(!err){
            if(!foundList){
                  const list = new List ({
                    name  : customListName,
                    items : defaultItems
                });
                list.save();
                res.redirect('/'+ customListName);
            }else{
                res.render("app",{listTitle:foundList.name , toDoList:foundList.items });
            }
        }
    });
});
            
//Saving The Items According To The Corresponding Lists -->

app.post("/" , function (req , res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
      name : itemName  
    });

    if (listName === "Today"){
            item.save();
            res.redirect("/");
    }   else {
        List.findOne({name: listName}, function( err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});


//Deleting The  List Item -->

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox ;
    const checkedItemId1 = checkedItemId.trim();
    const listName = req.body.listName;
     
    if(listName === "Today"){
        Item.findByIdAndRemove( checkedItemId1 ,function(err){
        if (err){
            console.log(err);
        }else{
            console.log('successfully deleted the checked item');
            res.redirect("/");
        }
    });
    } else {
        List.findOneAndUpdate(
            {name : listName},
            {$pull:{items:{_id:checkedItemId}}},function(err,foundList){
                if(!err){
                    res.redirect("/"+listName);
                }
            });
    }
});

//Port Login Statement -->

app.listen ( 3000 , function ( req , res ) {
    console.log("Your Port Is Running At 3000 ");
});