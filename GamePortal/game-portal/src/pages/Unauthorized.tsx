import { Button, Container } from "react-bootstrap";
import "../css-files/unauthorized.css"
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
    const navigate = useNavigate();

    const back = () => navigate(-1);

    return (
        <>

            <Container id="auth-container">
                <Container>403</Container>
                <Container className="txt">
                    Forbidden<span className="blink">_</span>
                </Container>
                <Button id="btn-back" onClick={back}>Go back</Button>
            </Container>
        </>
    );
}

export default Unauthorized;