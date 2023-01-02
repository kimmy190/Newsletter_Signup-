const express = require('express'); 
const app = express(); 
const port = process.env.PORT; // dynamic port 

const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended : true})); 

app.use(express.static("static"));

const request = require('request');
const { redirect } = require('express/lib/response');

// mailchimp : 
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
    apiKey: "1a2c8352ee425d9ac0b92a576525e6a9-us21",
    server: "us21",
});

// Get method for the client 
app.get("/", function(req, res){
    // if statement 
    res.sendFile(__dirname + "/signup.html"); 
});

app.post(['/'], function(req, res){
    
    var firstName = req.body.firstName; 
    var lastName = req.body.lastName;
    var email = req.body.email;
    const listId = "dc735021c4"; 

    // mailchimp ==================================================
    const run = async () => {
        const response = await client.lists.batchListMembers(listId, {
            members: [
                {
                    email_address: email, 
                    status : "subscribed", 
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName,
                    }
                }
            ]
        });
        //console.log(response);
        res.sendFile(__dirname + "/success.html");

        // console.log(response.new_members);
    };
    
    run().catch(e => 
        res.sendFile(__dirname + "/failure.html")
    );
    // ============================================================
});

app.post('/failure', function(req, res){
    // res.sendFile(__dirname + "/signup.html"); 
    res.redirect("/");
});


app.listen(port || 3000, function(){
    console.log("Server is running on port" + port);
});

// apiKey = 1a2c8352ee425d9ac0b92a576525e6a9-us21 
// server prefix : us21
// list id = dc735021c4  needed to write a method for letting us to add subscribers 