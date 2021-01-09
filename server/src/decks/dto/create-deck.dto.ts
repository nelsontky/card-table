import { IsString, IsArray } from "class-validator";

export class CreateDeckDto {
  @IsString()
  readonly name: string;

  @IsArray()
  readonly cards: Array<{ id: string; quantity: number }>;
}
