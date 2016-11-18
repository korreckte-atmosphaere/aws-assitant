'use strict';

var awsSdk = require('aws-sdk');

var AwsCaller = {
  CheckServiceStatus: function (service) {
   if (service === "elastic beanstalk") {
     return "blablabla";
   }
  }
};

module.exports = AwsCaller;
