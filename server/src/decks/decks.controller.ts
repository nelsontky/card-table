import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { DecksService } from "./decks.service";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { CreateDeckByNameDto } from "./dto/create-deck-by-name.dto";
import { UpdateDeckDto } from "./dto/update-deck.dto";
import { off } from "process";

@Controller("decks")
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  create(@Body() createDeckDto: CreateDeckDto) {
    return this.decksService.create(createDeckDto);
  }

  @Post("/by-name")
  createByName(@Body() createDeckByNameDto: CreateDeckByNameDto) {
    return this.decksService.createByName(createDeckByNameDto);
  }

  @Get()
  findAll(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.decksService.findAll(limit, offset);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.decksService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.decksService.update(+id, updateDeckDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.decksService.remove(+id);
  }
}
