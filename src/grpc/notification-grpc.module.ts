import { Module } from '@nestjs/common';
import { NotificationGrpcController } from './notification-grpc.controller';
import { NotificationKafkaProducerModule } from '../kafka/notification-kafka.module';

@Module({
  imports: [NotificationKafkaProducerModule],
  controllers: [NotificationGrpcController],
})
export class NotificationGrpcModule {}
