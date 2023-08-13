import { Application } from 'src/application/entities/application.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OAuth {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => Application, (application) => application.oauth, {
    onDelete: 'CASCADE',
  })
  application: Application;

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientSecret: string;

  @Column({ type: 'simple-array' })
  redirectUri: string[];

  @Column({ type: 'simple-array' })
  authorizationUri: string[];
}
