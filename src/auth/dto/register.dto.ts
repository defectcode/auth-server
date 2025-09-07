import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate
} from 'class-validator'
import { IsPasswordsMatchingConstraint } from 'src/libs/common/decorators/is-passwords-matching-constraint.decorator'


export class RegisterDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string

  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long.'
  })
  password: string

  @IsString({ message: 'Password confirmation must be a string.' })
  @IsNotEmpty({ message: 'Password confirmation is required.' })
  @MinLength(6, {
    message: 'Password confirmation must be at least 6 characters long.'
  })
  @Validate(IsPasswordsMatchingConstraint, {
    message: 'Passwords do not match.'
  })
  passwordRepeat: string
}
