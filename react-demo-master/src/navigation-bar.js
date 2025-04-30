import React, { useEffect, useState } from 'react';
import logo from './commons/images/tooth.png';
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown,
    Button,
    NavbarToggler,
    Collapse
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import * as API_USERS from './user/api/user-api';

const textStyle = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '1rem'
};

const NavigationBar = ({ history }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem("username");

        if (username) {
            setIsLoggedIn(true);

            API_USERS.getUsers((result, status) => {
                if (status === 200 && result) {
                    const user = result.find(u => u.username === username);
                    if (user && user.role === "ADMIN") {
                        setIsAdmin(true);
                    }
                }
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setIsAdmin(false);
        history.push("/login");
    };

    const handleLoginRedirect = () => {
        history.push("/login");
    };

    const toggle = () => setIsOpen(!isOpen);

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/">
                <img src={logo} width={"50"} height={"35"} alt="Logo" />
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar className="w-100">
                {/* LEFT SIDE LINKS */}
                <Nav className="mr-auto" navbar>
                    <NavLink href="/pageProducts" style={textStyle}>Toate Produsele</NavLink>
                    
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret className="text-white">
                            Categorii
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem href="/pasta">Pasta</DropdownItem>
                            <DropdownItem href="/periuta">Periuta</DropdownItem>
                            <DropdownItem href="/apa">Apa</DropdownItem>
                            <DropdownItem href="/other">Alte Produse</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>

                    <NavLink href="/bestseller" style={textStyle}>Cele mai bine vandute</NavLink>
                    <NavLink href="/send-message" style={textStyle}>Contact Us</NavLink>
                </Nav>

                {/* RIGHT SIDE USER ACTIONS */}
                <Nav className="ml-auto d-flex align-items-center" navbar>
                    {isAdmin && (
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret className="text-white">
                                Meniu Admin
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="/users">Manage Users</DropdownItem>
                                <DropdownItem href="/discounts">Manage Discounts</DropdownItem>
                                <DropdownItem href="/orders">Manage Orders</DropdownItem>
                                <DropdownItem href="/products">Manage Products</DropdownItem>
                                <DropdownItem href="/view-message">Vizualizeaza Mesajele</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    )}

                    <NavLink href="/cart" style={textStyle}>🛒 Cos</NavLink>

                    {isLoggedIn && (
                        <NavLink href="/profile" style={textStyle}>👤 Profil</NavLink>
                    )}

                    {!isLoggedIn ? (
                        <Button color="success" size="sm" onClick={handleLoginRedirect} className="ml-2">
                            Intra in cont
                        </Button>
                    ) : (
                        <Button color="danger" size="sm" onClick={handleLogout} className="ml-2">
                            Iesi din cont
                        </Button>
                    )}
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default withRouter(NavigationBar);
