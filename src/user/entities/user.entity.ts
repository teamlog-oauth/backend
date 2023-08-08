import { Application } from 'src/application/entities/application.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ unique: true })
  id!: string;

  @Column({ primary: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @OneToMany(() => Application, (application) => application.user, {
    eager: true,
  })
  @JoinColumn()
  applications!: Application[];
}
