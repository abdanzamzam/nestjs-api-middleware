import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  private readonly targetApiBaseUrl: string;
  private readonly targetApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.targetApiBaseUrl = this.configService.get<string>('TARGET_API_BASE_URL') || '';
    this.targetApiKey = this.configService.get<string>('TARGET_API_KEY') || '';
  }

  async forwardRequest(
    method: string,
    path: string,
    headers: any,
    body: any,
    query: any,
  ): Promise<AxiosResponse> {
    try {
      // Remove our internal headers
      const forwardHeaders = { ...headers };
      delete forwardHeaders['x-api-key'];
      delete forwardHeaders['host'];
      delete forwardHeaders['connection'];

      // Add target API key if configured
      if (this.targetApiKey) {
        forwardHeaders['Authorization'] = `Bearer ${this.targetApiKey}`;
      }

      // Build request config
      const config: AxiosRequestConfig = {
        method: method.toLowerCase(),
        url: `${this.targetApiBaseUrl}${path}`,
        headers: forwardHeaders,
        params: query,
        data: body,
        validateStatus: () => true, // Don't throw on any status code
      };

      const response = await axios(config);

      return response;
    } catch (error) {
      // Re-throw with proper format
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || 500,
      );
    }
  }
}
