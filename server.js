var express = require('express');
var bodyParser = require('body-parser')
var http = require('https');
var url = require('url');
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var urlCrypt = require('url-crypt')('~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

var app = express();
var port = process.env.PORT || 8080;
var siteAddress = "http://localhost:8080";
//var siteAddress = "https://clientserver-heroku-app.herokuapp.com";

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

app.use(cookieParser());
app.use(session({ secret: "Shh, its a secret!" }));

//connect to database
const { Pool, Client } = require('pg')          // \/-password
const connectionString = 'postgressql://postgres:123456@localhost:5432/projectDB'
//const connectionString = 'postgres://mljdwduwquxtfb:60b3e7a165b4b9f79ff8a0674cc898c3ccc5cbd8eedce5d81796a9788f7f8b30@ec2-52-208-138-246.eu-west-1.compute.amazonaws.com:5432/daicv71v0u3vqi'
const client = new Client({
    connectionString: connectionString
});
client.connect();

//email sender options
var emailAdmin = 'ofir.rahamim@e.braude.ac.il';     //******change username
var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: emailAdmin,
        pass: '**'    //************* password for email
    }


});
var mailOptions = {
    from: emailAdmin,
    to: emailAdmin,
    subject: "",
    text: ""
};

app.listen(port, () => {
    console.log('App listening on port %d!', port);
});

function parse(str) {   //function for string formatting with %s
    var args = [].slice.call(arguments, 1), i = 0;
    return str.replace(/%s/g, () => args[i++]);
}

/* -------- get request, show wesite pages */

app.get('/dashboard', function (req, res) {  //default page, dashboard
    res.sendFile(__dirname + "/public/index.html",);
});

app.get('/sign-in', function (req, res) {  //open login page
    res.sendFile(__dirname + "/public/login.html",);
});

app.get('/sign-up', function (req, res) {  //open register page
    res.sendFile(__dirname + "/public/register.html",);
});

app.get('/profile', function (req, res) {  //open profile page
    res.sendFile(__dirname + "/public/profile-details.html",);
});

/* -------- post request, pages action */  

app.post('/sign-in', function (req, res) {  //login page post action
    console.log(req.body);
    var { userEmail, userPassword } = req.body;
    var query = parse('select * from users where "Email"= \'%s\'', userEmail);

    client.query(query, (err, respond) => {     //query to check user email
        console.log(respond);
        if (respond === undefined || respond.rowCount == 0) {    //user not exist, return error
            res.send({ success: false, error: true, errorUser: true });
            res.end();
        }
        else {   //user exist, login user
            hash = respond.rows[0].Password;
            var user = respond.rows[0];

            bcrypt.compare(userPassword, hash).then(function (result) {  //compre with encrypted password
                console.log(result);
                if (result) {
                    res.send({ success: true, error: false, info: user });
                    res.end();
                }
                else {
                    res.send({ success: false, error: true, errorPassword: true });
                    res.end();
                }
            });
        }
    });

});

app.post('/profile', function (req, res) {  //profile page post action
    console.log(req.body);
    var { userEmail } = req.body;
    var query = parse('select * from users where "Email"= \'%s\'', userEmail);

    client.query(query, (err, respond) => { //query to check user email

        if (respond === undefined || respond.rowCount == 0) {    //user not exist, return error
            res.send({ success: false, error: true, info: null });
            res.end();
        }
        else {   //user exist, return user details
            var user = respond.rows[0];
            res.send({ success: true, error: false, info: user });
            res.end();
        }
    });

});

app.post('/profile-save', function (req, res) {  //profile details save post action
    var { userData } = req.body;
    var userEmail = userData.prevEmail;

    var mailInfo;

    if (userEmail != userData.Email) {  //check if email was change
        var emailData = { "newEmail": userData.Email, "prevEmail": userEmail }
        var encryptData = urlCrypt.cryptObj(emailData);  //encryped user data

        //create link for email, confirm email change
        var link = siteAddress + "/link?type=emailnew&data=" + encryptData;
        var title = "Email Change";

        setMail(userEmail, title, link);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.send({ success: false, error: true });
                res.end();
            }
            //update fields, without email, confirm email update in link
            client.query('Update public.users set "Name"=$1, "FamilyName"=$2, "PhoneNumber"=$3, "Country"=$4, "City"=$5, "Street"=$6, "ZipCode"=$7 where "Email"=$8;', [userData.Name, userData.FamilyName, userData.PhoneNumber, userData.Country, userData.City, userData.Street, userData.ZipCode, userData.prevEmail], (err, respond) => {
                console.log(respond);
                console.log(err);
                if (respond != undefined && respond.rowCount == 1) {
                    res.send({ success: true, error: false, email: true });
                    res.end();
                }
                else {
                    res.send({ success: false, error: true, email: false });
                    res.end();
                }
            });
        });
    }
    else {  //no email change, no mail link sent, update details
        client.query('Update public.users set "Name"=$1, "FamilyName"=$2, "PhoneNumber"=$3, "Country"=$4, "City"=$5, "Street"=$6, "ZipCode"=$7 where "Email"=$8;', [userData.Name, userData.FamilyName, userData.PhoneNumber, userData.Country, userData.City, userData.Street, userData.ZipCode, userData.prevEmail], (err, respond) => {
            console.log(respond);
            console.log(err);
            if (respond != undefined && respond.rowCount == 1) {
                res.send({ success: true, error: false, email: false });
                res.end();
            }
            else {
                res.send({ success: false, error: true, email: false });
                res.end();
            }
        });
    }

});

app.post('/change-password', function (req, res) {  //profile password save post action
    var { userEmail, oldPassword, newPassword } = req.body;

    console.log(userEmail);
    console.log(oldPassword);
    console.log(newPassword);
    var query = parse('select * from users where "Email"= \'%s\'', userEmail);

    client.query(query, (err, respond) => { //query to check user email

        if (respond === undefined || respond.rowCount == 1) {    //user exist

            var hash = respond.rows[0].Password;
            bcrypt.compare(oldPassword, hash).then(function (result) {  //compre old pssword with encrypted password in DB (Aa123456! was password for testing)
                if (result) {  
                    bcrypt.hash(newPassword, saltRounds, function (err, hash) {  //encrypt new password
                        newPassword = hash;

                        client.query('Update public.users set "Password"=$1 where "Email"=$2;', [newPassword, userEmail], (err, respond) => {
                            if (respond != undefined && respond.rowCount == 1) {
                                res.send({ success: true, error: false, oldpassword: false });
                                res.end();
                            }
                            else {
                                res.send({ success: false, error: true, oldpassword: false });
                                res.end();
                            }
                        });
                    });

                }
                else {
                    res.send({ success: false, error: true, oldpassword: true });
                    res.end();
                }
            });

        }
        else {   //user not exist, return user details
            res.send({ success: false, error: true, oldpassword: false });
            res.end();
        }
    });




});

function setMail(userEmail, title, link) {  //set option for nodemailer mail to send
    mailOptions.to = userEmail;
    mailOptions.subject = "Confirm " + title;

    var mailText = "<h2>Confirm " + title + "</h2> <hr>"
        + "<p>Press link to confirm " + title + " :</p>"
        + "<a href='" + link + "' target='_blank'>" + link + "</a>";//"<div style='text-align: center;'><b>confirm register</b><br>" + "http://localhost:8080/link?data="+base64;

    mailOptions.html = mailText;
}

app.post('/sign-up', function (req, res) {  //register page post action
    var { userFirstName, userLastName, userEmail, userPassword, userPromoCode } = req.body;

    var query = parse('select * from users where "Email"= \'%s\'', userEmail);

    bcrypt.hash(userPassword, saltRounds, function (err, hash) {  //encrypt password
        userPassword = hash;

        client.query(query, (err, respond) => { //query to check if user email exist
            if (respond === undefined || respond.rowCount == 0) //user not exist, add user to database
            {
                var userData = { userFirstName, userLastName, userEmail, userPassword, userPromoCode };
                var encryptData = urlCrypt.cryptObj(userData);  //encryped user data
                
                if (userPromoCode != "") {  //there is promo code to check in DB
                    client.query('select * from promocode where "PromoCode"=$1;', [userPromoCode], (err, respond) => {
                        
                        if (respond != undefined && respond.rowCount == 1) {    //promo code is valid, exist in DB

                            //create link for email, confirm user sign up
                            var link = siteAddress + "/link?type=reg&data=" + encryptData;
                            var title = "Registration";

                            var mailSent = setMail(userEmail, title, link);

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error)
                                    res.redirect("/sign-up?error=4");   //return mail not sent

                                res.redirect("/sign-in?new=0");     //return success, mail sent
                            });

                        }
                        else {  //promo code not in DB
                            res.redirect("/sign-up?error=6");
                        }
                    });
                }
                else {  //promo code empty
                    //create link for email, confirm user sign up 
                    var link = siteAddress + "/link?type=reg&data=" + encryptData;
                    var title = "Registration";

                    var mailSent = setMail(userEmail, title, link);

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error)
                            res.redirect("/sign-up?error=4");   //return mail not sent
                        else
                            res.redirect("/sign-in?new=0");     //return success, mail sent
                    });
                }


            }
            else {   //return error, user already exist
                res.redirect("/sign-up?error=1");
            }

        })

    });
});

app.post('/forgot-password', function (req, res) {  //forgot password page post action
    var { userEmail } = req.body;

    var query = parse('select * from users where "Email"= \'%s\'', userEmail);

    client.query(query, (err, respond) => { //check if user exist
        if (respond === undefined || respond.rowCount == 1) //user exist
        {
            var userData = userEmail;
            var encryptData = urlCrypt.cryptObj(userData);  //encryped user data

            //create link for email, confirm new password
            var link = siteAddress + "/link?type=password&data=" + encryptData;
            var title = "Forgot Password";

            setMail(userEmail, title, link);

            transporter.sendMail(mailOptions, function (error, info) {
                if (error)
                    res.redirect("/forgot-password.html?error=1");   //return mail not sent

                res.redirect("/forgot-password.html?mail");     //return success, mail sent
            });
        }
        else {   //user not exist
            res.redirect("/forgot-password.html?error=0");
        }

    });

});

app.post('/update-password', function (req, res) {  //update password post action
    var { userPassword, userEmail } = req.body;
    var userEmailEncrypt = userEmail;
    userEmail = urlCrypt.decryptObj(userEmail); //get user email from encrypted url

    var userData = { userEmail, userPassword };
    var encryptData = urlCrypt.cryptObj(userData);  //encryped user data

    //create link for email, confirm new password update
    var link = siteAddress + "/link?type=passwordnew&data=" + encryptData;
    var title = "Password Change";

    setMail(userEmail, title, link);

    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            res.redirect("/link?type=password&data=" + userEmailEncrypt + "&error");   //return mail not sent

        res.redirect("/link?type=password&data=" + userEmailEncrypt + "&mail");     //return success, mail sent
    });

});

app.get('/link', function (req, res) {  //link pages post action

    if (req.param('data') != undefined) {
        var type = req.param('type');

        switch (type) {
            case "reg":     //sign up link, add user to DB
                var userData = urlCrypt.decryptObj(req.param('data'));

                var { userFirstName, userLastName, userEmail, userPassword, userPromoCode } = userData;
                client.query('INSERT INTO public.users("Name", "FamilyName", "Email", "PromoCode", "Password") VALUES ($1, $2, $3, $4, $5);', [userFirstName, userLastName, userEmail, userPromoCode, userPassword], (err, respond) => {
                    if (respond != undefined && respond.rowCount == 1)
                        res.redirect("/sign-in?new=1");
                    else {
                        if (err != undefined && err.message.includes("duplicate key"))
                            res.redirect("/sign-in?new=3");
                        else
                            res.redirect("/sign-in?new=2");
                    }
                });
                break;
            case "password":    //forgot password link, go to update
                res.sendFile(__dirname + "/public/update-password.html",);
                break;
            case "passwordnew": //update new password in DB
                var userData = urlCrypt.decryptObj(req.param('data'));

                var { userEmail, userPassword } = userData;

                bcrypt.hash(userPassword, saltRounds, function (err, hash) {  //encrypt password
                    userPassword = hash;

                    client.query('Update public.users set "Password"=$2 where "Email"=$1;', [userEmail, userPassword], (err, respond) => {
                        if (respond != undefined && respond.rowCount == 1)
                            res.redirect("/sign-in?password=0");
                        else {
                            res.redirect("/sign-in?password=1");
                        }
                    });

                });
                break;
            case "emailnew":    //new email link, update in DB
                var userData = urlCrypt.decryptObj(req.param('data'));
                var { newEmail, prevEmail } = userData;

                client.query('Update public.users set "Email"=$1 where "Email"=$2;', [newEmail, prevEmail], (err, respond) => {
                    console.log(respond);
                    if (respond != undefined && respond.rowCount == 1)
                        res.redirect("/profile?newmail=" + newEmail);
                    else {
                        res.redirect("/profile?error");
                    }
                });
                break;

        }

    }

});

app.use(function (req, res, next) {    //error 404 page
    res.status(404);

    // respond with html page
    res.sendFile(__dirname + "/public/404.html",);
});



