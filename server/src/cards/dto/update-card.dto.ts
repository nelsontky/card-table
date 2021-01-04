import { IsArray, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateCardDto } from "./create-card.dto";

export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsString()
  readonly name: string;
  
  @IsArray()
  readonly tags: Array<string>;
}
