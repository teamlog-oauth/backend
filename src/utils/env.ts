import { ConfigService } from '@nestjs/config';

export const isDevelopment = () => {
  const config = new ConfigService();
  return config.get<string>('NODE_ENV') === 'development';
};

export const isProduction = () => {
  const config = new ConfigService();
  return config.get<string>('NODE_ENV') === 'production';
};

export const isTest = () => {
  const config = new ConfigService();
  return config.get<string>('NODE_ENV') === 'test';
};
