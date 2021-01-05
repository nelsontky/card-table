import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CardsModule } from "./cards/cards.module";
import { Card } from "./cards/entities/card.entity";
import { CardTag } from "./cards/entities/card-tag.entity";
import { Deck } from "./decks/entities/deck.entity";
import { DeckCardQuantity } from "./decks/entities/deck-card-quantity.entity";
import { DecksModule } from "./decks/decks.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_USER,
      entities: [Card, CardTag, Deck, DeckCardQuantity],
      synchronize: process.env.NODE_ENV === "development",
    }),
    CardsModule,
    DecksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
