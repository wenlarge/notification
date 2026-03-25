import { Injectable, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { EmailDispatchService, MailPayload } from '../providers/email-dispatch.service';
import { SmsDispatchService, SmsPayload } from '../providers/sms-dispatch.service';

@Injectable()
export class NotificationKafkaConsumer {
  private readonly logger = new Logger(NotificationKafkaConsumer.name);

  constructor(
    private readonly email: EmailDispatchService,
    private readonly sms: SmsDispatchService,
  ) {}

  async handleEmail(@Payload() payload: unknown): Promise<void> {
    const p = payload as MailPayload;
    try {
      await this.email.send(p);
    } catch (err) {
      this.logger.error(
        `Email send failed: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
    }
  }

  async handleSms(@Payload() payload: unknown): Promise<void> {
    const p = payload as SmsPayload;
    try {
      await this.sms.send(p);
    } catch (err) {
      this.logger.error(
        `SMS send failed: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
      throw err;
    }
  }
}
