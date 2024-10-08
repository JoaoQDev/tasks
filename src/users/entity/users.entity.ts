import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import { Tasks } from 'src/tasks/entity/tasks.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    @IsEmail()
    email: string;

    @Column({length:255})
    @Exclude()
    passwordHash:string;

    @Column({length:100})
    name: string;

    // One person to many tasks
    @OneToMany(() => Tasks,(task) => task.user)
    tasks: Tasks[];

    @Column({default:'user'})
    policy: RoutePolicies;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}