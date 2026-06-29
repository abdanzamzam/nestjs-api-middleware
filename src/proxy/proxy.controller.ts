import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('proxy')
@UseGuards(ApiKeyGuard)
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxyRequest(@Req() req: Request, @Res() res: Response) {
    const path = req.url.replace('/proxy', '');
    const method = req.method;
    const headers = req.headers;
    const body = req.body;
    const query = req.query;

    try {
      const response = await this.proxyService.forwardRequest(
        method,
        path,
        headers,
        body,
        query,
      );

      // Forward status code
      res.status(response.status);

      // Forward headers (excluding some)
      Object.keys(response.headers).forEach((key) => {
        if (!['connection', 'transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
          res.setHeader(key, response.headers[key]);
        }
      });

      // Send response as-is
      return res.send(response.data);
    } catch (error) {
      return res.status(error.status || 500).json({
        error: 'Proxy Error',
        message: error.message,
      });
    }
  }
}
