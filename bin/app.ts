#!/usr/bin/env node
import { App, Stack } from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/stacks/database-stack';
import { ApiStack } from '../lib/stacks/api-stack';
import { FrontendStack } from '../lib/stacks/frontend-stack';
import { MonitoringStack } from '../lib/stacks/monitoring-stack';

const app = new App();

// Get context values
const stage = app.node.tryGetContext('stage') || 'dev';
const region = app.node.tryGetContext('region') || 'us-east-1';
const alertEmail = app.node.tryGetContext('alertEmail');

const env = { region };

// Deploy stacks with dependencies
const databaseStack = new DatabaseStack(app, `Database-${stage}`, { env });

const apiStack = new ApiStack(app, `Api-${stage}`, {
  env,
  table: databaseStack.table,
} as any);

new FrontendStack(app, `Frontend-${stage}`, {
  env,
  apiUrl: apiStack.apiUrl,
} as any);

// Only deploy monitoring in staging and prod
if (stage !== 'dev') {
  new MonitoringStack(app, `Monitoring-${stage}`, {
    env,
    lambdaFunction: apiStack.lambdaFunction,
    table: databaseStack.table,
    alertEmail,
  } as any);
}

// Add tags to all stacks
app.node.children.forEach((child) => {
  if (child instanceof Stack) {
    child.tags.setTag('Environment', stage);
    child.tags.setTag('Project', 'ModularCDKExample');
  }
});