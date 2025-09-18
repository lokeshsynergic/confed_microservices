import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('md_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  email: string;
}
