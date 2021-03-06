const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https  = require("https")
const app = express();
require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const authentication = process.env.AUTH ;

app.get("/" , function(req , res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(req , res){

const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;

const data = {
  members : [
    {
      email_address: email ,
      status : "subscribed" ,
      merge_fields: {
        FNAME : firstName ,
        LNAME : lastName
      }
    }
  ]
}

var jsonData = JSON.stringify(data)

const url ="https://us5.api.mailchimp.com/3.0/lists/38b06727d1"

const options ={
  method : "post",
  auth: "saurav:"+authentication
}

const request = https.request(url, options , function(response) {

if (response.statusCode=== 200){
  res.sendFile(__dirname + "/sucess.html")
}
else{
  res.sendFile(__dirname + "/failure.html")
}

 response.on("data" , function(data){
   console.log(JSON.parse(data));
 })
})

request.write(jsonData);
request.end();
})

app.post("/failure" , function(req , res){
  res.redirect("/");
})

app.listen(process.env.PORT || 300 , function(){
  console.log("running dude");
});
