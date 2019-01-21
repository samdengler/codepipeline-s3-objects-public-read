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

## Configuring CodePipeline to use the Lambda Function

1. Click the **Edit** button next to the pipeline name:

    ![](images/1.png)

2. Scroll down to the Deploy stage and click the **Edit** button.

    ![](images/2.png)

3. Click the **Add action group** button.

    ![](images/3.png)

4. Type an **Action name** and select **AWS Lambda** from the **Action provider** list.

    ![](images/4.png)

5. In the AWS Lambda section, select the name of this Function that you've uploaded to your AWS account for **Function name**, select the same **Input artifact** used to deploy to S3, and click **Save**.

    ![](images/5.png)

6. Click the **Done** button in the Deploy stage.

    ![](images/6.png)

7. Scroll up to the top of the pipeline configuration and click the **Save** button.

    ![](images/7.png)

