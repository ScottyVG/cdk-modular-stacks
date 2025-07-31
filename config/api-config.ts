export interface ApiConfig {
  apiName: string;
  enableCors: boolean;
  throttleRateLimit: number;
  throttleBurstLimit: number;
}

export const apiConfig: Record<string, ApiConfig> = {
  dev: {
    apiName: 'my-app-dev-api',
    enableCors: true,
    throttleRateLimit: 100,
    throttleBurstLimit: 200,
  },
  staging: {
    apiName: 'my-app-staging-api',
    enableCors: true,
    throttleRateLimit: 500,
    throttleBurstLimit: 1000,
  },
  prod: {
    apiName: 'my-app-prod-api',
    enableCors: false,
    throttleRateLimit: 1000,
    throttleBurstLimit: 2000,
  },
};