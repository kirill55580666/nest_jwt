import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request as RequestType } from "express";

interface UpdateData {
  name?: string;
  phone?: string;
  address?: string;
  about?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getUser(@Req() req: RequestType) {
    return this.usersService.getUser(req.user['sub'])
  }

  @UseGuards(AccessTokenGuard)
  @Delete('delete-info')
  deleteInfo(
    @Body() data,
    @Req() req: RequestType,
    ) {
    return this.usersService.deleteInfo(req.user['sub'], data)
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update')
  update(
    @Body() data: UpdateData,
    @Req() req: RequestType,
  ) {
    this.usersService.update(req.user['sub'], data)
  }
}
