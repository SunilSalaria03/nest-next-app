import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { mongooseConfig } from './config/db.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './shared/guards/auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mongooseConfig,
    }),

    UserModule,
    AuthModule,
    SharedModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide : APP_GUARD,
      useClass : AuthGuard,
    },
    {
      provide : APP_GUARD,
      useClass : RolesGuard,
    }
  ],

})
export class AppModule {}