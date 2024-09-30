import { IsEmail } from 'class-validator';
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
    passwordHash:string;

    @Column({length:100})
    name: string;

    // One person to many tasks
    @OneToMany(() => Tasks,(task) => task.user)
    tasks: Tasks[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}