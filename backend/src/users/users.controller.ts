import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import express from 'express';

interface AuthenticatedRequest extends express.Request {
  user: {
    id: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /users/search?q=react
  @Get('search')
  async search(@Query('q') query: string) {
    if (!query || query.length < 2) return [];
    return this.usersService.searchUsers(query);
  }

  // GET /users/:username  — profil public
  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  // PUT /users/me  — modifier son propre profil
  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, dto);
  }
}
