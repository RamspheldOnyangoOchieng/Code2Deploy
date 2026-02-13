import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('certificates')
export class CertificatesController {
    constructor(private readonly certificatesService: CertificatesService) { }

    @UseGuards(SupabaseGuard)
    @Get('my')
    getMyCertificates(@Request() req) {
        return this.certificatesService.findCertificatesByProfile(req.user.id);
    }

    @UseGuards(SupabaseGuard)
    @Get('my/badges')
    getMyBadges(@Request() req) {
        return this.certificatesService.findBadgesByProfile(req.user.id);
    }

    @Get()
    findAll() {
        return this.certificatesService.findAllCertificates();
    }
}
