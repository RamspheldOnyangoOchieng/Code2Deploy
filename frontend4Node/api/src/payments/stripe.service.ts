import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16' as any,
        });
    }

    async createCheckoutSession(priceInCents: number, programTitle: string, userEmail: string) {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: programTitle,
                        },
                        unit_amount: priceInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: userEmail,
            success_url: `${this.configService.get('FRONTEND_URL')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('FRONTEND_URL')}/programs`,
        });
    }
}
