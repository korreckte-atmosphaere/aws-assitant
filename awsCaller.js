'use strict';

var billing = require('aws-billing');
var AWS = require('aws-sdk');
var ec2 = new AWS.EC2({apiVersion: '2016-09-15'});

AWS.config.update({region:'us-west-2'});

var AwsCaller = {
  CheckServiceStatus: function (service, callback) {
     if (service === "ec2") {
       var request = ec2.describeInstances({}, function(err, data) {
         if(err) console.log(err, err.stack); // an error has happened on AWS

         callback(data);
       })
    }
  },
  CheckBillingStatus: function (callback) {
    billing( function (err, cost) {
      if (err) console.log(err, err.stack);

      callback(cost);
    });
  }
};

module.exports = AwsCaller;
