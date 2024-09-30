import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@Injectable()
export class PasswordHash {
    async hashPassowrd(password){
        const peper = process.env.PEPER;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password + peper,salt);
        return hash
    }
}