import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { HookService } from './hook.service';
import { CreateHookDto } from './dto/create-hook.dto';
import { UpdateHookDto } from './dto/update-hook.dto';
import { TOTPGuard } from 'src/guards/TOTP';

@Controller('hook')
export class HookController {
  constructor(private readonly hookService: HookService) {}

  @Post()
  @UseGuards(TOTPGuard)
  create(@Body() createHookDto: CreateHookDto) {
    return this.hookService.create(createHookDto);
  }

  @Get()
  @UseGuards(TOTPGuard)
  findAll() {
    return this.hookService.findAll();
  }

  @Get(':id')
  @UseGuards(TOTPGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.hookService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TOTPGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateHookDto: UpdateHookDto) {
    return this.hookService.update(id, updateHookDto);
  }

  @Delete(':id')
  @UseGuards(TOTPGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.hookService.remove(id);
  }

  @Post('deploy')
  deploy(@Body() payload: any) {
    return this.hookService.deploy(payload)    
  }
}
