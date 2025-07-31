# Deployment Guide

This guide helps you deploy the CDK modular stacks example successfully.

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
2. **Node.js 18+** installed
3. **AWS CDK CLI** installed globally: `npm install -g aws-cdk`

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Lambda dependencies**:
   ```bash
   cd lambda && npm install && cd ..
   ```

3. **Bootstrap CDK** (if you haven't already):
   ```bash
   cdk bootstrap
   ```

4. **Deploy to development**:
   ```bash
   cdk deploy --all --context stage=dev
   ```

## Deployment Commands

### Deploy All Stacks
```bash
# Development environment
cdk deploy --all --context stage=dev

# Staging environment  
cdk deploy --all --context stage=staging

# Production environment
cdk deploy --all --context stage=prod --context alertEmail=your-email@example.com
```

### Deploy Individual Stacks
```bash
# Deploy just the database
cdk deploy Database-dev --context stage=dev

# Deploy database and API
cdk deploy Database-dev Api-dev --context stage=dev
```

### Preview Changes
```bash
# See what will be deployed
cdk diff --context stage=dev

# Generate CloudFormation templates
cdk synth --context stage=dev
```

## Troubleshooting

### Common Issues

#### 1. Feature Flag Errors
If you see errors about unsupported feature flags, ensure you're using the correct CDK versions:
- `aws-cdk`: 2.1023.0
- `aws-cdk-lib`: 2.208.0

#### 2. Lambda Asset Errors
Ensure the lambda directory has a package.json:
```bash
cd lambda
npm init -y
npm install aws-sdk
cd ..
```

#### 3. Bootstrap Required
If you see bootstrap errors:
```bash
cdk bootstrap --profile your-profile
```

#### 4. Permission Errors
Ensure your AWS credentials have sufficient permissions for:
- IAM role creation
- DynamoDB table creation
- Lambda function deployment
- API Gateway creation
- S3 bucket creation
- CloudWatch resources

### Clean Up

To avoid ongoing charges, destroy the stacks when done:
```bash
# Destroy all stacks
cdk destroy --all --context stage=dev

# Destroy specific stacks
cdk destroy Database-dev Api-dev --context stage=dev
```

## Environment-Specific Deployments

### Development
- Minimal monitoring
- No backups
- S3 public access enabled for direct website hosting
- No CloudFront distribution

**⚠️ Security Warning**: The dev environment creates a publicly accessible S3 bucket for direct website hosting. Be aware that any files uploaded to this bucket will be publicly readable on the internet.

### Staging
- Full monitoring with alerts
- Backups enabled
- CloudFront distribution (placeholder - not implemented)
- S3 public access blocked (would use CloudFront)

### Production
- Maximum security
- Comprehensive monitoring
- Backups and versioning enabled
- CloudFront distribution (placeholder - not implemented)
- S3 public access blocked (would use CloudFront)
- Requires alert email configuration

## Monitoring Deployment

After deployment, check:
1. **CloudFormation Console**: Verify stack creation
2. **Lambda Console**: Confirm function deployment
3. **DynamoDB Console**: Check table creation
4. **API Gateway Console**: Test API endpoints
5. **CloudWatch Console**: Verify log groups and alarms

## Cost Considerations

This example creates AWS resources that may incur charges:
- DynamoDB tables (pay-per-request)
- Lambda functions (pay-per-invocation)
- API Gateway (pay-per-request)
- S3 buckets (storage costs)
- CloudWatch logs and alarms

Most resources use pay-per-use pricing, so costs should be minimal for testing.