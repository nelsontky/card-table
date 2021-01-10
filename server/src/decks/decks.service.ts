import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { CreateDeckByNameDto } from "./dto/create-deck-by-name.dto";
import { Deck } from "./entities/deck.entity";
import { DeckCardQuantity } from "./entities/deck-card-quantity.entity";
import { Card } from "../cards/entities/card.entity";
import { Connection, Repository, QueryFailedError } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class DecksService {
  constructor(
    private connection: Connection,

    @InjectRepository(Deck)
    private decksRepository: Repository<Deck>,

    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  async create(createDeckDto: CreateDeckDto, user: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newDeck = queryRunner.manager.create(Deck, {
        name: createDeckDto.name,
        createdBy: user,
      });
      await queryRunner.manager.save(newDeck);
      const newDeckCardQuantitiesPromise = createDeckDto.cards.map(
        async (card) =>
          queryRunner.manager.create(DeckCardQuantity, {
            card: await this.cardsRepository.findOne(card.id),
            quantity: card.quantity,
            deck: newDeck,
          }),
      );
      const newDeckCardQuantities = await Promise.all(
        newDeckCardQuantitiesPromise,
      );
      await queryRunner.manager.save(newDeckCardQuantities);

      await queryRunner.commitTransaction();
      return newDeck;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      if (err instanceof QueryFailedError) {
        throw new HttpException(
          {
            name: "You already have a deck with this name",
          },
          HttpStatus.CONFLICT,
        );
      }
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    throw new HttpException(
      "Internal server error",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
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

  async findShared(limit?: number, offset?: number) {
    return await this.decksRepository
      .createQueryBuilder("deck")
      .select([
        "deck.id",
        "deck.name",
        "deck.createdAt",
        "deck.updatedAt",
        "deck.createdBy",
        "cards",
        "card.id",
        "card.name",
      ])
      .leftJoin("deck.cardQuantities", "cards")
      .leftJoin("cards.card", "card")
      .where("deck.isShared")
      .orderBy("deck.createdAt")
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async findMine(user: string, limit?: number, offset?: number) {
    return await this.decksRepository
      .createQueryBuilder("deck")
      .select([
        "deck.id",
        "deck.name",
        "deck.createdAt",
        "deck.updatedAt",
        "deck.createdBy",
        "cards",
        "card.id",
        "card.name",
      ])
      .leftJoin("deck.cardQuantities", "cards")
      .leftJoin("cards.card", "card")
      .where("deck.createdBy = :user", { user })
      .orderBy("deck.createdAt")
      .take(limit)
      .skip(offset)
      .getMany();
  }

  // TODO only owner can access unshared deck
  async findOne(id: string) {
    return await this.decksRepository
      .createQueryBuilder("deck")
      .select([
        "deck.id",
        "deck.name",
        "deck.createdAt",
        "deck.updatedAt",
        "deck.createdBy",
        "cards",
        "card.id",
        "card.name",
      ])
      .where("deck.id = :id", { id })
      .leftJoin("deck.cardQuantities", "cards")
      .leftJoin("cards.card", "card")
      .getOne();
  }

  async update(id: string, createDeckDto: CreateDeckDto, user: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const deck = await queryRunner.manager.findOne(Deck, {
        id,
        createdBy: user,
      });

      if (!deck) {
        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
      }

      await queryRunner.manager.update(
        Deck,
        { id },
        { name: createDeckDto.name },
      );
      await queryRunner.manager.delete(DeckCardQuantity, { deck });

      const newDeckCardQuantitiesPromise = createDeckDto.cards.map(
        async (card) =>
          queryRunner.manager.create(DeckCardQuantity, {
            card: await this.cardsRepository.findOne(card.id),
            quantity: card.quantity,
            deck: deck,
          }),
      );
      const newDeckCardQuantities = await Promise.all(
        newDeckCardQuantitiesPromise,
      );
      await queryRunner.manager.save(newDeckCardQuantities);

      await queryRunner.commitTransaction();
      return deck;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      if (err instanceof QueryFailedError) {
        throw new HttpException(
          {
            name: "You already have a deck with this name",
          },
          HttpStatus.CONFLICT,
        );
      }
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }

    throw new HttpException(
      "Internal server error",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async remove(id: string, user: string) {
    const deckToRemove = await this.decksRepository.findOne({ id });
    if (!deckToRemove) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    if (deckToRemove.createdBy !== user) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    await this.decksRepository.delete({ id });
  }
}
