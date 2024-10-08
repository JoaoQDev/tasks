import { IsBoolean } from "class-validator";
import { Users } from "src/users/entity/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tasks {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:255})
    data: string;

    @Column({default:false})
    @IsBoolean()
    done: boolean;
    
    // Many tasks to one person
    @ManyToOne(() => Users, (user) => user.tasks,{onDelete:'CASCADE'})
    user: Users;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}