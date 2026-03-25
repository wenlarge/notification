import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaTopics } from '@wenlarge/communication';
import { NotificationKafkaConsumer } from './notification-kafka.consumer';

@Controller()
export class NotificationKafkaConsumerController {
  constructor(private readonly consumer: NotificationKafkaConsumer) {}

  @EventPattern(KafkaTopics.NOTIFICATION_EMAIL)
  async onEmail(@Payload() payload: unknown) {
    return this.consumer.handleEmail(payload);
  }

  @EventPattern(KafkaTopics.NOTIFICATION_SMS)
  async onSms(@Payload() payload: unknown) {
    return this.consumer.handleSms(payload);
  }
}
