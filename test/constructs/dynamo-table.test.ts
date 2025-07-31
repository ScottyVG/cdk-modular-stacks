import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';
import { DynamoTable } from '../../lib/constructs/dynamo-table';

describe('DynamoTable Construct', () => {
  test('creates DynamoDB table with correct properties', () => {
    const stack = new Stack();
    
    new DynamoTable(stack, 'TestTable', {
      tableName: 'test-table',
      enablePointInTimeRecovery: true,
    });

    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'test-table',
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH'
        }
      ],
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true
      }
    });
  });

  test('creates table with default settings', () => {
    const stack = new Stack();
    
    new DynamoTable(stack, 'TestTable', {
      tableName: 'test-table',
    });

    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'test-table',
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true
      }
    });
  });
});