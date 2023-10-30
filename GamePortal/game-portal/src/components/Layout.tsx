import React, { Component, ReactNode } from 'react';
import { Container } from 'react-bootstrap';
import { NavMenu } from './NavMenu';

interface LayoutProps {
    children: ReactNode;
}

export class Layout extends Component<LayoutProps> {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <NavMenu />
                <Container as="main">
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
