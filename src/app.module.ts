import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [ConfigModule.forRoot(), MealsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
