export interface EnvironmentConfig {
  baseUrl: string;
  credentials: {
    username: string;
    password: string;
    internalPassword?: string;
  };
}

export const correspondantEnv: EnvironmentConfig = {
  baseUrl: process.env.CORR_QA_URL || 'https://ext-qa.lpcorrtest.com/cp/',
  credentials: {
    username: process.env.CORR_USERNAME || '',
    password: process.env.CORR_PASSWORD || '',
    internalPassword: process.env.CORR_INTERNAL_PASSWORD || '',
  },
};

export const extWebEnv: EnvironmentConfig = {
  baseUrl: process.env.EXT_STG_URL || 'https://ppe-stg-ext.cre8techdev.com/#/login',
  credentials: {
    username: process.env.EXT_USERNAME || '',
    password: process.env.EXT_PASSWORD || '',
  },
};

// Environment variables map (matches Testsigma runtime variables)
export const envVars: Record<string, string> = {
  'CORR_QA_URL': process.env.CORR_QA_URL || 'https://ext-qa.lpcorrtest.com/cp/',
  'UserName': process.env.CORR_USERNAME || '',
  'Password': process.env.CORR_PASSWORD || '',
  'Internal Password': process.env.CORR_INTERNAL_PASSWORD || '',
  'URL': process.env.EXT_STG_URL || 'https://ppe-stg-ext.cre8techdev.com/#/login',
  'EXT_STG_URL': process.env.EXT_STG_URL || 'https://ppe-stg-ext.cre8techdev.com/#/login',
};
