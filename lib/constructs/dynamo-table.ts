import { Construct } from 'constructs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface DynamoTableProps {
  tableName: string;
  enablePointInTimeRecovery?: boolean;
  removalPolicy?: RemovalPolicy;
}

export class DynamoTable extends Construct {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: DynamoTableProps) {
    super(scope, id);

    this.table = new Table(this, 'Table', {
      tableName: props.tableName,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: props.enablePointInTimeRecovery ?? true,
      },
      removalPolicy: props.removalPolicy ?? RemovalPolicy.RETAIN,
    });
  }
}