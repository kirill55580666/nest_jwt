import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request as RequestType, Response as ResponseType } from "express";
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: ResponseType
  ) {
    const tokens = await this.authService.login(data)
    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
    return tokens;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType
  ) {
    res.clearCookie('refreshToken');
    this.authService.logout(req.user['sub'])
    return req.user
  }

  //@UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @Body() data,
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType
  ) {
    //const userId = req.user['sub'];
    const refreshToken = req.cookies['refreshToken']
    res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
    return this.authService.refreshTokens(refreshToken);
  }
}
