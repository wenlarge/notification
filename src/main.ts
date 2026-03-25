import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { NotificationModule } from './notification.module';
import { RpcErrorInterceptor } from './common/interceptor/rpc-error.interceptor';
import {
  KafkaTopics,
  Notification,
  NOTIFICATION_PROTO_PATH,
} from '@wenlarge/communication';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(NotificationModule);
  const config = app.get(ConfigService);
  const host = config.getOrThrow<string>('BASE_URL');
  const port = config.getOrThrow<number>('PORT');
  const kafkaBroker = config.getOrThrow<string>('KAFKA_BROKER');

  const grpcUrl = `${host}:${port}`;

  app.useGlobalInterceptors(new RpcErrorInterceptor());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [Notification.NOTIFICATION_PACKAGE_NAME],
      protoPath: NOTIFICATION_PROTO_PATH.map((p) =>
        join(process.cwd(), 'node_modules/@wenlarge/communication/', p),
      ),
      url: grpcUrl,
    },
  });

  const kafkaBrokers = kafkaBroker.split(',').map((b) => b.trim());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification-service',
        brokers: kafkaBrokers,
        connectionTimeout: 30_000,
        requestTimeout: 30_000,
        retry: {
          initialRetryTime: 200,
          retries: 20,
          maxRetryTime: 30_000,
          factor: 0.2,
          multiplier: 2,
        },
      },
      consumer: {
        groupId: 'notification-service-consumer-v1',
        allowAutoTopicCreation: true,
      },
      subscribe: {
        topics: [
          KafkaTopics.NOTIFICATION_EMAIL,
          KafkaTopics.NOTIFICATION_SMS,
        ],
        fromBeginning: false,
      },
    },
  });

  await app.startAllMicroservices();

  logger.log(`Notification gRPC listening on ${grpcUrl}`);
  logger.log(
    `Notification Kafka consumer: ${KafkaTopics.NOTIFICATION_EMAIL}, ${KafkaTopics.NOTIFICATION_SMS}`,
  );
}

bootstrap();
