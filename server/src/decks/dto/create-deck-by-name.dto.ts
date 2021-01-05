import { IsString, IsArray } from "class-validator";

export class CreateDeckByNameDto {
  @IsString()
  readonly name: string;

  @IsArray()
  readonly cards: Array<{ name: string; quantity: number }>;

  @IsString()
  readonly createdBy: string;
}
