import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paystack } from 'paystack-sdk';

@Injectable()
export class PaystackService {
    private paystack: Paystack;

    constructor(private configService: ConfigService) {
        this.paystack = new Paystack(this.configService.get<string>('PAYSTACK_SECRET_KEY') || '');
    }

    async initializeTransaction(amountInKobo: number, email: string, metadata: any): Promise<any> {
        return this.paystack.transaction.initialize({
            amount: amountInKobo.toString(),
            email,
            metadata,
            callback_url: `${this.configService.get('FRONTEND_URL')}/checkout/callback`,
        });
    }

    async verifyTransaction(reference: string): Promise<any> {
        return this.paystack.transaction.verify(reference);
    }
}
