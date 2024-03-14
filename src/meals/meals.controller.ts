// customer-meals.controller.ts

import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ImageGenerator } from './image-generator/imageGenerator';
import { CustomerMeal } from './entity.ts/customer.meal';
const prisma = new PrismaClient();

@Controller('customer-meals')
export class MealsController {
  constructor() {}

  @Get()
  async getAllCustomerMeals(@Query('orderBy') orderBy?: string) {
    try {
      let meals;
      if (orderBy === 'likes') {
        meals = await prisma.customerMeal.findMany({
          orderBy: {
            likes: 'desc'
          }
        });
      } else if (orderBy === 'recent') {
        meals = await prisma.customerMeal.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
      } else {
        meals = await prisma.customerMeal.findMany();
      }
      return meals;
    } catch (error) {
      console.error('Error fetching customer meals:', error);
      throw error;
    }
  }

  @Post()
  async createCustomerMeal(@Body() mealData: CustomerMeal) {
    try {
      const newMeal = await prisma.customerMeal.create({
        data: mealData
      });
      return newMeal;
    } catch (error) {
      console.error('Error creating customer meal:', error);
      throw error;
    }
  }

  @Post('generate-image')
  async generateMealImage(@Body('ingredients') ingredients: string[]) {
    try {
      const imageGenerator = new ImageGenerator();
      const imageUrlPromise = imageGenerator.generate(
        'A platting meal with these ingredients :' +
          ingredients.join(',') +
          ' as you are a chef of CookUnity'
      );
      const imageUrl = await imageUrlPromise.then();
      return imageUrl;
    } catch (error) {
      console.error('Error generating meal image:', error);
      throw error;
    }
  }

  @Patch(':id/like')
  async likeCustomerMeal(@Param('id') id: number) {
    try {
      const likedMeal = await prisma.customerMeal.update({
        where: { id: +id },
        data: {
          likes: {
            increment: 1
          }
        }
      });
      return likedMeal;
    } catch (error) {
      console.error('Error liking customer meal:', error);
      throw error;
    }
  }

  @Patch(':id/dislike')
  async dislikeCustomerMeal(@Param('id') id: number) {
    try {
      const likedMeal = await prisma.customerMeal.update({
        where: { id: +id },
        data: {
          likes: {
            decrement: 1
          }
        }
      });
      return likedMeal;
    } catch (error) {
      console.error('Error liking customer meal:', error);
      throw error;
    }
  }
}
