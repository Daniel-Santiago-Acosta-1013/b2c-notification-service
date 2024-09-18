import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailchimp = require('@mailchimp/mailchimp_transactional');
import { NotificationPayloadDTO } from './notification.dto';

@Injectable()
export class EmailService {
    private readonly mailchimpApiKey: string;

    constructor(private configService: ConfigService) {
        this.mailchimpApiKey = this.configService.get<string>('MAILCHIMP_KEY');
        
        // Validar si la API key está presente
        if (!this.mailchimpApiKey) {
            throw new Error('MAILCHIMP_KEY no está definida en las variables de entorno');
        }
    }

    private async arrayFromObject(content) {
        const val = [];
        for (const key in content) {
            val.push({ name: key, content: content[key] });
        }
        return val;
    }

    private async sendMailchimpTemplate(template_name: string, message: any) {
        const factory = Mailchimp(this.mailchimpApiKey);
        const response = await factory.messages.sendTemplate({
            template_name,
            template_content: [{ name: 'example', content: 'example content' }],
            message,
        });
        return response;
    }

    async sendB2CApprovedEmail(payload: NotificationPayloadDTO) {
        const emailContent = {
            comercio: payload.nit,
            price: payload.totalAmountTransferred.toFixed(2),
            description: `Transferencias exitosas: ${payload.successfulTransfers}, fallidas: ${payload.failedTransfers}`,
            paymentsWayRerence: payload.orderCommerce,
            externalOrder: payload.uniqueCode,
            date: new Date(payload.creationDate).toLocaleString(),
            methodPay: 'Tarjeta de crédito',
            total: payload.totalAmountTransferred.toFixed(2),
        };

        const message = {
            from_email: 'accival@paymentsway.com.co',
            subject: 'Transacción Aceptada - Confirmación',
            merge_language: 'handlebars',
            to: [
                {
                    email: payload.emails,
                    type: 'to',
                },
            ],
            global_merge_vars: await this.arrayFromObject(emailContent),
        };

        // Enviar usando la plantilla de Mailchimp 'B2Capproved'
        const templateName = 'B2Capproved';

        const result = await this.sendMailchimpTemplate(templateName, message);
        console.log('Email enviado:', result);
    }
}
