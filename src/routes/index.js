'use strict';

// 함수 표현식 <-> 함수 선언문
module.exports = function (server) {

  // Add the React-rendering view engine
  server.views({
    engines: {
      jsx: require('hapi-react-views')
    },
    relativeTo: __dirname,
    path: 'view'
  });

  // 정적 resource load
  server.route({
    method: 'GET',
    path: '/{filename*}',
    handler: {
      directory: {
        path:    './view/public', // 현재 Hapi가 구동하는 index.js 경로 기준
        index: ['index.html']
        // listing: false,
        // index:   false
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: {
        file: './view/public/index.html' // 현재 Hapi가 구동하는 index.js 경로 기준
    }
  });
  
  /* -jsx 직접 load
  // Add main app route
  server.route({
    method: 'GET',
    path: '/',
    handler: {
      view: './src/components/App'
    }
  });
  */
  
  // API route
  require('./auth')(server);
};