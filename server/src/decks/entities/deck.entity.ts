import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  Unique,
} from "typeorm";

import { DeckCardQuantity } from "./deck-card-quantity.entity";

@Entity()
@Unique(["createdBy", "name"])
export class Deck {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  name: string;

  @OneToMany(
    () => DeckCardQuantity,
    (deckCardQuantity) => deckCardQuantity.deck,
  )
  cardQuantities: DeckCardQuantity[];

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
