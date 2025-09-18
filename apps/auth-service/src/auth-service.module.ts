import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { User } from './user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '.env',  isGlobal: true}),
    TypeOrmModule.forRoot({type: 'postgres',host: 'localhost',port: 5432,username: 'postgres',password: 'postgres',database: 'confed',entities: [User], synchronize: false,}),
    TypeOrmModule.forFeature([User])],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
