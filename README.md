# lambda-codepipeline-s3-object-public-read

[AWS CodePipeline](https://aws.amazon.com/codepipeline/) is a fully managed continuous delivery (CD) service that lets you automate your software release process for fast and reliable updates. You can now use CodePipeline to deploy files, such as static website content or artifacts from your build process, to Amazon S3.

The S3 deployment action makes it very easy to update S3 Buckets used to host static websites, however the objects deployed do not have Public Read Access.  In cases where the S3 Bucket policy does no allow Public Read Access, this prevents users from accessing the website content.

When invoked by CodePipeline following a successful deployment to S3, the Lambda function builds a list of objects from the BuildArtifact and updates the ACLs for each to have Public Read Access.

```bash
.
├── README.md           <-- This instructions file
├── app                 <-- Source code for a lambda function
│   ├── index.js        <-- Lambda function code
│   └── package.json    <-- Node dependencies
└── template.yaml       <-- SAM template
```

## Requirements

* [AWS CLI](https://aws.amazon.com/cli/)
* [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Docker

## Installing Lambda Function into AWS Account using Local Workstation

TODO

## Configuring CodePipeline to use Lambda Function

TODO