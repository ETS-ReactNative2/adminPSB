/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var aws = require('aws-sdk')
// declare a new express app
var app = express()
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});

aws.config.update({
  accessKeyId: 'AKIAJQQ6IDEUCGJ5G5HA',
  secretAccessKey: 'qiwOmrwJI1VPmJCxnADsf+8JXbpWNOYcNZV0HeSd',
  subregion: 'us-east-1'}
);

var s3 = new aws.S3();


/**********************
 * Example get method *
 **********************/

app.post('/getSignedUrl', function(req, res) {
    var params = {
        Bucket: 'psb-users',
        Key: req.body['filename'],
        Expires: 60,
        ContentType: req.body['filetype']
    };
    s3.getSignedUrl('putObject', params, function(err, signedUrl) {
        console.log("getSignedUrl");
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Success "+signedUrl);
            let data = {
              'signedUrl': signedUrl
            }
            res.json({success: 'post call succeed!', url: signedUrl, data: data});
        }
    });
});

app.post('/uploads3', function(req, res) {
    var params = {
        Bucket: 'psb-users',
        Key: req.body['filename'],
    };
    s3.getSignedUrl('getObject', params, function(err, signedUrl) {
        console.log("getSignedUrl");
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Success "+signedUrl);
            let data = {
              'signedUrl': signedUrl
            }
            res.json({success: 'get call succeed!', url: signedUrl, data: data});
        }
    });
});

app.put('/uploads3/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
