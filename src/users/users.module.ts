import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersProfileEntity } from './usersProfile.entity';
import { AuditEntity } from './audit.entity';
// --- IMPORTACIONES NUEVAS ---
import { JwtStrategy } from './auth/jwt.strategy'; // Asegúrate de que la ruta sea correcta
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, UsersProfileEntity, AuditEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Registramos Passport
    ConfigModule // Importante para leer envs en la estrategia
  ],
  controllers: [UsersController],
  providers: [
    UsersService, 
    JwtStrategy // <--- ¡ESTA LÍNEA ES LA QUE SOLUCIONA TU ERROR!
  ]
})
export class UsersModule {}