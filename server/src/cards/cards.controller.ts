import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth.guard";
import { CardsService } from "./cards.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Controller("cards")
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get("search")
  search(@Query("query") query: string) {
    return this.cardsService.search(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cardsService.findOne(+id);
  }

  @Put()
  update(@Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(updateCardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cardsService.remove(+id);
  }
}
