import {  ProgressBar, Form } from "react-bootstrap";

export const PasswordStrength = ({ password }: { password: string }) => {
    const strengthChecker = () => {
        let strengthValue = 0;
        let regexList = ["[A-Z]", "[a-z]", "[0-9]", "\\W"];
        let strengthText = ["", "unacceptable", "weak", "average", "good", "strong"];

        regexList.forEach((regex) => {
            if (new RegExp(regex).test(password)) {
                strengthValue += 1;
            }
        });
        if (password.length >= 8) {
            strengthValue += 1;
        }
        return { text: strengthText[strengthValue], value: strengthValue }
    };

    return (
        <>
            <ProgressBar
                className={`pwd-checker-bar strength-${strengthChecker().text}`}
                now={strengthChecker().value}
                max={5}
            />
            <Form.Text className="align-middle">Password strength: {strengthChecker().text}</Form.Text>
        </>
    );
}

export default PasswordStrength;