import { Button, Card, Container, FormText } from "react-bootstrap";
import "../../css-files/unauthorized.css";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container id="unauth">
            <Card.Title id="unauth-title">
                <FormText className="display-4">Unauthorized Access</FormText>
            </Card.Title>
            <FormText className="lead">
                Sorry, you do not have the necessary permissions to access this page.
            </FormText>
            <Button className='home-btn mt-3' onClick={() => navigate("/home")}>
                Go to Home
            </Button>
        </Container>
    );
};

export default Unauthorized;