# Resource Naming Strategy

This document explains how resources are named in this CDK project to ensure uniqueness and avoid conflicts.

## S3 Bucket Naming

### Problem
S3 bucket names must be globally unique across all AWS accounts and regions. Hardcoded bucket names cause deployment failures when multiple people deploy the same code.

### Solution
This project uses **CDK-generated unique names** for S3 buckets:

```typescript
// ❌ Bad: Hardcoded name (will conflict)
new Bucket(this, 'MyBucket', {
  bucketName: 'my-app-frontend-bucket'
});

// ✅ Good: CDK generates unique name
new Bucket(this, 'MyBucket', {
  // bucketName: undefined (CDK generates unique name)
});
```

### How It Works

1. **CDK generates unique names** using the pattern: `{stackname}-{constructid}-{randomsuffix}`
2. **Example generated name**: `Frontend-dev-FrontendBucket-1A2B3C4D5E6F`
3. **CloudFormation outputs** expose the generated name for reference

### Accessing Generated Names

After deployment, you can find the bucket name in:

1. **CloudFormation Outputs**:
   ```bash
   aws cloudformation describe-stacks --stack-name Frontend-dev \
     --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
     --output text
   ```

2. **CDK Outputs**:
   ```bash
   cdk deploy Frontend-dev --outputs-file outputs.json
   cat outputs.json
   ```

3. **AWS Console**: CloudFormation → Stack → Outputs tab

## Other Resource Naming

### DynamoDB Tables
- **Pattern**: Uses configuration-based names with environment suffix
- **Example**: `my-app-dev-table`, `my-app-prod-table`
- **Uniqueness**: Environment-specific names prevent conflicts

### Lambda Functions
- **Pattern**: `{api-name}-handler`
- **Example**: `my-app-dev-api-handler`
- **Uniqueness**: Environment and purpose-specific naming

### API Gateway
- **Pattern**: Environment-specific API names
- **Example**: `my-app-dev-api`, `my-app-prod-api`
- **Uniqueness**: Environment-specific names

### IAM Roles
- **Pattern**: CDK-generated names with stack and construct context
- **Example**: `DatabaseStack-AppTableRole-ABC123`
- **Uniqueness**: CDK ensures uniqueness within account

## Best Practices

### 1. Let CDK Generate Names When Possible
```typescript
// ✅ Preferred: CDK generates unique names
new Bucket(this, 'MyBucket');

// ⚠️ Use only when necessary
new Bucket(this, 'MyBucket', {
  bucketName: `my-unique-prefix-${randomSuffix}`
});
```

### 2. Use Environment Prefixes for Named Resources
```typescript
const tableName = `${appName}-${stage}-table`;
```

### 3. Output Important Resource Names
```typescript
new CfnOutput(this, 'BucketName', {
  value: bucket.bucketName,
  description: 'Generated S3 bucket name'
});
```

### 4. Use Consistent Naming Patterns
- **Environment**: `dev`, `staging`, `prod`
- **Separator**: Use hyphens (`-`) for AWS resources
- **Prefix**: Include app/project name for clarity

## Migration from Hardcoded Names

If you have existing resources with hardcoded names:

1. **Import existing resources**:
   ```bash
   cdk import
   ```

2. **Gradually migrate** to generated names during maintenance windows

3. **Use aliases** for resources that need stable names (like domains)

## Troubleshooting

### Bucket Already Exists Error
```
BucketAlreadyExists: The requested bucket name is not available
```

**Solution**: Remove the `bucketName` property to let CDK generate a unique name.

### Finding Resource Names After Deployment
```bash
# List all stack outputs
aws cloudformation describe-stacks --stack-name YourStackName

# Get specific output
aws cloudformation describe-stacks --stack-name YourStackName \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text
```

This naming strategy ensures that anyone can clone and deploy this project without encountering naming conflicts.