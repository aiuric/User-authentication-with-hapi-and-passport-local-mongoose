'use strict';


var Joi = require('joi');
var ctrl = require('./auth.ctrl.js');

// Hapi 서버 객체를 이용해 인증 설정을 한다.
module.exports = function (server) {

  // 인증 모듈을 등록한다.(인증방법)
  server.register(require('hapi-auth-cookie'), function (err) {
    if (err) {
      throw err;
    }

    // 인증 strategy 를 생성한다. (세부인증정책)
    server.auth.strategy('mySessionStrategy', 'cookie', {
      password: 'secretsecretsecretsecretsecretsecret', // cookie secret(최소 32자)
      cookie: 'sid-example', // cookie name
      redirectTo: false,
      isSecure: false, // required for non-https applications
      ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
    });
    
    // 로그인
    server.route({
      method: 'POST',
      path:'/auth',
      config: {
        handler: ctrl.login,
        auth: {
          mode: 'try', // 인증 시도 
          strategy: 'mySessionStrategy' // 사용할 strategy
        }
      }
    });

    // 로그아웃
    server.route({
      method: 'DELETE',
      path:'/auth',
      config: {
        handler: ctrl.logout,
        auth: {
          mode: 'required', // 인증 필수 
          strategy: 'mySessionStrategy'
        }
      }
    });

    // 세션 확인 (개발용)
    server.route({
      method: 'GET',
      path:'/auth',
      config: {
        handler: ctrl.find,
        auth: {
          mode: 'required',
          strategy: 'mySessionStrategy'
        }
      }
    });
    
    // 등록
    server.route({
      method: 'POST',
      path:'/auth/register',
      config: {
        handler: ctrl.register,
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
          }
        }
      }
    });
    
  });
};