import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersProfileEntity } from './usersProfile.entity';
import { AuditEntity } from './audit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, UsersProfileEntity, AuditEntity])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
