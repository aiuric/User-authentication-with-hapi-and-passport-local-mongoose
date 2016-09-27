'use strict';

var User = require('../../models/user');

exports.login = function (req, reply) {
  User.authenticate()(req.payload.email, req.payload.password, function (err, user, passwordError) {
    
    // There has been an error, do something with it. I just print it to console for demo purposes.
    if (err) {
      console.error('err: ' + err);
      return reply(403);
    }

    // Something went wrong with the login process, could be any of:
    // https://github.com/saintedlama/passport-local-mongoose#error-messages
    if (passwordError) {
      // For now, just show the error and login form
      console.log('passwordError: ' + passwordError);
      return reply(403);
    }

    // If the authentication failed user will be false. If it's not false, we store the user
    // in our session and redirect the user to the hideout
    if (user) {
      console.log('login success');
      req.cookieAuth.set(user);
    }
    
    reply(user).code(201);
  });
};

exports.logout = function (req, reply) {
  
  console.log('logout');
  // 세선 종료
  req.cookieAuth.clear();
  // 응답
  reply();
};

// 세션 확인용 
exports.find = function (req, reply) {
  console.log('session: ' + req.cookieAuth);
  reply(req.cookieAuth);
};

/**
 * Responds to POST /register and creates a new user.
 */
exports.register = function (req, reply) {
  var newUser = new User({
    email: req.payload.email
  });
  
  console.log('register: ' + req.payload.email + '/' + req.payload.password);
    
  // The register function has been added by passport-local-mongoose and takes as first parameter
  // the user object, as second the password it has to hash and finally a callback with user info.
  User.register(newUser, req.payload.password, function(err, user) {
    
    // Return error if present
    if (err) {
      console.log('err: ' + err);
      return reply(err);
    }
    
    console.log('registered');

  });
};