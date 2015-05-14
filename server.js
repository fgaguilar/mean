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
var usuarios = {};
var userName = '';

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
    res.setHeader('Access-Control-Allow-Origin', 'http://face');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
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
	console.log("INGRESO A LOGIN");
	userName = req.body.username;
	usuarios[userName] = req.body.username;
	console.log("username: " + usuarios[userName]);
	res.json(req.user);
});

app.get('/loggedin', function(req,res){
  	console.log("INGRESO A LOGGEDIN");
  	if (typeof(usuarios[userName])!="undefined"){
		console.log("username: " + usuarios[userName]);
		UserModel.findOne({username: usuarios[userName]}, function(err,user){			
			if (user) {
				console.log("user: " + user);
				res.send(user.username ? user : '0');
			}	
		});
	}
	else {
		res.send('0');
	}
});

app.post('/logout', function(req,res){
	console.log("INGRESO A LOGOUT");
	if (typeof(req.body.username)!="undefined"){
		console.log(req.body.username);

	  	req.session.destroy(function(err){
	    	if(err){
	      	console.log(err);
	    	}
	  	});  
		req.logOut();

		console.log("200");
		res.sendStatus(200);
	}
	else {
		console.log("400");
		req.logOut();
		res.sendStatus(400);	
	}
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