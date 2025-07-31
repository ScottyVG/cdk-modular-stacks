import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { DynamoTable } from '../constructs/dynamo-table';
import { databaseConfig } from '../../config/database-config';

export class DatabaseStack extends Stack {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stage = this.node.tryGetContext('stage') || 'dev';
    const config = databaseConfig[stage];

    if (!config) {
      throw new Error(`No database configuration found for stage: ${stage}`);
    }

    const dynamoConstruct = new DynamoTable(this, 'AppTable', {
      tableName: config.tableName,
      enablePointInTimeRecovery: config.enableBackups,
    });

    this.table = dynamoConstruct.table;

    // Add tags for better resource management
    this.table.node.addMetadata('stage', stage);
  }
}