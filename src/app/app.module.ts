import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from 'src/users/entity/users.entity';
import { Tasks } from 'src/tasks/entity/tasks.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule acessível globalmente
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Users, Tasks],
        autoLoadEntities:true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
