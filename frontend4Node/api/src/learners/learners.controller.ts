import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LearnersService } from './learners.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('learners')
@UseGuards(SupabaseGuard)
export class LearnersController {
    constructor(private readonly learnersService: LearnersService) { }

    @Get('dashboard')
    getDashboard(@Request() req) {
        return this.learnersService.getLearnerDashboard(req.user.id);
    }

    @Post('assignments/:id/submit')
    submitAssignment(
        @Request() req,
        @Param('id') assignmentId: string,
        @Body() submissionData: any
    ) {
        return this.learnersService.submitAssignment(req.user.id, assignmentId, submissionData);
    }

    @Get('courses')
    getMyCourses(@Request() req) {
        return this.learnersService.getLearnerDashboard(req.user.id).then(d => d.enrollments);
    }
}
