// Create a basic Hapi.js server
require('babel-register')({
  presets: ['es2015', 'react'],
});

var Hapi = require('hapi');
var dateFormat = require('dateformat');
var format = "dd mmm HH:MM:ss";

// Basic Hapi.js connection stuff
var server = new Hapi.Server();
server.connection({port: 8081});

// Register the inert and vision Hapi plugins
server.register([{
  register: require('inert')
}, {
  register: require('vision')
}], function(err) {
  if (err) return console.error(err);
  
  
  // Print some information about the incoming request for debugging purposes
  server.ext('onRequest', function (request, reply) {
    console.log(request.path, request.query);
    return reply.continue();
  });
  
  // route 설정
  require('./src/routes')(server);
  
  server.start(function() {
    console.log(dateFormat(new Date(), format) + ' - Server started at: ' + server.info.uri);
  });

});