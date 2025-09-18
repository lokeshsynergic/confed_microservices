import { Controller, Get, Post ,Body } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('apigateway')
  async sendTestMessage(@Body() body: any) {
    var route = '';
    var replyTopic = '';
    const endpoint = body.endpoint;
    const payload = body.payload;
    if(endpoint =='auth'){
       route = 'auth-events';
       replyTopic = 'auth-service-response';
    }else if( endpoint =='user'){
       route = 'user-events';
       replyTopic = 'user-service-response';
    }
    var response = await this.apiGatewayService.sendMessage(route, payload, replyTopic);
    return { status: 'Message sent to Kafka '+route,response };
  }
  
}
