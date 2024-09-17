import { Module } from '@nestjs/common';
import { HookModule } from './hook/hook.module';
import { APP_PIPE } from '@nestjs/core';
import { CustomValidationPipe } from './helpers/CustomValidationPipe';

@Module({
  imports: [HookModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],
})
export class AppModule {}
