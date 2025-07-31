import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGateway } from '../constructs/api-gateway';
import { LambdaFunction } from '../constructs/lambda-function';
import { apiConfig } from '../../config/api-config';

export interface ApiStackProps extends StackProps {
  table: Table;
}

export class ApiStack extends Stack {
  public readonly apiUrl: string;
  public readonly lambdaFunction: Function;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const stage = this.node.tryGetContext('stage') || 'dev';
    const config = apiConfig[stage];

    if (!config) {
      throw new Error(`No API configuration found for stage: ${stage}`);
    }

    // Create Lambda function
    const lambdaConstruct = new LambdaFunction(this, 'ApiFunction', {
      functionName: `${config.apiName}-handler`,
      codePath: './lambda', // This would contain your Lambda code
      environment: {
        TABLE_NAME: props.table.tableName,
        STAGE: stage,
      },
    });

    this.lambdaFunction = lambdaConstruct.function;

    // Grant Lambda permissions to access DynamoDB
    lambdaConstruct.addToRolePolicy(
      new PolicyStatement({
        actions: [
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:Query',
          'dynamodb:Scan',
        ],
        resources: [props.table.tableArn],
      })
    );

    // Create API Gateway
    const apiConstruct = new ApiGateway(this, 'Api', {
      apiName: config.apiName,
      description: `API for ${stage} environment`,
      enableCors: config.enableCors,
    });

    // Add Lambda integration to API Gateway
    apiConstruct.addLambdaIntegration('/items', 'GET', this.lambdaFunction);
    apiConstruct.addLambdaIntegration('/items', 'POST', this.lambdaFunction);
    apiConstruct.addLambdaIntegration('/items/{id}', 'GET', this.lambdaFunction);
    apiConstruct.addLambdaIntegration('/items/{id}', 'PUT', this.lambdaFunction);
    apiConstruct.addLambdaIntegration('/items/{id}', 'DELETE', this.lambdaFunction);

    this.apiUrl = apiConstruct.api.url;
  }
}