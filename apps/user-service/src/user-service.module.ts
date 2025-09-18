import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'confed',
    entities: [User], // 👈 add all entities here
    synchronize: false, // good for prod, use migrations
  }),TypeOrmModule.forFeature([User])],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
