import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Card } from "../../cards/entities/card.entity";

@Entity()
export class Deck {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @ManyToMany(() => Card)
  @JoinTable()
  cards: Card[];

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
