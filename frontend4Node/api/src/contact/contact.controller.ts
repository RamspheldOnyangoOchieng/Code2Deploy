import { Controller, Get, Post, Body, Patch, Param, Request } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactStatus, ContactType } from '@prisma/client';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    create(@Request() req, @Body() body: any) {
        // profileId is optional here as guest users can send messages
        return this.contactService.create({
            ...body,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
    }

    @Get()
    findAll() {
        return this.contactService.findAll();
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: ContactStatus) {
        return this.contactService.updateStatus(id, status);
    }
}
