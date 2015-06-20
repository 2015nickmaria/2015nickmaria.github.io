//We're using the express framework and the mailgun-js wrapper
var express = require('express');
//init express
var app = express();
app.use(express.static(__dirname + '/js'));

app.use("/styles", express.static(__dirname + '/styles'));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var Mailgun = require('mailgun-js');

//Your api key, from Mailgun’s Control Panel
var api_key = 'key-0c526ada06020fdf5a520a0de9dc7db4';

//Your domain, from the Mailgun Control Panel
var domain = 'krat.nz';

//Your sending email address
var from_who = 'postmaster@krat.nz';

var to_who = '2015nickmaria@gmail.com';

//Tell express to fetch files from the /js directory

//We're using the Jade templating language because it's fast and neat
app.set('view engine', 'jade')

//Do something when you're landing on the first page
app.get('/', function(req, res) {
    //render the index.jade file - input forms for humans
    res.render('index', function(err, html) {
        if (err) {
            // log any error to the console for debug
            console.log(err); 
        }
        else { 
            //no error, so send the html to the browser
            res.send(html)
        };
    });
});
app.post('/submit', function(req, res) {
    
    var name = req.body.name,
        music = req.body.music,
        attending = req.body.attending,
        comments = req.body.comments;
    
    //console.log("req.body", name, music, yeah, nah, comments)
    
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    
    var data = {
      from: from_who,
      to: to_who,
      subject: 'Wedding RSVP',
      html: '<h3>Hey Nick and Maria</h3> Name: ' + name + ' <br /> Attending: ' + attending + ' <br /> Song Request: ' + music + ' <br /> Comments: ' + comments + '<br/>'
    }
    
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            res.render('submitted', { email : to_who });
            console.log(body);
        }
    });
});

// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
//// The index redirects here
//app.get('/submit', function(req,res) {
//console.log(req.body )
//    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
//    //var mailgun = new Mailgun({apiKey: api_key, domain: domain});
//    console.log("raaaaaa", req);
//    var data = {
//    //Specify email data
//      from: from_who,
//    //The email to contact
//      to: to_who,//req.params.mail,
//    //Subject and text data  
//      subject: 'Wedding RSVP',
//      html: '<h3>Hey Nick and Maria</h3> Name: ' + req.params.name + ' <br /> Song Request: ' + req.params.music + ' <br /> Comments: ' + req.params.comments +' <br /> Yeah: ' + req.params.yeah + ' <br /> Nah: ' + req.params.nah +  'This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS!'
//    }

    //Invokes the method to send emails given the above data with the helper library
//    mailgun.messages().send(data, function (err, body) {
//        //If there is an error, render the error page
//        if (err) {
//            res.render('error', { error : err});
//            console.log("got an error: ", err);
//        }
//        //Else we can greet    and leave
//        else {
//            //Here "submitted.jade" is the view file for this landing page 
//            //We pass the variable "email" from the url parameter in an object rendered by Jade
//            res.render('submitted', { email : req.params.mail });
//            console.log(body);
//        }
//    });

//});

//app.get('/validate/:mail', function(req,res) {
//    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
//
//    var members = [
//      {
//        address: req.params.mail
//      }
//    ];
////For the sake of this tutorial you need to create a mailing list on Mailgun.com/cp/lists and put its address below
//    mailgun.lists('NAME@MAILINGLIST.COM').members().add({ members: members, subscribed: true }, function (err, body) {
//      console.log(body);
//      if (err) {
//            res.send("Error - check console");
//      }
//      else {
//        res.send("Added to mailing list");
//      }
//    });
//
//})
//
//app.get('/invoice/:mail', function(req,res){
//    //Which file to send? I made an empty invoice.txt file in the root directory
//    //We required the path module here..to find the full path to attach the file!
//    var path = require("path");
//    var fp = path.join(__dirname, 'invoice.txt');
//    //Settings
//    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
//
//    var data = {
//      from: from_who,
//      to: req.params.mail,
//      subject: 'An invoice from your friendly hackers',
//      text: 'A fake invoice should be attached, it is just an empty text file after all',
//      attachment: fp
//    };
//
//
//    //Sending the email with attachment
//    mailgun.messages().send(data, function (error, body) {
//        if (error) {
//            res.render('error', {error: error});
//        }
//            else {
//            res.send("Attachment is on its way");
//            console.log("attachment sent", fp);
//            }
//        });
//})

//app.listen(3030);
app.listen(process.env.PORT || 3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});