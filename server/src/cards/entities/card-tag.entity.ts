import { Entity, Column, ManyToOne, Index } from "typeorm";

import { Card } from "./card.entity";

@Entity()
export class CardTag {
  @Index()
  @Column({ primary: true })
  tag: string;

  @ManyToOne(() => Card, { primary: true })
  card: Card;
}
