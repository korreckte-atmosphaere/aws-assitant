'use strict';

var billing = require('aws-billing');
var AWS = require('aws-sdk');
var ec2 = new AWS.EC2({apiVersion: '2016-09-15'});

AWS.config.update({region:'us-east-1'});

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
  },
  SpawnInstance: function(plan, name) {
    var params = {
      ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
      InstanceType: `t1.${plan}`,
      MinCount: 1,
      MaxCount: 1
    };
    ec2.runInstances(params, function(){
      if (err){
        console.log("Could not create instance!",err);
        return;
      }
      var instanceId = data.Instances[0].InstanceId;
      console.log("Created instance", instanceId);
         console.log("Created instance", instanceId);
         // Add tags to the instance
         params = {Resources: [instanceId], Tags: [
         {
          Key: 'Name',
          Value: `${name}`
         }
         ]};
    });
  }
};

module.exports = AwsCaller;
