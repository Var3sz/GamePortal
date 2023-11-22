import * as React from "react";
import { Navbar, Container, Nav, Button, Image, Stack } from "react-bootstrap";
import logo from '../images/logo.png';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { initialAuth } from "../auth/AuthProvider";
import useAuth from "../auth/useAuth";
import "../css-files/navbar.css"

export const AppNavbar: React.FunctionComponent = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        setAuth(initialAuth);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("roles");
        localStorage.removeItem("refreshToken");
        navigate('/login');
    };

    return (
        <>
            <Navbar className="navbar bg-dark navbar-expand-lg bg-body-tertiary" id="navbar" collapseOnSelect expand="lg">
                <Container>
                    <Nav.Link as={NavLink} className="navbar-brand" to="/home">
                        <Image src={logo} className="d-inline-block align-top me-2" alt="Brand-logo" />
                    </Nav.Link>

                    <Navbar.Toggle aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Container className="mr-5">
                            <Nav className="me-auto mb-2 mb-lg-0 bg-dark">
                                <Nav.Item id="listgroup-item">
                                    <Nav.Link as={NavLink} to="/home" id="nav-link">Home</Nav.Link>
                                </Nav.Item>
                                {auth?.roles.includes(1) ? (
                                    <Nav.Item id="listgroup-item">
                                        <Nav.Link as={NavLink} to="/admin" id="nav-link">Admin</Nav.Link>
                                    </Nav.Item>
                                ) : (
                                    <>
                                        <Nav.Item id="listgroup-item">
                                            <Nav.Link as={NavLink} to="/chess" id="nav-link">Chess</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item id="listgroup-item">
                                            <Nav.Link as={NavLink} to="/connect4" id="nav-link">Connect4</Nav.Link>
                                        </Nav.Item>
                                    </>
                                )}
                            </Nav>
                        </Container>
                        <Container className="ml-5">
                            <Nav className="me-auto mb-2 mb-lg-0 bg-dark border-0">
                                {auth?.token ? (
                                    <Button id="navbar-btn" className="mx-3 mb-lg-0 mb-2" onClick={logout}> Logout </Button>
                                ) : (
                                    <Stack direction="horizontal">
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
                                    </Stack>
                                )}
                            </Nav>
                        </Container>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default AppNavbar;