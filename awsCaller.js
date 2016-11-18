'use strict';

var AWS = require('aws-sdk');
var ec2 = new AWS.EC2({apiVersion: '2016-09-15'});

AWS.config.update({region:'us-west-2'});

var AwsCaller = {
  CheckServiceStatus: function (service) {
    if (service === "ec2") {
      var params = {
        IncludeAllInstances: true
      };

      ec2.waitFor('instanceStatusOk', params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          return data.InstanceStatuses.map(function(instance) {
            return {
              id: instance.InstanceId,
              state: instance.InstanceState.Name
            };
          });
        }
      });
    }
  }
};

module.exports = AwsCaller;
