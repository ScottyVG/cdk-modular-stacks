export interface FrontendConfig {
  enableVersioning: boolean;
  enableCloudFront: boolean;
  domainName?: string;
}

export const frontendConfig: Record<string, FrontendConfig> = {
  dev: {
    enableVersioning: false,
    enableCloudFront: false,
  },
  staging: {
    enableVersioning: true,
    enableCloudFront: true,
    domainName: 'staging.myapp.com',
  },
  prod: {
    enableVersioning: true,
    enableCloudFront: true,
    domainName: 'myapp.com',
  },
};