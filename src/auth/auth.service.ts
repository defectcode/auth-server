import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto'
import { UserService } from 'src/user/user.service'
import { AuthMethod, User } from 'prisma/__generated__'
import { Request } from 'express'

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

    public async login() {

    }

    public async logout() {

    }

    private async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id

            req.session.save(err => {
                if(err) {
                    return reject(
                        new InternalServerErrorException(
                            'No valid session. Please provide valid session and required parameters.'
                        )
                    )
                }

                resolve({
                    user
                })
            })
        })
    }
}
