import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

interface NavMenuState {
    collapsed: boolean;
}

export class NavMenu extends Component<{}, NavMenuState> {
    static displayName = NavMenu.name;

    constructor(props: {}) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <header>
                <Navbar bg="light" expand="sm" className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3">
                    <Navbar.Brand as={Link} to="/">GamePortal</Navbar.Brand>
                    <Navbar.Toggle onClick={this.toggleNavbar} />
                    <Navbar.Collapse className="justify-content-end" in={!this.state.collapsed}>
                        <Nav className="flex-grow">
                            <Nav.Item>
                                <Nav.Link as={Link} to="/" className="text-dark">
                                    Home
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/counter" className="text-dark">
                                    Counter
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/fetch-data" className="text-dark">
                                    Fetch data
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        );
    }
}

export default NavMenu;