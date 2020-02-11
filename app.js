var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var cookieSession = require("cookie-session");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var dotenv = require("dotenv");
dotenv.config();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["secret"]
  })
);

app.use(passport.initialize());
app.use(passport.session());

var uri = "" + process.env.MONGOOSECONNECT;

mongoose.connect(uri, {
  useNewUrlParser: true
});

var userSchema = new mongoose.Schema({
  username: String,
  googleId: String,
  img: String
});

function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
}

var user = mongoose.model("user", userSchema);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.findById(id).then(function(user) {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: process.env.CALLBACKURL
      //   callbackURL: "/whatever"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile.photos[0].value);
      user.findOne({ googleId: profile.id }).then(function(data) {
        if (!data) {
          user.create(
            {
              username: profile.displayName,
              googleId: profile.id,
              img: profile.photos[0].value
            },
            function(err, user) {
              console.log("user created" + user);
              done(null, user);
            }
          );
        } else {
          console.log("user found" + data);
          done(null, data);
        }
      });
    }
  )
);

// app.get('/',function(req,res){
//     res.render('main.ejs');
// });

app.get("/", function(req, res) {
  console.log("DONE");
  if (req.user) {
    res.render("home.ejs", { user: req.user });
  } else {
    res.render("main.ejs");
  }
});

app.get("/weather", isAuthenticated, function(req, res) {
  res.render("home.ejs", { user: req.user });
});

app.get("/login/auth", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/whatever",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    //successful authentication
    console.log("successful authentication");
    res.redirect("/weather");
  }
);

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

// app.listen(3000, function() {
//   console.log("Server Started at port 3000");
// });

app.listen(process.env.PORT || 3000, function() {
  console.log("Server Started at port 3000");
});
