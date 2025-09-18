import { Injectable,OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserServiceService implements OnModuleInit {
  private kafkaProducer: Producer;
  private kafkaConsumer: Consumer;
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'user-service',
      brokers: ['localhost:9092'],
    });
    this.kafkaProducer = kafka.producer();
    this.kafkaConsumer = kafka.consumer({ groupId: 'user-group' });
    await this.kafkaProducer.connect();
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topic: 'user-events', fromBeginning: true });

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log(`📥 Received message on ${topic}: ${message.value?.toString()}`);

        const correlationId = message.key?.toString() || ''; // use same key
        let response = {};

        try {
          const data = JSON.parse(message.value?.toString() || '{}');

          if (data.email && data.name && data.image) {
            const user = await this.createUser(data.image, data.name+'LOKK', data.email);
            response = {
              status: 'success',
              errorCode: 0,
              message: 'User created successfully',
              data: user,
            };
          } else {
            response = {
              status: 'failed',
              errorCode: 2,
              message: 'Invalid message format',
              data: null,
            };
          }
        } catch (err: any) {
          response = {
            status: 'failed',
            errorCode: 3,
            message: `Processing error: ${err.message}`,
            data: null,
          };
        }

        // ✅ Send response back to reply topic
        await this.kafkaProducer.send({
          topic: 'user-service-response',
          messages: [
            { key: correlationId, value: JSON.stringify(response) },
          ],
        });
        console.log('📤 Sent response:', response);
      },
    });
  }
  
    async createUser(image: string, name: string, email: string) {
    const user = this.userRepo.create({ image, name, email });
    return await this.userRepo.save(user);
     }
  
    
    
}
