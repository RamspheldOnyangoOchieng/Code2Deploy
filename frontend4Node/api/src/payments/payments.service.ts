import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StripeService } from './stripe.service';
import { PaystackService } from './paystack.service';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private stripeService: StripeService,
        private paystackService: PaystackService,
    ) { }

    async createPaymentIntent(programId: string, profileId: string, gateway: 'stripe' | 'paystack'): Promise<{ url: string | null }> {
        const program = await this.prisma.program.findUnique({
            where: { id: programId },
        });

        if (!program) throw new PaymentNotFoundException('Program not found');

        // Convert decimal to cents/kobo
        const amount = Number(program.price) * 100;

        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
        });

        if (!profile) throw new PaymentNotFoundException('Profile not found');

        if (gateway === 'stripe') {
            const session = await this.stripeService.createCheckoutSession(
                amount,
                program.title,
                profile.email
            );
            return { url: session.url };
        } else {
            const transaction: any = await this.paystackService.initializeTransaction(
                amount,
                profile.email,
                { programId, profileId }
            );
            return { url: transaction?.data?.authorization_url || null };
        }
    }

    async handleWebhook(payload: any, gateway: 'stripe' | 'paystack') {
        // Webhook logic to fulfill order and update Enrollment status
        // implementation details for production security (signature verification) go here
    }
}

class PaymentNotFoundException extends BadRequestException { }
