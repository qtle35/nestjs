import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async add(user: UserEntity): Promise<UserEntity> {
        const hashPassword = await bcrypt.hash(user.password,10)
        user.password = hashPassword;
        console.log(user)
        return this.userRepository.save(user);
    }

    findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }
    async delete(name: string): Promise<void> {
        try {
            const result = await this.userRepository.delete(name);
            if (result.affected === 0) {
                throw new HttpException('user khong ton tai', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw new HttpException('user không tồn tại', HttpStatus.NOT_FOUND);
        }
    }
    findUser(name: string): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({ where: { name } });
    }
    async findUserByNameOrEmail(name: string, email: string): Promise<UserEntity | undefined> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.name = :name OR user.email = :email', { name, email })
            .getOne();

        return user;
    }
    findMail(email: string): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }
    async update(id: string, user: UserEntity): Promise<UserEntity | null> {
        const existingUser = await this.userRepository.findOne({ where: { id } });

        if (!existingUser) {
            return null;
        }
        Object.assign(existingUser, user);
        const updatedUser = await this.userRepository.save(existingUser);
        return updatedUser;
    }

}