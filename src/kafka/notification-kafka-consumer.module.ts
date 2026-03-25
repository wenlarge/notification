import { Module } from '@nestjs/common';
import { NotificationKafkaConsumer } from './notification-kafka.consumer';
import { NotificationKafkaConsumerController } from './notification-kafka.consumer.controller';
import { EmailDispatchService } from '../providers/email-dispatch.service';
import { SmsDispatchService } from '../providers/sms-dispatch.service';

@Module({
  providers: [
    NotificationKafkaConsumer,
    EmailDispatchService,
    SmsDispatchService,
  ],
  controllers: [NotificationKafkaConsumerController],
})
export class NotificationKafkaConsumerModule {}
