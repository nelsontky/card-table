import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { Card } from "./entities/card.entity";
import { CardTag } from "./entities/card-tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardTag])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
