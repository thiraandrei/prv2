import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    FormGroup,
    Label,
    Input,
    Button,
    Alert,
    Badge
} from "reactstrap";
import * as API_USERS from "./user/api/user-api";
import * as API_ORDERS from "./order/api/order-api";

const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loggedInUsername = localStorage.getItem("username");

    useEffect(() => {
        if (loggedInUsername) {
            API_USERS.getUsers((result, status) => {
                if (status === 200 && result) {
                    const foundUser = result.find(u => u.username === loggedInUsername);
                    setUser(foundUser);
                    if (foundUser.email) {
                        API_ORDERS.getOrders((ordersResult, orderStatus) => {
                            if (orderStatus === 200 && ordersResult) {
                                const userOrders = ordersResult.filter(order => order.email === foundUser.email);
                                setOrders(userOrders);
                            }
                        });
                    }
                }
            });
        }
    }, [loggedInUsername]);

    const handlePasswordChange = () => {
        if (!newPassword || newPassword.length < 4) {
            setError("Parola trebuie să aibă cel puțin 4 caractere.");
            return;
        }

        const updatedUser = { ...user, password: newPassword };

        API_USERS.updateUser(user.username, updatedUser, (res, status) => {
            if (status === 200) {
                setSuccess("Parola a fost actualizată cu succes.");
                setNewPassword("");
                setError(null);
            } else {
                setError("Eroare la actualizarea parolei.");
                setSuccess(null);
            }
        });
    };

    const handleAddressChange = () => {
        if (!newAddress || newAddress.length < 5) {
            setError("Adresa trebuie să aibă cel puțin 5 caractere.");
            return;
        }

        const updatedUser = { ...user, physicalAddress: newAddress };

        API_USERS.updateUser(user.username, updatedUser, (res, status) => {
            if (status === 200) {
                setSuccess("Adresa a fost actualizată cu succes.");
                setUser(updatedUser);
                setNewAddress("");
                setError(null);
            } else {
                setError("Eroare la actualizarea adresei.");
                setSuccess(null);
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Placed": return "primary";
            case "Shipped": return "warning";
            case "Delivered": return "success";
            default: return "secondary";
        }
    };

    const translateStatus = (status) => {
        switch (status) {
            case "Placed": return "Plasata";
            case "Shipped": return "Livrata";
            case "Delivered": return "Finalizata";
            default: return status;
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md="5">
                    <Card className="shadow border-0">
                        <CardBody>
                            <CardTitle tag="h4" className="mb-4 text-primary">Profilul Meu</CardTitle>
                            {user && (
                                <>
                                    <CardText><strong>Nume:</strong> {user.firstName} {user.lastName}</CardText>
                                    <CardText><strong>Email:</strong> {user.email}</CardText>
                                    <CardText><strong>Adresa:</strong> {user.physicalAddress}</CardText>

                                    <FormGroup className="mt-4">
                                        <Label for="newPassword">Schimba Parola</Label>
                                        <Input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                    </FormGroup>
                                    <Button color="primary" onClick={handlePasswordChange}>Schimba Parola</Button>

                                    <FormGroup className="mt-4">
                                        <Label for="newAddress">Schimba Adresa</Label>
                                        <Input
                                            type="text"
                                            id="newAddress"
                                            value={newAddress}
                                            onChange={e => setNewAddress(e.target.value)}
                                        />
                                    </FormGroup>
                                    <Button color="primary" onClick={handleAddressChange}>Schimba Adresa</Button>

                                    {error && <Alert color="danger" className="mt-3">{error}</Alert>}
                                    {success && <Alert color="success" className="mt-3">{success}</Alert>}
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Col>

                <Col md="7">
                    <Card className="shadow border-0">
                        <CardBody>
                            <CardTitle tag="h4" className="text-success mb-4">Comenzile Mele</CardTitle>
                            {orders.length === 0 && <CardText>Nu exista comenzi.</CardText>}
                            {orders.map(order => (
                                <Card key={order.id} className="mb-3 p-3 bg-light">
                                    <CardText><strong>Produs:</strong> {order.product}</CardText>
                                    <CardText><strong>Cantitate:</strong> {order.quantity}</CardText>
                                    <CardText><strong>Adresa:</strong> {order.address}</CardText>
                                    <CardText>
                                        <strong>Status:</strong> <Badge color={getStatusColor(order.status)}>{translateStatus(order.status)}</Badge>
                                    </CardText>
                                </Card>
                            ))}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;
