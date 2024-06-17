import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Statistics {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    recordedAt: Date;

    @Column('int')
    administratorsCount: number;

    @Column('int')
    directorsCount: number;

    @Column('int')
    teachersCount: number;

    @Column('int')
    parentsCount: number;

    @Column('int')
    studentsCount: number;

    @Column('int')
    agentsCount: number;

    @Column('int')
    usersCount: number;

    @Column('int')
    cyclesCount: number;

    @Column('int')
    levelsCount: number;

    @Column('int')
    classesCount: number;

    @Column('int')
    absencesCount: number;
}