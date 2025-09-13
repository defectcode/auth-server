import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto'
import { UserService } from 'src/user/user.service'
import { AuthMethod, User } from 'prisma/__generated__'
import { Request } from 'express'
import { LoginDto } from './dto/login.dto'
import { verify } from 'argon2'

@Injectable()
export class AuthService {

    public constructor(private readonly userService: UserService) {}

    public async register(req: Request, dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email)

        if(isExists) {
            throw new ConflictException(
                'Registration is not allowed. The following email already exists. Please log in or register with a different email.'
            );
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false
        )

        return this.saveSession(req, newUser)
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email)

        if(!user || !user.password) {
            throw new NotFoundException(
                'User is not found. Please get correct data for user'
            )
        }

        const isValidPassword = await verify(user.password, dto.password)

        if(!isValidPassword) {
            throw new UnauthorizedException('Password is not correct.')
        }

        return this.saveSession(req, user)
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if(err) {
                    return reject(
                        new InternalServerErrorException(
                            'Session Error.'
                        )
                    )
                }
                res.clearCookie('session')
            })
        })
    }

    private async saveSession(req: Request, user: User) {
        console.log('Session saved. User: ', user)
    }
}
