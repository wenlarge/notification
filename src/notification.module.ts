import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { NotificationKafkaConsumerModule } from './kafka/notification-kafka-consumer.module';
import { NotificationGrpcModule } from './grpc/notification-grpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    NotificationGrpcModule,
    NotificationKafkaConsumerModule,
  ],
})
export class NotificationModule {}
