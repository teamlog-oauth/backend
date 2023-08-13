import { Application } from 'src/application/entities/application.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column({ primary: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Application, (application) => application.user, {
    eager: true,
  })
  applications!: Application[];
}
