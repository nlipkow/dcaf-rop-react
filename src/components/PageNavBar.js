import React from 'react';
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBCollapse,
    MDBNavItem,
    MDBNavLink,
    MDBContainer,
} from 'mdbreact';
import Button from "react-bootstrap/Button";

class PageNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    render() {
        return (
            <MDBNavbar color="dark-blue" fixed="top" dark expand="md">
                <MDBContainer>
                    <MDBNavbarBrand href="/">
                        <strong>SAM</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.onClick} />
                    <MDBCollapse isOpen={this.state.collapse} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem  active={this.props.active === "Home"}>
                                <MDBNavLink to="/">Home</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem active={this.props.active === "CAMs"}>
                                <MDBNavLink to="/cams">CAMs</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem active={this.props.active === "Server"}>
                                <MDBNavLink to="/server">Server</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem active={this.props.active === "Rules"}>
                                <MDBNavLink to="/rules">Access Rules</MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem active={this.props.active === "Tickets"}>
                                <MDBNavLink to="tickets">Tickets</MDBNavLink>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                                <Button href="/login" >Logout</Button>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        );
    }
}

export default PageNavBar;