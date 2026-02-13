import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
    private supabase: SupabaseClient;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.supabase = createClient(
            this.configService.get<string>('SUPABASE_URL') || '',
            this.configService.get<string>('SUPABASE_ANON_KEY') || '',
        );
    }

    async validateUser(token: string) {
        const { data: { user }, error } = await this.supabase.auth.getUser(token);

        if (error || !user) {
            throw new UnauthorizedException('Invalid Supabase token');
        }

        // Sync or fetch profile from Prisma
        let profile = await this.prisma.profile.findUnique({
            where: { supabaseId: user.id },
        });

        if (!profile) {
            profile = await this.prisma.profile.create({
                data: {
                    supabaseId: user.id,
                    email: user.email || '',
                    fullName: user.user_metadata?.full_name || '',
                    avatarUrl: user.user_metadata?.avatar_url || '',
                    role: 'STUDENT', // Default role
                },
            });
        }

        return profile;
    }

    // Helper to get Supabase client if needed elsewhere
    getSupabaseClient() {
        return this.supabase;
    }
}
