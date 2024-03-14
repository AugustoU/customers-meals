import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';

@Module({
  controllers: [MealsController]
})
export class MealsModule {}
