import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

export type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

@Injectable()
export class EmailDispatchService {
  private readonly logger = new Logger(EmailDispatchService.name);

  constructor(private readonly config: ConfigService) {
    const key = this.config.getOrThrow<string>('SENDGRID_API_KEY');
    sgMail.setApiKey(key);
  }

  async send(payload: MailPayload): Promise<void> {
    const from = this.config.getOrThrow<string>('SENDGRID_FROM_EMAIL');

    const base = {
      to: payload.to,
      from,
      subject: payload.subject,
    };
    if (payload.text?.trim() && payload.html?.trim()) {
      await sgMail.send({ ...base, text: payload.text, html: payload.html });
    } else if (payload.html?.trim()) {
      await sgMail.send({ ...base, html: payload.html });
    } else {
      await sgMail.send({ ...base, text: payload.text ?? '' });
    }

    this.logger.debug(`SendGrid mail sent to ${payload.to}`);
  }
}
