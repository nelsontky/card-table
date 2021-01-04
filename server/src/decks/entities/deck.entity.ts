import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from "typeorm";

import { DeckCardQuantity } from "./deck-card-quantity.entity";

@Entity()
export class Deck {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @OneToMany(() => DeckCardQuantity, (deckCardQuantity) => deckCardQuantity.deck)
  cardQuantities: DeckCardQuantity[];

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
