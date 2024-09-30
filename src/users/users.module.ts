import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]),ConfigModule,UtilsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
