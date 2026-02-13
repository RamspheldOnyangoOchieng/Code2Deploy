import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
    constructor(private readonly programsService: ProgramsService) { }

    @Get()
    async findAll() {
        return this.programsService.findAll();
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return this.programsService.findOne(slug);
    }

    // Admin/Instructor only endpoint (Guard to be added)
    @Post()
    async create(@Body() createProgramDto: any) {
        return this.programsService.create(createProgramDto);
    }
}
