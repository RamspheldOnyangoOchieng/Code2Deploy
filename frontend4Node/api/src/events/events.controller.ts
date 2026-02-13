import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    findAll() {
        return this.eventsService.findAll();
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.eventsService.findOne(slug);
    }

    @Post()
    @UseGuards(SupabaseGuard)
    create(@Body() createEventDto: any) {
        return this.eventsService.create(createEventDto);
    }

    @Patch(':id')
    @UseGuards(SupabaseGuard)
    update(@Param('id') id: string, @Body() updateEventDto: any) {
        return this.eventsService.update(id, updateEventDto);
    }

    @Delete(':id')
    @UseGuards(SupabaseGuard)
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
}
