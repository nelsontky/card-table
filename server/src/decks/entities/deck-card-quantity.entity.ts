import { Entity, Column, ManyToOne } from "typeorm";

import { Card } from "../../cards/entities/card.entity";
import { Deck } from "./deck.entity";

@Entity()
export class DeckCardQuantity {
  @ManyToOne(() => Card, { primary: true })
  card: Card;

  @ManyToOne(() => Deck, { primary: true })
  deck: Deck;

  @Column()
  quantity: number;
}
