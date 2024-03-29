import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DecksService } from "./decks.service";
import { CreateDeckDto } from "./dto/create-deck.dto";
import { CreateDeckByNameDto } from "./dto/create-deck-by-name.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { User } from "src/common/decorators/user.decorator";

@Controller("decks")
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDeckDto: CreateDeckDto, @User() user: string) {
    return this.decksService.create(createDeckDto, user);
  }

  @Post("/by-name")
  @UseGuards(AuthGuard)
  createByName(@Body() createDeckByNameDto: CreateDeckByNameDto) {
    return this.decksService.createByName(createDeckByNameDto);
  }

  @Get()
  findShared(@Query("limit") limit?: number, @Query("offset") offset?: number) {
    return this.decksService.findShared(limit, offset);
  }

  @Get("mine")
  @UseGuards(AuthGuard)
  findMine(
    @User() user: string,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.decksService.findMine(user, limit, offset);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.decksService.findOne(id);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  update(
    @Param("id") id: string,
    @Body() createDeckDto: CreateDeckDto,
    @User() user: string,
  ) {
    return this.decksService.update(id, createDeckDto, user);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string, @User() user: string) {
    return this.decksService.remove(id, user);
  }
}
