var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var http = require('https');
var url = require('url');
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');

const GoogleRecaptcha = require('google-recaptcha')
const googleRecaptcha = new GoogleRecaptcha({secret: '6Le8GRQaAAAAAF0pX_Rp7IaErjS4GSR_MkaPEeRx'})

var port = process.env.PORT || 8080;
var emailAdmin = 'ofir.rahamim@e.braude.ac.il';     //******change username

var transporter = nodemailer.createTransport({
    host:'smtp.office365.com',
    port: 587,
    secure: false,
    auth:{
        user: emailAdmin,  
        pass: ''    //************* password for email
    },
    tls: {
        rejectUnauthorized: false
    }
});

var mailOptions = {
    from: emailAdmin,
    to: emailAdmin,
    subject: "",
    text: ""
};

const users =[];


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

const promoCodeDB = {ID:"", PromoCode: "", Description: ""};
const usersDB = {ID: "", Name: "", FamilyName: "", Email: "", PromoCode: "", PhoneNumber: "", Country: "", City: "", Street: "", ZipCode: "", Password: ""};

const {Pool, Client} = require('pg')
                                                //password
const connectionString = 'postgressql://postgres:123456@localhost:5432/projectDB'

const client = new Client({
  connectionString:connectionString
})

client.connect()

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}

app.post("/createUser",function(req,res){

    var { userFirstName, userLastName, userEmail, userPassword, userPromoCode } = req.body; 

    var query = 'select * from users where "Email"=\''+userEmail+'\'';
    query = parse('select * from users where "Email"= \'%s\'', userEmail);

    client.query(query, (err, respond)=>{
        console.log(respond);
        if(respond === undefined || respond.rowCount == 0) //user not exist, add user to database
        {
            client.query('INSERT INTO public.users("Name", "FamilyName", "Email", "PromoCode", "Password") VALUES ($1, $2, $3, $4, $5);',[userFirstName, userLastName, userEmail, userPromoCode, userPassword], (err, respond)=>{ 
                console.log(respond.rowCount);
                if(respond.rowCount == 1)
                    res.redirect("/login.html");  
                else
                    res.send("database error, try again");
                res.end();
             });
        }      
        else    //return errot, user already exist
        {
            res.redirect("/register.html?not=1"); 
            res.end();
        }

      })
})


//insert into promocode table in database
app.get('/insertcode', function (req, res) {  //default page
    client.query('INSERT INTO public.promocode("PromoCode", "Description")VALUES($1, $2)',['aa', 'bb'], (err, respond)=>{
        console.log(err, respond)
        res.send(respond);
      })
}) 

//get users table from database
app.get('/getusers', function (req, res) {  //default page
    client.query('select * from users', (err, respond)=>{
        console.log(err, respond)
        res.send(respond);
        client.end()
    })
})   

app.get('/', function (req, res) {  //default page
    res.sendFile(__dirname+"/public/login.html",);
})

app.post("/login",function(req,res){
    //if(req.body.userEmail.toLowerCase() == "admin" && req.body.userPassword.toLowerCase() == "admin")
    //    res.redirect("/contactus");    

    var { userEmail, userPassword } = req.body; 

    var query = parse('select * from users where "Email"= \'%s\' and "Password"= \'%s\'', userEmail, userPassword);

    client.query(query, (err, respond)=>{
        console.log(respond);
        if(respond === undefined || respond.rowCount == 0) //user not exist, add user to database
        {
            res.redirect("/login.html?not"); 
        }      
        else    //user exist
        {
            res.redirect("/index.html"); 
            res.end();
        }

      })

    res.send("error");
})

app.post("/forgotPassword",function(req,res){
    res.send("sent email");
})

app.get('/contactus', function (req, res) {  
    res.sendFile(__dirname+"/public/contactus.html",);
})

app.get('/recapche', function (req, res) {  
    res.sendFile(__dirname+"/public/recapche.html",);
})
/*
http.on('POST', (request, response) => {
    const recaptchaResponse = request.body['g-recaptcha-response']
  
    googleRecaptcha.verify({response: recaptchaResponse}, (error) => {
      if (error) {
        return response.send({isHuman: false})
      }
  
      return response.send({isHuman: true})
    })
  })
*/

app.post('/recapche', function (req, res) {  
    //res.send(req.body['g-recaptcha-response']);

    // Some pseudo server code:

        var recaptchaResponse = req.body['g-recaptcha-response'];
        googleRecaptcha.verify({res : recaptchaResponse}, (error) => {
        if (error) {
            return res.send(error+{isHuman: false})
        } 
        return res.send({isHuman: true})
        })

})

app.get('/getAllData', function (req, res) {  
    var rawdata = fs.readFileSync('data.json');
    var jsondata = JSON.parse(rawdata);
    var newLocal = jsondata[0].id;
    res.send(newLocal);
})

app.post("/singup",function(req,res){

    var msgSingup = "";

    mailOptions.to = req.body.userEmail;
    mailOptions.subject = 'confirm mail';
    mailOptions.text = 'singup success';

    transporter.sendMail(mailOptions, function(error, info){
        if(error)
        {
            console.log(error);  
        }
        else
        {
            users.push({
                "userEmail":req.body.userEmail,
                "userPassword":req.body.userPassword
            });
            msgSingup = "success singup, email sent to address: " + req.body.userEmail;
            console.log(msgSingup);
            res.send(msgSingup);
        }
    });

})

app.post("/contactus",function(req,res){

    mailOptions.to = emailAdmin;
    mailOptions.subject = req.body.userTitle;
    mailOptions.text = "from: "+req.body.userName+"\nemail: "+req.body.userEmail + "\n\n" +req.body.userSubject;

    transporter.sendMail(mailOptions, function(error, info){
        if(error)
            console.log(error);  
        else
        {
            console.log("success sent message");
            res.send("success sent message");
        }
    });


})

app.listen(port, () => {
	console.log('App listening on port %d!', port);
});

