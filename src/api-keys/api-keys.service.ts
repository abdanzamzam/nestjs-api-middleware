import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(createApiKeyDto: CreateApiKeyDto): Promise<{ apiKey: ApiKey; plainKey: string }> {
    // Generate secure random API key
    const plainKey = crypto.randomBytes(32).toString('hex');
    
    // Hash the key before storing
    const hashedKey = await bcrypt.hash(plainKey, 10);

    const apiKey = this.apiKeyRepository.create({
      ...createApiKeyDto,
      key: hashedKey,
    });

    const saved = await this.apiKeyRepository.save(apiKey);

    // Return both the entity and plain key (only time we show plain key)
    return {
      apiKey: saved,
      plainKey,
    };
  }

  async findAll(): Promise<ApiKey[]> {
    return this.apiKeyRepository.find();
  }

  async findOne(id: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
    if (!apiKey) {
      throw new NotFoundException('API Key not found');
    }
    return apiKey;
  }

  async validateKey(plainKey: string): Promise<ApiKey | null> {
    const allKeys = await this.apiKeyRepository.find({ where: { isActive: true } });

    for (const apiKey of allKeys) {
      const isValid = await bcrypt.compare(plainKey, apiKey.key);
      if (isValid) {
        // Check expiration
        if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
          return null;
        }

        // Update last used timestamp
        await this.apiKeyRepository.update(apiKey.id, {
          lastUsedAt: new Date(),
        });

        return apiKey;
      }
    }

    return null;
  }

  async update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKey> {
    await this.findOne(id); // Check if exists
    await this.apiKeyRepository.update(id, updateApiKeyDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const apiKey = await this.findOne(id);
    await this.apiKeyRepository.remove(apiKey);
  }
}
