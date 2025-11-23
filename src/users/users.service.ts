import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';

import { userDto } from './dto/userDto';
import { UsersProfileEntity } from './usersProfile.entity';
import { ConfigService } from '@nestjs/config';
import { AuditEntity } from './audit.entity';
import { Repository, In } from 'typeorm';
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity)
        private userRepository: Repository<UsersEntity>,
        @InjectRepository(UsersProfileEntity)
        private profileRepository: Repository<UsersProfileEntity>,
        @InjectRepository(AuditEntity)
        private auditRepository: Repository<AuditEntity>,

        private configService: ConfigService,
    ) { }

    async createUser(userDto: userDto, token: string): Promise<any> {
        let newUser = new UsersEntity;
        newUser.email = userDto.email;
        newUser.phone = userDto.phone;
        newUser.created_at = new Date;
        const API_WALLET = this.configService.get<string>('API_WALLET');

        let savedUser = await this.userRepository.save(newUser);

        let newProfile = new UsersProfileEntity;

        newProfile.dni = userDto.dni;
        newProfile.address = userDto.address ?? "Calle 12 de Prueba"
        newProfile.birthdate = userDto.birthdate ?? new Date(2000, 0, 1)

        let nombres = await this.obtenerNombres(userDto.dni)
        if (!nombres) throw new NotFoundException(`DNI: ${userDto.dni} no existe en la BD`);
        newProfile.fullname = nombres;

        newProfile.user = savedUser;
        await this.profileRepository.save(newProfile);

        await this.auditLog(savedUser.user_id, 'CREATE', 'First time user created');

        console.log("Punto 1");

        const walletResponse = await fetch(`${API_WALLET}/api/v1/wallets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: savedUser.user_id.toString()
            })
        });

        console.log("Peticion Realizada");
        console.log(walletResponse);
        console.log(await walletResponse.json());

        if (!walletResponse.ok) {
            console.error("Error al crear wallet:", await walletResponse.text());
            throw new Error("No se pudo crear la wallet del usuario");
        }

        console.log("Respues realizada");

    }

    getAllUsers(): Promise<UsersEntity[] | null> {
        return this.userRepository.find();
    }

    getUser(id: number): Promise<UsersEntity | null> {
        return this.userRepository.findOneBy({ user_id: id });
    }

    async updateUser(body: any, user_id: number) {

        const user = await this.userRepository.findOneBy({ user_id });
        if (!user) throw new NotFoundException(`User with ID ${user_id} not found`);

        if (body.email !== undefined) user.email = body.email;
        if (body.phone !== undefined) user.phone = body.phone;
        if (body.status !== undefined) user.status = body.status;

        const savedUser = await this.userRepository.save(user);

        const profile = await this.profileRepository.findOne({
            where: { user: { user_id } },
            relations: ['user'],
        });
        if (!profile) throw new NotFoundException(`Profile with ID ${user_id} not found`);

        if (body.address !== undefined) profile.address = body.address;
        if (body.birthdate !== undefined) profile.birthdate = body.birthdate;

        const savedProfile = await this.profileRepository.save(profile);

        await this.auditLog(savedUser.user_id, 'UPDATE', 'User data updated');
    }

    async obtenerNombres(dni: string): Promise<string> {
        const API_TOKEN = this.configService.get<string>('API_TOKEN');
        const API_URL = this.configService.get<string>('API_URL');

        const response = await fetch(`${API_URL}dni?numero=${dni}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        return data.full_name;
    }

    async getUserByDni(dni: string): Promise<UsersEntity | null> {
        const profile = await this.profileRepository.findOne({
            where: { dni },
            relations: ['user'],
        });

        if (!profile) {
            return null;
        }

        return profile.user;
    }

    // validarDni(dni: string){

    // }

    getUserByPhone(phone: string): Promise<UsersEntity | null> {
        return this.userRepository.findOneBy({ phone });
    }

    async auditLog(id: number, action: string, details: string) {
        const audit = new AuditEntity;
        audit.user_id = id;
        audit.action = action;
        audit.details = details;
        audit.executed_at = new Date;

        await this.auditRepository.save(audit);
    }

    async getProfileByPhone(phone: string): Promise<UsersProfileEntity | null> {
    return this.profileRepository.findOne({
        // 1. Buscamos dentro de la relación 'user' el campo 'phone'
        where: { 
            user: { phone: phone } 
        },
        // 2. Cargamos la relación para que TypeORM pueda filtrar y para devolver los datos
        relations: ['user'], 
    });
}

async findManyByIds(userIds: number[]) {
    if (!userIds.length) return [];
    
    // Usamos In() de TypeORM para buscar varios a la vez
    return this.profileRepository.find({
        where: { user: { user_id: In(userIds) } }, // Asegúrate de importar 'In' de typeorm
        relations: ['user'],
        select: {
            fullname: true,
            user: {
                user_id: true,
                phone: true,
                email: true
            }
        }
    });
}


}
