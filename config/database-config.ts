export interface DatabaseConfig {
  tableName: string;
  enableBackups: boolean;
  ttlEnabled: boolean;
}

export const databaseConfig: Record<string, DatabaseConfig> = {
  dev: {
    tableName: 'my-app-dev-table',
    enableBackups: false,
    ttlEnabled: true,
  },
  staging: {
    tableName: 'my-app-staging-table',
    enableBackups: true,
    ttlEnabled: true,
  },
  prod: {
    tableName: 'my-app-prod-table',
    enableBackups: true,
    ttlEnabled: false,
  },
};