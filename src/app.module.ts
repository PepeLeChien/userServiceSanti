import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 1. Cargar variables globales
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    // 2. Conexión a Base de Datos Asíncrona (Más segura)
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            type: 'mariadb',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASS'),
            database: configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
            synchronize: true, // Solo para desarrollo
        }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}