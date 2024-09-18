import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { NotificationPayloadDTO } from './notification.dto';
import { BasicAuthGuard } from './basic-auth.guard';

@Controller('notification/api/v1')
export class NotificationController {
    @Post('receiveNotificationTransfer')
    @UseGuards(BasicAuthGuard)
    @HttpCode(200)
    receiveNotificationTransfer(@Body() payload: NotificationPayloadDTO): any {
        // Process the received notification payload
        console.log('Received notification:', payload);

        // Implement your logic here

        return { status: 'success' };
    }
}
