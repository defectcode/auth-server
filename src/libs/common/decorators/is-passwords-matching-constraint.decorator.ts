import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { RegisterDto } from 'src/auth/dto/register.dto'

@ValidatorConstraint({ name: 'IsPasswordMatching'})
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
    public validate(passwordRepead: string, args: ValidationArguments) {
        const obj = args.object as RegisterDto
        return obj.password === passwordRepead
    }

    public defaultMessage(validationArguments?: ValidationArguments) {
        return 'Password is not corect'
    }
}