import OpenAI from 'openai';
import { InstructionValidation } from '../dto/instructions-validation';

export class OpenAITools {
  private client: OpenAI;

  constructor() {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY
    });

    this.client = openai;
  }
  async generate(prompt: string): Promise<string> {
    const result = await this.client.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024'
    });

    const imageURL = result.data[0].url;

    return imageURL;
  }

  async checkInstructions(
    instructions: string
  ): Promise<InstructionValidation> {
    const prompt = `respond "true" or "false" if the string you are given is a set of instructions for making a meal.  If it is "true", following the "true" check for amount of ingredients or preparation times if you think is need it, be permissive. If is "false" following the "false" tell the user why. It can be only "true" or "false" remember. Add a pipe after the true or false and remove that end of line in you response. String given : "${instructions}"`;

    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo'
    });

    return this.formatCheckInstructions(completion.choices[0].message.content);
  }

  formatCheckInstructions(response: string): InstructionValidation {
    const content = response.split('|');
    const isValid = content[0].toString().trim();
    if (isValid === 'true') {
      return { isValid: true, comments: content[1].toString() };
    }
    return { isValid: false, comments: content[1].toString() };
  }
}
