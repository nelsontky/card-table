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
    onDelete: "CASCADE",
  })
  tags: CardTag[];

  @Column({ default: false })
  isShared: boolean;

  @Index()
  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
