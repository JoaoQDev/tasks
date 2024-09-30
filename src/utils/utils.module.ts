import { Module } from '@nestjs/common';
import { PasswordHash } from './password-hash';

@Module({
    providers:[PasswordHash],
    exports:[PasswordHash]
})
export class UtilsModule {}
