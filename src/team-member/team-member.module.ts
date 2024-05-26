import { Module } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamController } from './team-member.controller';
import { TeamMember, TeamMemberSchema } from './schemas/team-member.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: TeamMember.name, schema: TeamMemberSchema}])],
  providers: [TeamMemberService],
  controllers: [TeamController]
})
export class TeamMemberModule {}
