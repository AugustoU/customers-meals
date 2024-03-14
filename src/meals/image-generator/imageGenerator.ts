import OpenAI from 'openai';

export class ImageGenerator {
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
}
