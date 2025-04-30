import React from "react";
import { withRouter } from "react-router-dom";
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Alert,
    Card,
    CardBody,
    CardTitle
} from "reactstrap";
import * as API_USERS from "../user/api/user-api";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            physicalAddress: "",
            error: null
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleRegister = () => {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            physicalAddress
        } = this.state;

        if (!username || !email || !password || !firstName || !lastName || !physicalAddress) {
            this.setState({ error: "All fields are required." });
            return;
        }

        // Verificare duplicat username
        API_USERS.getUsers((result, status, err) => {
            if (status === 200 && result) {
                const existingUser = result.find(u => u.username === username);
                if (existingUser) {
                    this.setState({ error: "Username already exists. Please choose another one." });
                } else {
                    const user = {
                        username,
                        email,
                        password,
                        firstName,
                        lastName,
                        physicalAddress,
                        role: "CLIENT"
                    };

                    API_USERS.postUser(user, (res, stat, error) => {
                        if (stat === 200 || stat === 201) {
                            alert("Account created successfully.");
                            this.props.history.push("/login");
                        } else {
                            this.setState({ error: "Failed to create account." });
                        }
                    });
                }
            } else {
                this.setState({ error: "Unable to validate user uniqueness." });
            }
        });
    };

    render() {
        return (
            <Container className="mt-5 d-flex justify-content-center">
                <Card style={{ width: "100%", maxWidth: 500 }}>
                    <CardBody>
                        <CardTitle tag="h3" className="text-center mb-4">Creeaza un Cont Nou</CardTitle>
                        <Form>
                            <FormGroup>
                                <Label>Nume Utilizator</Label>
                                <Input name="username" onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input type="email" name="email" onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Parola</Label>
                                <Input type="password" name="password" onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Prenume</Label>
                                <Input name="firstName" onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Nume</Label>
                                <Input name="lastName" onChange={this.handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Adresa</Label>
                                <Input name="physicalAddress" onChange={this.handleChange} />
                            </FormGroup>

                            {this.state.error && (
                                <Alert color="danger">{this.state.error}</Alert>
                            )}

                            <Button color="success" block onClick={this.handleRegister}>
                                Creeaza
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <span>Ai deja un cont? </span>
                            <Button
                                color="link"
                                onClick={() => this.props.history.push("/login")}
                                style={{ padding: 0 }}
                            >
                                Autentifica-te aici!
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

export default withRouter(RegisterPage);
