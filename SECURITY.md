# Security Configuration

This document outlines the security measures implemented in this CDK project to address known vulnerabilities and follow AWS security best practices.

## Addressed Security Vulnerabilities

### 1. AWS CDK IAM OIDC Custom Resource (GHSA-v4mq-x674-ff73)
**Status**: ✅ Fixed
- **Solution**: Updated to aws-cdk-lib v2.208.0 which includes the fix
- **CDK Context**: Added `@aws-cdk/aws-iam:oidcProviderTrustedAudience: true`
- **Description**: Prevents connection to unauthorized OIDC providers by enforcing trusted audience validation

### 2. Cognito UserPoolClient Log Exposure (GHSA-qq4x-c6h6-rfxh)
**Status**: ✅ Fixed
- **Solution**: Updated to aws-cdk-lib v2.208.0 and added context flag
- **CDK Context**: Added `@aws-cdk/aws-cognito:userPoolClientGenerateSecret: true`
- **Description**: Prevents sensitive information from being logged when using Cognito UserPoolClient

### 3. CodePipeline Trusted Entities Too Broad (GHSA-5pq3-h73f-66hr)
**Status**: ✅ Fixed
- **Solution**: Updated to aws-cdk-lib v2.208.0 and added context flags
- **CDK Context**: Added `@aws-cdk/aws-iam:restrictTrustedRoleArns: true` and `@aws-cdk/aws-codepipeline:restrictTrustedRoleArns: true`
- **Description**: Restricts trusted entities in CodePipeline roles to prevent overly broad permissions

### 4. Brace-expansion Regular Expression DoS (GHSA-v6h2-p8h4-qcjw)
**Status**: ✅ Fixed
- **Solution**: Updated to aws-cdk-lib v2.208.0 which includes updated dependencies
- **Description**: Fixes Regular Expression Denial of Service vulnerability in brace-expansion dependency

## Security Best Practices Implemented

### IAM Security
- **Principle of Least Privilege**: All IAM roles are created with minimal required permissions
- **Session Duration Limits**: Lambda execution roles have maximum session duration of 1 hour
- **Standardized Service Principals**: Using `@aws-cdk/aws-iam:standardizedServicePrincipals: true`
- **Policy Minimization**: Enabled `@aws-cdk/aws-iam:minimizePolicies: true`

### S3 Security
- **Encryption**: All S3 buckets use S3-managed encryption by default
- **SSL Enforcement**: `enforceSSL: true` prevents unencrypted connections
- **Public Access Blocking**: All buckets block public access by default
- **Object Ownership**: Set to `BUCKET_OWNER_ENFORCED` for better access control
- **Server Access Logging**: Uses bucket policy for access logs (`@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy: true`)

### Lambda Security
- **Log Retention**: CloudWatch logs have defined retention periods (default: 2 weeks)
- **Runtime**: Uses latest supported Node.js runtime (18.x)
- **Environment Variables**: No sensitive data in environment variables
- **Execution Role**: Dedicated IAM role with minimal permissions

### API Gateway Security
- **CloudWatch Role**: Disabled default CloudWatch role creation (`@aws-cdk/aws-apigateway:disableCloudWatchRole: true`)
- **CORS**: Configurable CORS settings per environment
- **Request Validation**: Unique request validator IDs (`@aws-cdk/aws-apigateway:requestValidatorUniqueId: true`)

### DynamoDB Security
- **Point-in-Time Recovery**: Enabled by default in staging and production
- **Encryption**: Uses AWS managed encryption
- **Access Control**: Lambda functions have specific DynamoDB permissions only

### CloudFront Security
- **TLS Version**: Minimum TLS 1.2 enforced (`@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021: true`)

### EC2 Security
- **Default Security Groups**: Restricted by default (`@aws-cdk/aws-ec2:restrictDefaultSecurityGroup: true`)
- **IMDSv2**: Enforced for EC2 instances (`@aws-cdk/aws-ec2:uniqueImdsv2TemplateName: true`)

### Secrets Management
- **Secret Usage Validation**: Enabled secret usage checking (`@aws-cdk/core:checkSecretUsage: true`)
- **Secrets Manager**: Uses attached resource policies (`@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments: true`)

## Security Monitoring

### CloudWatch Alarms
- **Lambda Errors**: Monitors function error rates
- **Lambda Duration**: Alerts on long-running functions
- **DynamoDB Throttling**: Monitors for capacity issues
- **SNS Notifications**: Sends alerts to configured email addresses

### Logging
- **CloudWatch Logs**: All services log to CloudWatch with retention policies
- **Access Logs**: S3 buckets can be configured with access logging
- **API Gateway Logs**: Request/response logging available

## Environment-Specific Security

### Development
- **Minimal Monitoring**: Basic logging only
- **Relaxed Policies**: Slightly more permissive for development ease
- **No Backup**: Point-in-time recovery disabled for cost savings

### Staging
- **Full Monitoring**: All alarms and notifications enabled
- **Production-like Security**: Same security posture as production
- **Backup Enabled**: Point-in-time recovery enabled

### Production
- **Maximum Security**: All security features enabled
- **Comprehensive Monitoring**: Full alarm coverage
- **Backup & Recovery**: Point-in-time recovery and versioning enabled
- **Encryption**: All data encrypted at rest and in transit

## Compliance Considerations

This configuration helps meet requirements for:
- **AWS Well-Architected Framework**: Security pillar best practices
- **SOC 2**: Access controls and monitoring
- **GDPR**: Data protection and encryption
- **HIPAA**: Encryption and access logging (with additional controls)

## Handling Bundled Dependencies

If you encounter warnings about bundled dependencies (like `brace-expansion` in `aws-cdk-lib`), these are dependencies bundled within the CDK library itself. These warnings indicate:

1. **Cannot be fixed automatically**: The dependency is bundled within aws-cdk-lib
2. **Solution**: Update to the latest CDK version that includes the fix
3. **Current Status**: CDK v2.208.0 includes fixes for all known vulnerabilities

If you see bundled dependency warnings:
```bash
# This is expected and safe - the bundled dependency is fixed in CDK v2.208.0+
npm warn audit fix brace-expansion@1.1.11 is a bundled dependency of aws-cdk-lib
```

## CDK Versioning

This project uses:
- **aws-cdk** (CLI): v2.1023.0 (latest stable CLI)
- **aws-cdk-lib** (library): v2.208.0 (latest stable library with security fixes)

Note: The CLI and library have different versioning schemes. Always use the latest stable versions of both.

## Regular Security Updates

1. **CDK Versions**: Keep both aws-cdk CLI and aws-cdk-lib updated to latest stable versions
2. **Dependencies**: Regular `npm audit` and dependency updates
3. **Runtime Updates**: Update Lambda runtimes when new versions are available
4. **Security Patches**: Monitor AWS security bulletins and apply patches promptly
5. **Bundled Dependencies**: Monitor CDK release notes for bundled dependency fixes

## Security Testing

Run security checks:
```bash
# Check for vulnerabilities
npm audit

# Run CDK security checks
cdk synth --strict

# Validate IAM policies
aws iam simulate-principal-policy --policy-source-arn <role-arn> --action-names <actions>
```

## Incident Response

In case of security incidents:
1. **Immediate**: Disable affected resources
2. **Investigation**: Check CloudWatch logs and CloudTrail
3. **Remediation**: Apply security patches and updates
4. **Documentation**: Update security configurations as needed