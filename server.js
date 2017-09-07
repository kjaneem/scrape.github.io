//make these npm components available
var express = require("express");
var exphbs  = require('express-handlebars');

//body-parser parses the text as URL encoded data 
//(which is how browsers tend to send form data from regular forms set to POST) 
//and exposes the resulting object 
//(containing the keys and values) on req.body
var bodyParser = require("body-parser");

//methodOverride lets you use HTTP verbs such as PUT or DELETE 
//in places where the client doesn’t support it
var methodOverride = require("method-override");

//
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
//

//Get the port value from PORT environment variable if available
//else use port 3000
var port = process.env.PORT || 3333;

//Set the name of your express server to "app"
var app = express();

// The server "app" should look for static content in the "public" directory
// Serve static content for the app from the "public" directory in the application directory.
// Add the static data in "public" directory to the "app" server
app.use(express.static("public"));

// Add morgan logger logic to the "app" server
app.use(logger("dev"));

// Add the logic available in body-parser to the "app" server
app.use(bodyParser.urlencoded({ extended: false }));

//To use a query string value to override the method, 
//specify the query string key as a string argument to the methodOverride function. 
//To then make the call, 
//send a POST request to a URL with the overridden method 
//as the value of that query string key. 
//This method of using a query value would typically be used 
//in conjunction with plain HTML <form> elements 
//when trying to support legacy browsers but still use newer methods
//
//Example call
//
//<form method="POST" action="/resource?_method=DELETE">
//  <button type="submit">Delete resource</button>
//</form>
//
// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
var exphbs = require("express-handlebars");

//Declare the server engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//
// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});
//

// Import routes and give the server access to them.
// var routes = require("./controllers/scrapeController.js");

// app.use("/", routes);

var routes = require ("./routes/mongoDb-routes.js");
app.use("/", routes);

// KM - COMMENT THIS OUT FOR A SEC
// var grabs = require ("./public/grab.js");
// app.use("/", grabs);

// Routes HTTP GET requests to the specified path 
// with the specified callback functions
// In this case, whatever is at localhost:port
app.get('/', function (req, res) {

	// display content of index.handlebars
	// on the browser page
    res.render('index');
});



// Ask server "app" to listen at port 
// When a request comes in - process it
//app.listen(port);
app.listen(port, function() {
	console.log("Server listening at port: " + port);
	console.log("Navigate to http://localhost: " + port);	
});

