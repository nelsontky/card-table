import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { CreateDeckByNameDto } from "./dto/create-deck-by-name.dto";
import { UpdateDeckDto } from "./dto/update-deck.dto";
import { Deck } from "./entities/deck.entity";
import { DeckCardQuantity } from "./entities/deck-card-quantity.entity";
import { Card } from "../cards/entities/card.entity";
import { Connection } from "typeorm";

@Injectable()
export class DecksService {
  constructor(private connection: Connection) {}

  create(createDeckDto: CreateDeckDto) {
    return "This action adds a new deck";
  }

  async createByName(createDeckByNameDto: CreateDeckByNameDto) {
    if (process.env.NODE_ENV !== "development") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newDeck = queryRunner.manager.create(Deck, {
        name: createDeckByNameDto.name,
        createdBy: createDeckByNameDto.createdBy,
      });

      await queryRunner.manager.save(newDeck);

      for (const card of createDeckByNameDto.cards) {
        const cardToAdd = await queryRunner.manager.findOne(Card, {
          where: { name: card.name },
        });

        const newCardQuantity = queryRunner.manager.create(DeckCardQuantity, {
          card: cardToAdd,
          deck: newDeck,
          quantity: card.quantity,
        });

        await queryRunner.manager.save([cardToAdd, newCardQuantity]);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all decks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deck`;
  }

  update(id: number, updateDeckDto: UpdateDeckDto) {
    return `This action updates a #${id} deck`;
  }

  remove(id: number) {
    return `This action removes a #${id} deck`;
  }
}
