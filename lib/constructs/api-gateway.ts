import { Construct } from 'constructs';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { Function } from 'aws-cdk-lib/aws-lambda';

export interface ApiGatewayProps {
  apiName: string;
  description?: string;
  enableCors?: boolean;
}

export class ApiGateway extends Construct {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    this.api = new RestApi(this, 'Api', {
      restApiName: props.apiName,
      description: props.description,
      defaultCorsPreflightOptions: props.enableCors ? {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      } : undefined,
    });
  }

  public addLambdaIntegration(path: string, method: string, lambdaFunction: Function): void {
    const resource = this.api.root.resourceForPath(path);
    const integration = new LambdaIntegration(lambdaFunction);
    resource.addMethod(method, integration);
  }
}