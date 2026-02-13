import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe.service';
import { PaystackService } from './paystack.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService, PaystackService, PrismaService],
  exports: [PaymentsService]
})
export class PaymentsModule { }
