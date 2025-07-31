import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export interface MonitoringStackProps extends StackProps {
  lambdaFunction: Function;
  table: Table;
  alertEmail?: string;
}

export class MonitoringStack extends Stack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    const stage = this.node.tryGetContext('stage') || 'dev';

    // Create SNS topic for alerts
    const alertTopic = new Topic(this, 'AlertTopic', {
      topicName: `${stage}-app-alerts`,
      displayName: `Alerts for ${stage} environment`,
    });

    // Add email subscription if provided
    if (props.alertEmail) {
      alertTopic.addSubscription(new EmailSubscription(props.alertEmail));
    }

    // Lambda function error alarm
    const lambdaErrorAlarm = new Alarm(this, 'LambdaErrorAlarm', {
      alarmName: `${stage}-lambda-errors`,
      alarmDescription: 'Lambda function error rate is too high',
      metric: props.lambdaFunction.metricErrors({
        period: Duration.minutes(5),
      }),
      threshold: 5,
      evaluationPeriods: 2,
    });

    lambdaErrorAlarm.addAlarmAction(new SnsAction(alertTopic));

    // Lambda function duration alarm
    const lambdaDurationAlarm = new Alarm(this, 'LambdaDurationAlarm', {
      alarmName: `${stage}-lambda-duration`,
      alarmDescription: 'Lambda function duration is too high',
      metric: props.lambdaFunction.metricDuration({
        period: Duration.minutes(5),
      }),
      threshold: 10000, // 10 seconds
      evaluationPeriods: 3,
    });

    lambdaDurationAlarm.addAlarmAction(new SnsAction(alertTopic));

    // DynamoDB throttle alarm
    const dynamoThrottleAlarm = new Alarm(this, 'DynamoThrottleAlarm', {
      alarmName: `${stage}-dynamo-throttles`,
      alarmDescription: 'DynamoDB is being throttled',
      metric: new Metric({
        namespace: 'AWS/DynamoDB',
        metricName: 'ThrottledRequests',
        dimensionsMap: {
          TableName: props.table.tableName,
        },
        period: Duration.minutes(5),
      }),
      threshold: 1,
      evaluationPeriods: 1,
    });

    dynamoThrottleAlarm.addAlarmAction(new SnsAction(alertTopic));
  }
}