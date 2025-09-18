import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer,Consumer } from 'kafkajs';

@Injectable()
export class ApiGatewayService implements OnModuleInit {
  private kafka: Kafka;
  private kafkaProducer: Producer;
  private kafkaConsumer: Consumer;

  async onModuleInit() {
       this.kafka = new Kafka({
      clientId: 'api-gateway',
      brokers: ['localhost:9092'],
    });

    this.kafkaProducer = this.kafka.producer();
    await this.kafkaProducer.connect();
    console.log('✅ API Gateway Kafka Producer Connected');
  }

   async sendMessage(topic: string, message: any, replyTopic: string): Promise<any> {
    const correlationId = Date.now().toString();
    // Create consumer
    const tempConsumer = this.kafka.consumer({ groupId: `reply-group-${correlationId}` });
    await tempConsumer.connect();
    await tempConsumer.subscribe({ topic: replyTopic, fromBeginning: false });

    let consumerReady = false;

  // Prepare response promise
    const responsePromise = new Promise((resolve) => {
      tempConsumer.run({
        eachMessage: async ({ message }) => {
          const resp = JSON.parse(message.value!.toString());
          if (message.key?.toString() === correlationId) {
            resolve(resp);
            await tempConsumer.disconnect();
          }
        },
      }).then(() => (consumerReady = true));
    });

    // Wait for consumer to be running
    while (!consumerReady) {
      await new Promise((res) => setTimeout(res, 50)); // small wait to ensure run() is active
    }

    // Send message after consumer is running
    await this.kafkaProducer.send({
      topic,
      messages: [{ key: correlationId, value: JSON.stringify(message) }],
    });

    return responsePromise;
    }

}
