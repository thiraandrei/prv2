import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Button,
    Input,
    FormGroup,
    Label,
    CardHeader,
    Modal,
    ModalHeader,
    ModalBody
} from "reactstrap";
import * as API_USERS from "./api/user-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

const initialUserState = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    physicalAddress: "",
    password: "",
    role: "CLIENT"
};

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);
    const [userForm, setUserForm] = useState(initialUserState);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        API_USERS.getUsers((result, status, err) => {
            if (result !== null && status === 200) {
                setUsers(result);
            } else {
                setErrorStatus(status);
                setError(err);
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (isEditing) {
            API_USERS.updateUser(userForm.username, userForm, (result, status, err) => {
                if (status === 200) {
                    fetchUsers();
                    resetForm();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        } else {
            API_USERS.postUser(userForm, (result, status, err) => {
                if (status === 200 || status === 201) {
                    fetchUsers();
                    resetForm();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    const handleEdit = (user) => {
        setUserForm({ ...user, password: user.password });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (username) => {
        if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
            API_USERS.deleteUser(username, (result, status, err) => {
                if (status === 200 || status === 204) {
                    fetchUsers();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    const resetForm = () => {
        setUserForm(initialUserState);
        setIsEditing(false);
        setShowModal(false);
    };

    return (
        <Container className="mt-5">
            <CardHeader><strong>User Management</strong></CardHeader>
            <Card className="p-3">
                <Row className="mb-3">
                    <Col>
                        <Button color="primary" onClick={() => { setShowModal(true); setIsEditing(false); setUserForm(initialUserState); }}>
                            Adauga utilizator
                        </Button>
                    </Col>
                </Row>

                <Row>
                    {users.map(user => (
                        <Col md="4" className="mb-4" key={user.id}>
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle tag="h5">{user.username}</CardTitle>
                                    <CardText><strong>Nume:</strong> {user.firstName} {user.lastName}</CardText>
                                    <CardText><strong>Email:</strong> {user.email}</CardText>
                                    <CardText><strong>Rol:</strong> {user.role}</CardText>
                                    <CardText><strong>Adresa:</strong> {user.physicalAddress}</CardText>
                                    <CardText><strong>Parola:</strong> {user.password}</CardText>
                                    <div className="d-flex justify-content-between">
                                        <Button color="warning" size="sm" onClick={() => handleEdit(user)}>Editeaza</Button>
                                        <Button color="danger" size="sm" onClick={() => handleDelete(user.username)}>Sterge</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {errorStatus > 0 && <APIResponseErrorMessage errorStatus={errorStatus} error={error} />}
            </Card>

            <Modal isOpen={showModal} toggle={resetForm}>
                <ModalHeader toggle={resetForm}>
                    {isEditing ? "Update User" : "Add New User"}
                </ModalHeader>
                <ModalBody>
                    {Object.keys(userForm).map(field => (
                        field !== "role" && (
                            <FormGroup key={field}>
                                <Label for={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                                <Input
                                    type={field === "password" ? "password" : "text"}
                                    name={field}
                                    id={field}
                                    value={userForm[field]}
                                    onChange={handleInputChange}
                                    disabled={field === "username" && isEditing}
                                />
                            </FormGroup>
                        )
                    ))}
                    <FormGroup>
                        <Label for="role">Rol</Label>
                        <Input type="select" name="role" value={userForm.role} onChange={handleInputChange}>
                            <option value="CLIENT">CLIENT</option>
                            <option value="ADMIN">ADMIN</option>
                        </Input>
                    </FormGroup>
                    <Button color="success" onClick={handleSubmit}>
                        {isEditing ? "Update User" : "Save User"}
                    </Button>
                </ModalBody>
            </Modal>
        </Container>
    );
};

export default UserManagementPage;