// For Express & Body Parser To use in app .

const express = require ( "express" ) ; 
const bodyParser = require ( "body-parser" ) ;
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();
app.set('view engine' , 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB',{useNewUrlParser:true});


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const itemsSchema = {
    name : String
};

const Item = mongoose.model('Item',itemsSchema);

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

const listSchema = {
    name : String,
    items : [itemsSchema]
};

const List = mongoose.model("List",listSchema);

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

//Express Route Parameters
app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName ;


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

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox ;
    const checkedItemId1 = checkedItemId.trim();
    
    Item.findByIdAndRemove( checkedItemId1 ,function(err){
        if (err){
            console.log(err);
        }else{
            console.log('successfully deleted the checked item');
            res.redirect("/");
        }
    });
});



app.listen ( 3000 , function ( req , res ) {
    console.log(" Your Port Is Running At 3000 ");
});