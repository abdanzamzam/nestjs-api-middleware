import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '../../api-keys/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract API key from header or query param
    const apiKey =
      request.headers['x-api-key'] ||
      request.headers['authorization']?.replace('Bearer ', '') ||
      request.query.api_key;

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Validate the API key
    const validKey = await this.apiKeysService.validateKey(apiKey);

    if (!validKey) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    // Attach the API key info to request for later use (e.g., rate limiting)
    request.apiKey = validKey;

    return true;
  }
}
