import { Injectable } from "@nestjs/common";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { UpdateDeckDto } from "./dto/update-deck.dto";
import { Deck } from "./entities/deck.entity";
import { Card } from "../cards/entities/card.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private decksRepository: Repository<Deck>,
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  create(createDeckDto: CreateDeckDto) {
    return "This action adds a new deck";
  }

  createByName(name: string) {
    // const allCardsInDeck = 
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
