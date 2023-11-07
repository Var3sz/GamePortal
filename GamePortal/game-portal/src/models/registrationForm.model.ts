export interface RegistrationForm {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    birthdate: string;
    validFullName: boolean;
    validUserName: boolean;
    validEmail: boolean;
    validPassword: boolean;
    validBirthdate: boolean;
    fullNameFocus: boolean,
    userNameFocus: boolean,
    emailFocus: boolean,
    passwordFocus: boolean,
    birthdateFocus: boolean
    errorMessage: string;
}