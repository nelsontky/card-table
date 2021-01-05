import { Entity, Column, ManyToOne, PrimaryColumn, Index } from "typeorm";

import { Card } from "./card.entity";

@Entity()
export class CardTag {
  @Column({ primary: true })
  tag: string;

  @ManyToOne(() => Card, { primary: true })
  card: Card;
}
