import {
    Controller,
    Post,
    Body,
    UseGuards,
    HttpCode,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { NotificationPayloadDTO } from './notification.dto';
import { BasicAuthGuard } from './basic-auth.guard';
import { EmailService } from './email.service';

@Controller('notification/api/v1')
export class NotificationController {
    constructor(private readonly emailService: EmailService) { }

    @Post('receiveNotificationTransfer')
    @UseGuards(BasicAuthGuard)
    @HttpCode(200)
    async receiveNotificationTransfer(@Body() payload: NotificationPayloadDTO): Promise<any> {
        // Registrar el payload recibido para propósitos de depuración
        console.log('Received notification:', payload);

        try {
            // Enviar correo usando Mailchimp con los datos procesados del payload
            const emailResult = await this.emailService.sendB2CApprovedEmail(payload);
            return { status: 'success', emailResult };
        } catch (error) {
            // Registrar el error y retornar una respuesta adecuada
            console.error('Error en receiveNotificationTransfer:', error);

            // Lanzar una excepción HTTP con detalles del error
            throw new HttpException(
                {
                    status: 'error',
                    message: 'Error al enviar el correo electrónico',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
