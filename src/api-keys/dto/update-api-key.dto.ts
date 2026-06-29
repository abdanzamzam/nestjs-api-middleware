import { IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateApiKeyDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  rateLimit?: number;

  @IsOptional()
  expiresAt?: Date;
}
