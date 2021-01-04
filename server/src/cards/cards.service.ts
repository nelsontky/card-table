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

  async create(createCardDto: CreateCardDto) {
    if (process.env.NODE_ENV !== "development") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const newCard = this.cardsRepository.create({
      tags: createCardDto.tags,
      createdBy: createCardDto.createdBy,
    });
    const saved = await this.cardsRepository.save(newCard);

    return saved.id;
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  async update(updateCardDto: UpdateCardDto) {
    if (process.env.NODE_ENV !== "development") {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    const cardsToEdit = await this.cardsRepository.find({
      where: { name: updateCardDto.name },
    });
    const saveCards = cardsToEdit.map((card) => {
      card.tags = updateCardDto.tags;
      return this.cardsRepository.save(card);
    });

    return await Promise.all(saveCards);
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
