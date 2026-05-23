import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  fullName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(160, { message: 'Bio must be less than 160 characters' })
  bio?: string;

  @IsUrl({}, { message: 'GitHub URL must be a valid URL' })
  @IsOptional()
  gitHub?: string;

  @IsUrl({}, { message: 'URL invalide' })
  @IsOptional()
  website?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  avatar?: string;
}
