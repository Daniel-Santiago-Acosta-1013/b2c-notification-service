import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || '';

    const [authType, token] = authHeader.split(' ');

    if (authType !== 'Basic' || !token) {
      throw new UnauthorizedException('Missing or invalid authentication header');
    }

    const credentials = Buffer.from(token, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Validate that the required environment variables are set
    if (!process.env.BASIC_AUTH_USERNAME || !process.env.BASIC_AUTH_PASSWORD) {
      throw new UnauthorizedException('Server misconfiguration: Authentication credentials are missing.');
    }

    // Expected credentials from environment variables
    const expectedUsername = process.env.BASIC_AUTH_USERNAME;
    const expectedPassword = process.env.BASIC_AUTH_PASSWORD;

    if (username === expectedUsername && password === expectedPassword) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
