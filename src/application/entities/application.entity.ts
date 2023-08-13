import { OAuth } from 'src/oauth/entities/oauth.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User, (user) => user.applications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToOne(() => OAuth, (oauth) => oauth.application, {
    eager: true,
  })
  @JoinColumn()
  oauth: OAuth;

  @Column()
  name: string;
}
