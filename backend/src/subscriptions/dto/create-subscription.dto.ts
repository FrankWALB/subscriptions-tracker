import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsBoolean, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingCycle, Category } from '../subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'Netflix' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ enum: BillingCycle, default: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ enum: Category, default: Category.OTHER })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '#6366f1' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
