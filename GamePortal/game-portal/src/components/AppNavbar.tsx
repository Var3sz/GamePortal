import * as React from "react";
import { Navbar, Container, Nav, Button, Image, Stack } from "react-bootstrap";
import logo from '../images/logo.png';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext } from "react";

export const AppNavbar: React.FunctionComponent = () => {
    const userContext = useContext(UserContext);
    let navigate = useNavigate();

    const routeChange = () => {
        let path = "/";
        navigate(path);
    }



    return (
        <>
            <Navbar className="navbar bg-dark navbar-expand-lg bg-body-tertiary" id="navbar" collapseOnSelect expand="lg">
                <Container>
                    <Nav.Link as={NavLink} className="navbar-brand" to="/">
                        <Image src={logo} className="d-inline-block align-top me-2" alt="Brand-logo" />
                    </Nav.Link>

                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Container>
                            <Nav className="me-auto mb-2 mb-lg-0 bg-dark">
                                <Nav.Item id="listgroup-item">
                                    <Nav.Link as={NavLink} to="/" id="nav-link">Home</Nav.Link>
                                </Nav.Item>
                                {userContext?.player?.userName !== "admin" ? (
                                    <>
                                        <Nav.Item id="listgroup-item">
                                            <Nav.Link as={NavLink} to="/chess" id="nav-link">Chess</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item id="listgroup-item">
                                            <Nav.Link as={NavLink} to="/connect4" id="nav-link">Connect4</Nav.Link>
                                        </Nav.Item>
                                    </>
                                ) : (
                                    <Nav.Item id="listgroup-item">
                                        <Nav.Link as={NavLink} to="/admin" id="nav-link">Admin</Nav.Link>
                                    </Nav.Item>
                                )}
                            </Nav>
                        </Container>
                        <Nav className="me-auto mb-2 mb-lg-0 bg-dark border-0">
                            {userContext?.player == null ? (
                                <>
                                    <Nav.Item id="listgroup-item">
                                        <Link to="/login">
                                            <Button id="navbar-btn" className="mx-3 mb-lg-0 mb-2"> Login </Button>
                                        </Link>
                                    </Nav.Item>
                                    <Nav.Item id="listgroup-item">
                                        <Link to="/register">
                                            <Button id="navbar-btn" className="mx-3 mb-lg-0 mb-2"> Register </Button>
                                        </Link>
                                    </Nav.Item>
                                </>
                            ) : (
                                <>
                                    <Nav.Item id="listgroup-item">
                                        <Button
                                            id="navbar-btn"
                                            className="mx-3 mb-lg-0 mb-2"
                                            onClick={() => {
                                                userContext.setPlayer(null);
                                                routeChange();
                                            }} >
                                            Logout
                                        </Button>
                                    </Nav.Item>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default AppNavbar;