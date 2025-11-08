import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    TypeOrmModule.forRoot({
        "type": "mariadb",
        "host": process.env.DB_HOST,
        "port": Number(process.env.DB_PORT),
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "entities": [join(__dirname, '**', '*.entity.{ts,js}')],
        "synchronize": true
    })
    ,UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
