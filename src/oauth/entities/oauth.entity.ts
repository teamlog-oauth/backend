import { Application } from 'src/application/entities/application.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OAuth {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => Application, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  application: Application;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  redirectUri: string;

  @Column()
  authorizationUri: string;
}
