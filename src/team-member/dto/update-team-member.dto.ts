import { Role } from "../schemas/team-member.schema";

export class UpdateTeamMemberDto {
    readonly firstName?: string;
    readonly lastName?: string;
    readonly phoneNumber?: string;
    readonly email?: string;
    readonly role?: Role;
  }