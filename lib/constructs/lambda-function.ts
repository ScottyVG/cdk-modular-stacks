import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Role, ServicePrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';

export interface LambdaFunctionProps {
  functionName: string;
  codePath: string;
  handler?: string;
  runtime?: Runtime;
  timeout?: Duration;
  memorySize?: number;
  environment?: { [key: string]: string };
  logRetention?: RetentionDays;
}

export class LambdaFunction extends Construct {
  public readonly function: Function;
  public readonly role: Role;
  public readonly logGroup: LogGroup;

  constructor(scope: Construct, id: string, props: LambdaFunctionProps) {
    super(scope, id);

    // Create IAM role for Lambda with security best practices
    this.role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        {
          managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
        },
      ],
      // Add security constraints
      maxSessionDuration: Duration.hours(1),
      description: `IAM role for Lambda function ${props.functionName}`,
    });

    // Create CloudWatch Log Group
    this.logGroup = new LogGroup(this, 'LogGroup', {
      logGroupName: `/aws/lambda/${props.functionName}`,
      retention: props.logRetention ?? RetentionDays.TWO_WEEKS,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create Lambda function
    this.function = new Function(this, 'Function', {
      functionName: props.functionName,
      runtime: props.runtime ?? Runtime.NODEJS_18_X,
      handler: props.handler ?? 'index.handler',
      code: Code.fromAsset(props.codePath),
      role: this.role,
      timeout: props.timeout ?? Duration.seconds(30),
      memorySize: props.memorySize ?? 128,
      environment: props.environment,
      logGroup: this.logGroup,
    });
  }

  public addToRolePolicy(statement: PolicyStatement): void {
    this.role.addToPolicy(statement);
  }
}