# CDK Modular Stacks Example

This project demonstrates how to build modular AWS CDK applications using shared constructs and configuration files. It's the companion code for the blog post ["Splitting CDK Stacks with Shared Constructs and Config Files"](https://scottvangilder.com/blog/2025-07-30-splitting-cdk-stacks-with-shared-constructs-and-config-files/).

## Project Structure

```
cdk-modular-stacks/
├── bin/
│   └── app.ts                    # Main application entry point
├── lib/
│   ├── constructs/               # Reusable infrastructure components
│   │   ├── dynamo-table.ts
│   │   ├── lambda-function.ts
│   │   ├── api-gateway.ts
│   │   └── s3-bucket.ts
│   └── stacks/                   # Purpose-driven stacks
│       ├── database-stack.ts
│       ├── api-stack.ts
│       ├── frontend-stack.ts
│       └── monitoring-stack.ts
├── config/                       # Environment configurations
│   ├── database-config.ts
│   ├── api-config.ts
│   └── frontend-config.ts
├── test/                         # Unit and integration tests
├── lambda/                       # Lambda function code (placeholder)
├── cdk.json                      # CDK configuration
├── package.json
└── tsconfig.json
```

## Architecture

This example demonstrates:

- **Reusable Constructs**: Atomic infrastructure units that can be composed into larger systems
- **Purpose-Driven Stacks**: Each stack has a single responsibility (database, API, frontend, monitoring)
- **Configuration Management**: Environment-specific settings managed through TypeScript configuration files
- **Cross-Stack Dependencies**: How to pass resources between stacks safely
- **Unique Resource Naming**: S3 buckets use CDK-generated unique names to avoid naming conflicts

## Getting Started

### Prerequisites

- Node.js 18+ 
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed globally: `npm install -g aws-cdk`

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Lambda dependencies:
   ```bash
   cd lambda && npm install && cd ..
   ```

4. Verify no security vulnerabilities:
   ```bash
   npm audit
   ```

5. Bootstrap CDK (if you haven't already):
   ```bash
   cdk bootstrap
   ```

6. Deploy the example:
   ```bash
   cdk deploy --all --context stage=dev
   ```

**Note**: This project uses the latest stable CDK versions:
- **aws-cdk** (CLI): v2.1023.0
- **aws-cdk-lib** (library): v2.208.0

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Deployment

Deploy to different environments using context:

```bash
# Deploy to dev environment (default)
npm run deploy:dev

# Deploy to staging environment
npm run deploy:staging

# Deploy to production environment
npm run deploy:prod
```

You can also deploy individual stacks:

```bash
# Deploy just the database stack
cdk deploy Database-dev

# Deploy API and database stacks
cdk deploy Database-dev Api-dev
```

### Configuration

Environment-specific configuration is managed through TypeScript files in the `config/` directory. Each configuration file exports a record with environment-specific settings:

```typescript
export const databaseConfig: Record<string, DatabaseConfig> = {
  dev: {
    tableName: 'my-app-dev-table',
    enableBackups: false,
    ttlEnabled: true,
  },
  // ... other environments
};
```

### Custom Context

You can pass additional context values:

```bash
# Deploy with custom alert email for monitoring
cdk deploy --all --context stage=prod --context alertEmail=alerts@mycompany.com

# Deploy to a specific region
cdk deploy --all --context stage=prod --context region=us-west-2
```

## Key Features

### Reusable Constructs

Each construct encapsulates a logical infrastructure unit:

- **DynamoTable**: DynamoDB table with configurable backup and TTL settings
- **LambdaFunction**: Lambda function with IAM role, log group, and environment variables
- **ApiGateway**: REST API with configurable CORS and Lambda integrations
- **S3Bucket**: S3 bucket with configurable versioning, encryption, and access policies

### Stack Dependencies

Stacks are designed to work together through well-defined interfaces:

1. **DatabaseStack** creates the DynamoDB table
2. **ApiStack** receives the table reference and creates Lambda functions with appropriate permissions
3. **FrontendStack** receives the API URL for configuration
4. **MonitoringStack** receives references to monitor Lambda functions and DynamoDB tables

### Environment Management

The application automatically determines the deployment environment and loads appropriate configuration:

- Development: Minimal resources, no monitoring
- Staging: Full resources with monitoring and alerts
- Production: Full resources with enhanced monitoring and backup policies

## Testing

Run unit tests:

```bash
npm test
```

## Useful Commands

- `npm run build`   - Compile TypeScript to JavaScript
- `npm run watch`   - Watch for changes and compile
- `npm run test`    - Perform the jest unit tests
- `npm run deploy`  - Deploy all stacks to AWS
- `npm run diff`    - Compare deployed stack with current state
- `npm run synth`   - Emits the synthesized CloudFormation template

## Cleanup

To avoid ongoing AWS charges, destroy the stacks when you're done:

```bash
npm run destroy
```

## Security

This project implements AWS security best practices and addresses known CDK vulnerabilities. See [SECURITY.md](./SECURITY.md) for detailed security configuration and compliance information.

Key security features:
- Updated to CDK v2.167.1+ to fix known vulnerabilities
- S3 buckets with encryption and public access blocking
- IAM roles with least privilege principles
- CloudWatch monitoring and alerting
- Secure defaults for all AWS services

## Learn More

This example is based on the blog post: [Splitting CDK Stacks with Shared Constructs and Config Files](https://scottvangilder.com/blog/splitting-cdk-stacks-with-shared-constructs-and-config-files)

For more information about AWS CDK, visit the [official documentation](https://docs.aws.amazon.com/cdk/).
