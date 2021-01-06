import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { Card } from "./entities/card.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  create(createCardDto: CreateCardDto) {
    return `This action returns creates a card`;
  }

  findAll() {
    // return this.cardsRepository.find({ relations: ["tags"] });
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  async update(updateCardDto: UpdateCardDto) {
    return `This action updates a card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
