import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const NOTIFICATION_KAFKA = 'NOTIFICATION_KAFKA';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_KAFKA,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'notification-service-producer',
              brokers: config
                .getOrThrow<string>('KAFKA_BROKER')
                .split(',')
                .map((b) => b.trim()),
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
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NotificationKafkaProducerModule {}
