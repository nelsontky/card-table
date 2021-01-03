import { IsArray, IsString } from "class-validator";

export class CreateCardDto {
  @IsArray()
  readonly tags: Array<string>;

  @IsString()
  readonly createdBy: string;
}
