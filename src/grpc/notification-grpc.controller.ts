import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopics, Notification } from '@wenlarge/communication';
import { NOTIFICATION_KAFKA } from '../kafka/notification-kafka.module';

@Controller()
export class NotificationGrpcController implements OnModuleInit {
  private readonly logger = new Logger(NotificationGrpcController.name);

  constructor(
    @Inject(NOTIFICATION_KAFKA)
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  @GrpcMethod(Notification.NOTIFICATION_SERVICE_NAME, 'AddMail')
  async addMail(request: Notification.AddMailRequest) {
    if (!request.to?.trim()) {
      throw new RpcException('to is required');
    }
    if (!request.subject?.trim()) {
      throw new RpcException('subject is required');
    }
    if (!request.text?.trim() && !request.html?.trim()) {
      throw new RpcException('text or html is required');
    }

    this.kafka.emit(KafkaTopics.NOTIFICATION_EMAIL, {
      to: request.to,
      subject: request.subject,
      text: request.text ?? '',
      html: request.html ?? '',
    });
    this.logger.debug(`Queued email to ${request.to}`);
  }

  @GrpcMethod(Notification.NOTIFICATION_SERVICE_NAME, 'AddSms')
  async addSms(request: Notification.AddSmsRequest) {
    if (!request.to?.trim()) {
      throw new RpcException('to is required');
    }
    if (!request.body?.trim()) {
      throw new RpcException('body is required');
    }

    this.kafka.emit(KafkaTopics.NOTIFICATION_SMS, {
      to: request.to,
      body: request.body,
    });
    this.logger.debug(`Queued SMS to ${request.to}`);
  }
}
