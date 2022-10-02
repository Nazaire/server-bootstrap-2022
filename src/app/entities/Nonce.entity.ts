import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class NonceEntity {
  /**
   * A unique id
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * When this object was created
   */
  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  /**
   * The value of the nonce
   */
  @Column({ type: "smallint" })
  value!: number;
}
