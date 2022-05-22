// For Express & Body Parser To use in app .

const express = require ( "express" ) ; 
const bodyParser = require ( "body-parser" ) ;
const ejs = require("ejs");

const app = express();
app.set('view engine' , 'ejs');

var lists = [];

app.use(bodyParser.urlencoded({extended:true}));

app.get("/" , function (req , res) {
    var today = new Date();
    var options = {
        weekday:"long",
        day:"numeric",          //creating format
        month:"long"
    }

    var presentDay = today.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
    
    res.render("app" , {currentDay:presentDay , toDoList:lists });
});

app.post("/" , function (req , res) {
    var input = req.body.list;
    lists.push(input);
    res.redirect("/");
});


app.listen ( 3000 , function ( req , res ) {
    console.log(" Your Port Is Running At 3000 ");
});
