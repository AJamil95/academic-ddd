import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Servicio funcionando correctamente',
      timestamp: new Date().toISOString()
    };
  }
}