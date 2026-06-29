import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

@Controller('admin/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async create(@Body() createApiKeyDto: CreateApiKeyDto) {
    const result = await this.apiKeysService.create(createApiKeyDto);
    return {
      message: 'API Key created successfully. Save this key, it will not be shown again!',
      apiKey: result.plainKey,
      details: {
        id: result.apiKey.id,
        name: result.apiKey.name,
        serviceName: result.apiKey.serviceName,
        rateLimit: result.apiKey.rateLimit,
        createdAt: result.apiKey.createdAt,
      },
    };
  }

  @Get()
  findAll() {
    return this.apiKeysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiKeysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiKeyDto: UpdateApiKeyDto) {
    return this.apiKeysService.update(id, updateApiKeyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.apiKeysService.remove(id);
    return { message: 'API Key deleted successfully' };
  }
}
