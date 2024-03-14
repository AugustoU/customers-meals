import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
  Delete
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomerMeal } from './entity.ts/customer.meal';
import { OpenAITools } from './open-ai-tools/open-ai-tools';
import { ApiQuery } from '@nestjs/swagger';
import { InstructionValidation } from './dto/instructions-validation';
import { GenerateImageBody } from './dto/generate-image.dto';
const prisma = new PrismaClient();

@Controller('customer-meals')
export class MealsController {
  constructor() {}

  @Get()
  async getAllCustomerMeals() {
    try {
      const meals = await prisma.customerMeal.findMany({
        orderBy: {
          likes: 'desc'
        }
      });

      return meals;
    } catch (error) {
      console.error('Error fetching customer meals:', error);
      throw error;
    }
  }

  @Post()
  async createCustomerMeal(@Body() mealData: CustomerMeal) {
    try {
      if (mealData.image.length < 10) {
        const AITools = new OpenAITools();
        const imageUrlPromise = AITools.generate(
          'Generate only the platting of a real ' +
            mealData.name +
            'dish , that platting are cooked with the following instructions :' +
            mealData.instructions +
            ' and have the following ingredients :' +
            mealData.ingredients
        );
        const imageUrl = await imageUrlPromise.then();
        mealData.image = imageUrl;
      }

      const newMeal = await prisma.customerMeal.create({
        data: mealData
      });
      return newMeal;
    } catch (error) {
      console.error('Error creating customer meal:', error);
      throw error;
    }
  }

  @Delete()
  async deleteCustomerMeal(@Query('id') id: number) {
    try {
      const deletedMeal = await prisma.customerMeal.delete({
        where: {
          id: +id
        }
      });
      return deletedMeal;
    } catch (error) {
      console.error('Error deleting customer meal:', error);
      throw error;
    }
  }

  @Get('check-instructions')
  @ApiQuery({ name: 'instructions', type: String })
  async checkIntructions(
    @Query('instructions') instructions: string
  ): Promise<InstructionValidation> {
    try {
      const AITools = new OpenAITools();
      const checkInstructionsPromise = AITools.checkInstructions(instructions);
      const validation = await checkInstructionsPromise.then();
      return validation;
    } catch (error) {
      console.error('Error generating meal image:', error);
      throw error;
    }
  }

  @Post('generate-image')
  async generateMealImage(@Body() data: GenerateImageBody) {
    try {
      const AITools = new OpenAITools();
      const imageUrlPromise = AITools.generate(
        'Generate only the platting of a real ' +
          data.name +
          'dish , that platting are cooked with the following instructions :' +
          data.instructions +
          ' and have the following ingredients :' +
          data.ingredients
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

  @Patch(':id/unlike')
  async unLikeCustomerMeal(@Param('id') id: number) {
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
      console.error('Error removing like customer meal:', error);
      throw error;
    }
  }

  @Patch(':id/remove-dislike')
  async removeDislikeCustomerMeal(@Param('id') id: number) {
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
      console.error('Error removing dislike customer meal:', error);
      throw error;
    }
  }
}
