import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    @UseGuards(SupabaseGuard)
    createIntent(
        @Request() req,
        @Body('programId') programId: string,
        @Body('gateway') gateway: 'stripe' | 'paystack'
    ) {
        return this.paymentsService.createPaymentIntent(programId, req.user.id, gateway);
    }

    @Post('webhook/stripe')
    handleStripeWebhook(@Body() payload: any) {
        return this.paymentsService.handleWebhook(payload, 'stripe');
    }

    @Post('webhook/paystack')
    handlePaystackWebhook(@Body() payload: any) {
        return this.paymentsService.handleWebhook(payload, 'paystack');
    }
}
