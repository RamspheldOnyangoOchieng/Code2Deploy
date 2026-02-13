import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@UseGuards(SupabaseGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    findAll(@Request() req) {
        return this.notificationsService.findByProfile(req.user.id);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }

    @Patch(':id/archive')
    archive(@Param('id') id: string) {
        return this.notificationsService.archive(id);
    }

    // --- Preferences ---
    @Get('preferences')
    getPreferences(@Request() req) {
        return this.notificationsService.getPreferences(req.user.id);
    }

    @Patch('preferences')
    updatePreferences(@Request() req, @Body() body: any) {
        return this.notificationsService.updatePreferences(req.user.id, body);
    }
}
