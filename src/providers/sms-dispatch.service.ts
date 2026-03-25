import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

export type SmsPayload = {
  to: string;
  body: string;
};

@Injectable()
export class SmsDispatchService {
  private readonly logger = new Logger(SmsDispatchService.name);
  private readonly client: twilio.Twilio;

  constructor(private readonly config: ConfigService) {
    this.client = twilio(
      this.config.getOrThrow<string>('TWILIO_ACCOUNT_SID'),
      this.config.getOrThrow<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async send(payload: SmsPayload): Promise<void> {
    const from = this.config.getOrThrow<string>('TWILIO_SMS_FROM');
    await this.client.messages.create({
      to: payload.to,
      from,
      body: payload.body,
    });

    this.logger.debug(`Twilio SMS sent to ${payload.to}`);
  }
}
