import { Body, Controller, Delete, Get, Injectable, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMember, TeamMemberDocument } from './schemas/team-member.schema';
import { PaginationResult } from 'src/utils/pagination';

@Controller('team')
export class TeamController {
    constructor(private teamMemberService: TeamMemberService) { }

    @Get()
    async findAll(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
      ): Promise<PaginationResult<TeamMember>> {
        return this.teamMemberService.findAll(page, limit);
      }

    @Post()
    async create(@Body() createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember> {
        return this.teamMemberService.create(createTeamMemberDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    ): Promise<TeamMember> {
        return this.teamMemberService.update(id, updateTeamMemberDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.teamMemberService.remove(id);
    }
}
