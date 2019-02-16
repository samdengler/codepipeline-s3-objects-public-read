const unzipper = require('unzipper');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const codepipeline = new AWS.CodePipeline();

const process = require('process');
const S3_BUCKET = process.env.S3_BUCKET;

if(process.env.BUILD_ARTIFACT) { 
    const BUILD_ARTIFACT = process.env.BUILD_ARTIFACT; 
}
else { 
    const BUILD_ARTIFACT = "BuildArtifact"; 
}

const BUILD_ARTIFACT = process.env.BUILD_ARTIFACT
const PUBLIC_READ_ACL = "public-read";

exports.handler = async (event, context) => {
  console.log(`\n${JSON.stringify(event, null, 2)}`);
  let jobId = event['CodePipeline.job']['id'];
  let jobData = event['CodePipeline.job']['data'];
  
  try {
    console.log("list objects");
    let objects = await listObjectsFromBuildArtifact(jobData);
    
    console.log("update ACLs");
    await Promise.all(
      objects.map(o => putObjectAcl(S3_BUCKET, o, PUBLIC_READ_ACL))
    );
    console.log("update ACLs complete");
    
    console.log(`put successful result: ${jobId}`);
    await putJobSuccessfulResult(jobId);
  } catch (err) {
    console.log(err);
    
    console.log(`put failure result: ${jobId}`);
    await putJobFailureResult(jobId, err.message);
  }
  
  console.log("job complete");
  return "complete";
}

async function listObjectsFromBuildArtifact(jobData) {
  let buildArtifact = jobData.inputArtifacts.filter(i => i.name === BUILD_ARTIFACT)[0];
  let artifactS3Client = new AWS.S3({
    accessKeyId: jobData.artifactCredentials.accessKeyId,
    secretAccessKey: jobData.artifactCredentials.secretAccessKey,
    sessionToken: jobData.artifactCredentials.sessionToken
  });
  
  let params = {
    Bucket: buildArtifact.location.s3Location.bucketName,
    Key: buildArtifact.location.s3Location.objectKey
  };
  
  return unzipper.Open.s3(artifactS3Client, params).then((zip) => {
    return zip.files.map(f => f.path);
  });
}

async function putObjectAcl(bucket, key, acl) {
  let params = {
    Bucket: bucket,
    Key: key,
    ACL: acl
  };
  
  return s3.putObjectAcl(params).promise();
}

async function putJobSuccessfulResult(jobId) {
  let params = {
    jobId: jobId,
  };
  
  return codepipeline.putJobSuccessResult(params).promise();
}

async function putJobFailureResult(jobId, message) {
  let params = {
    jobId: jobId,
    failureDetails: {
      message: message,
      type: "JobFailed"
    }
  };
  
  return codepipeline.putJobFailureResult(params).promise();
}
