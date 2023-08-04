import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
