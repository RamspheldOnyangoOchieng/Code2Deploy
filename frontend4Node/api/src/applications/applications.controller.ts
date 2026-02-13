import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { ApplicationStatus } from '@prisma/client';

@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) { }

    @UseGuards(SupabaseGuard)
    @Post()
    create(@Request() req, @Body() body: { programId?: string; eventId?: string; notes?: string }) {
        return this.applicationsService.create(req.user.id, body);
    }

    @UseGuards(SupabaseGuard)
    @Get('my')
    getMyApplications(@Request() req) {
        return this.applicationsService.findByProfile(req.user.id);
    }

    @Get()
    findAll() {
        return this.applicationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.applicationsService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: ApplicationStatus) {
        return this.applicationsService.updateStatus(id, status);
    }
}
