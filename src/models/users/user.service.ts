import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }
    async createOrUpdate(user: User): Promise<User> {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        return this.usersRepository.save(user);
    }
    async login(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return user;
            }
        }
        return null;
    }
}