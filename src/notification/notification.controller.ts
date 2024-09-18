import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { NotificationPayloadDTO } from './notification.dto';
import { BasicAuthGuard } from './basic-auth.guard';
import { EmailService } from './email.service';

@Controller('notification/api/v1')
export class NotificationController {
    constructor(private readonly emailService: EmailService) {}

    @Post('receiveNotificationTransfer')
    @UseGuards(BasicAuthGuard)
    @HttpCode(200)
    async receiveNotificationTransfer(@Body() payload: NotificationPayloadDTO): Promise<any> {
        // Log the received payload for debugging purposes
        console.log('Received notification:', payload);

        // Send email using Mailchimp with the processed data from the payload
        await this.emailService.sendB2CApprovedEmail(payload);

        return { status: 'success' };
    }
}
