import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongooseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: configService.get<string>('MONGO_URI'),

  connectionFactory: (connection: any) => {
    connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    connection.on('error', (error: any) => {
      console.error('❌ MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    return connection;
  },
});