import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MentorshipService } from './mentorship.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('mentorship')
@UseGuards(SupabaseGuard)
export class MentorshipController {
    constructor(private readonly mentorshipService: MentorshipService) { }

    @Get('dashboard')
    getDashboard(@Request() req) {
        // req.user is the profile from Prisma attached by SupabaseGuard
        return this.mentorshipService.getMentorDashboard(req.user.id);
    }

    @Post('sessions')
    createSession(@Request() req, @Body() sessionData: any) {
        return this.mentorshipService.createSession(req.user.id, sessionData);
    }

    @Get('mentees')
    getMentees(@Request() req) {
        // This could also be a separate method in service
        return this.mentorshipService.getMentorDashboard(req.user.id).then(d => d.mentees);
    }
}
