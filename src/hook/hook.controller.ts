import { Controller, Post, Body} from '@nestjs/common';
import { HookService } from './hook.service';


@Controller('hook')
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @Post('deploy')
  deploy(@Body() payload: any) {
    return this.hookService.deploy(payload)    
  }
}
