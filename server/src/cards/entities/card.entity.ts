import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from "typeorm";

import { CardTag } from "./card-tag.entity";

@Entity()
export class Card {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  name: string;

  @OneToMany(() => CardTag, (cardTag) => cardTag.card, {
    cascade: true,
  })
  tags: CardTag[];

  @Column({ default: true })
  isShared: boolean;

  @Index()
  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
