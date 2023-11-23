import { Card, CardBody, Container, Heading, Button, Text } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

export const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Card variant={'unauthorizedCard'}>
                <CardBody mb={"0px"}>
                    <Container className="d-flex justify-content-center align-items-center">
                        <Heading color={"red"}>Access denied</Heading>
                        <FontAwesomeIcon icon={faBan} className='fa-lg ml-1' color='red' />
                    </Container>
                    <Container className="d-flex flex-column justify-content-center align-items-center">
                        <Text>You do not have the necessary permissions to access this page.</Text>
                        <Button variant={'unauthorizedButton'} onClick={() => navigate("/home")}>Go to home</Button>
                    </Container>
                </CardBody>
            </Card >
        </Container >
    );
};

export default Unauthorized;