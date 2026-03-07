import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

if (process.env.USE_CI_ENV !== 'true') {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

// Validation function to ensure variables are defined
const validate = (val: string | undefined, key: string) => {
  if (!val) {
    console.warn(`Missing required environment variable: ${key}`);
    return '';
  }
  return val;
};

// Ensure critical variables are present
const required = ['CORR_QA_URL', 'INTERNAL_USERNAME', 'INTERNAL_PASSWORD', 'USERNAME', 'EXTERNAL_PASSWORD', 'EXTERNAL_USERNAME'];
required.forEach((key) => {
  validate(process.env[key], key);
});

export type UserType = 'internal' | 'external' | 'user_group';

export interface UserCredentials {
  username: string;
  password: string;
}

export const ENV = {
  CORR_QA_URL: process.env.CORR_QA_URL!,

  getCredentials: (type: UserType): UserCredentials => {
    switch (type) {
      case 'internal':
        return { username: process.env.INTERNAL_USERNAME!, password: process.env.INTERNAL_PASSWORD! };
      case 'external':
        return { username: process.env.EXTERNAL_USERNAME!, password: process.env.EXTERNAL_PASSWORD! };
      case 'user_group':
        return { username: process.env.USERNAME!, password: process.env.PASSWORD! };
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }

 ,
  EMAIL: {
    USER: process.env.EMAIL_USER || '',
    PASS: process.env.EMAIL_PASS || '',
    TO: process.env.EMAIL_TO || '',
  }
};


