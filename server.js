var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://fidel:Valentina2010@localhost/test');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var conectado=false;

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	roles: [String]
});
var UserModel = mongoose.model("UserModel", UserSchema);
// var admin = new UserModel(
// 	{
// 		username:"Fidel", 
// 		password:"fidel", 
// 		email: "fidel@yahoo.com", 
// 		firstName: "Fidel", 
// 		lastName: "Aguilar",
// 		roles: ["admin"]
// 	});
// var student = new UserModel(
// 	{
// 		username:"Gaby", 
// 		password:"gaby", 
// 		email: "gaby@yahoo.com", 
// 		firstName: "Gaby", 
// 		lastName: "Aguilar",
// 		roles: ["student"]
// 	});
// admin.save();
// student.save();

app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


passport.use(new LocalStrategy(
function(username, password, done) 
{
    UserModel.findOne({username:username, password:password}, function(err, user){
      if (user){
        return done(null, user);
      }
      return done(null, false, {message: 'Unable to login'});
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var auth = function(req,res,next){
	if (!req.isAuthenticated())
		res.send(401);
	else
		next();
}

app.get('/hello', auth, function(req, res){
	res.send('Hola!!!');
});

app.post('/login', passport.authenticate('local'), function(req,res){
	console.log("Ingreso a login");
	console.log(req.user);
	conectado=true;
	console.log(conectado);
	console.log(req.isAuthenticated());
	res.json(req.user);
});

app.post('/logout', function(req,res){
	console.log("Ingreso a logout");
	req.logOut();
	conectado=false;
	console.log(conectado);
	res.send(200);
});

app.get('/loggedin', function(req,res){
	console.log("Ingreso a loggedin");
	res.send(conectado ? req.user : '0');	
	//res.send(req.isAuthenticated() ? req.user : '0');	
});

app.post('/register', function(req,res){
	UserModel.findOne({username: req.body.username}, function(err,user){
		if (user) {
			res.json(null);
			return;
		}	
		else {
			var newUser = new UserModel(req.body);
			newUser.roles = ['student'];
			newUser.save(function(err,user){
				req.login(user, function(err){
					if(err){ return next(err); }
					res.json(user);
				});
			});
		}	
	});
	// var newUser = req.body;
	// console.log(newUser);
});

app.get('/rest/user', auth, function(req, res){
	UserModel.find(function(err,users){
		res.json(users);
	});
});

app.listen(3000);