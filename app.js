//We're using the express framework and the mailgun-js wrapper
var express = require('express');
var $ = require('jquery');
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
//var to_who = 'johnstonenatalie@gmail.com';

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


app.listen(process.env.PORT || 3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});