import React from "react";
import { withRouter } from "react-router-dom";
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Alert
} from "reactstrap";
import * as API_USERS from "./api/user-api";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: null
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleLogin = () => {
        const { username, password } = this.state;

        if (!username || !password) {
            this.setState({ error: "Please enter both username and password." });
            return;
        }

        API_USERS.getUsers((result, status, err) => {
            if (status === 200 && result) {
                const user = result.find(u => u.username === username && u.password === password);
                if (user) {
                    localStorage.setItem("username", user.username);
                    localStorage.setItem("role", user.role);
                    this.props.history.push("/pageProducts");
                } else {
                    this.setState({ error: "Invalid username or password." });
                }
            } else {
                this.setState({ error: "Error connecting to server." });
            }
        });
    };

    handleRedirectToRegister = () => {
        this.props.history.push("/register");
    };

    render() {
        return (
            <Container className="mt-5" style={{ maxWidth: 400 }}>
                <h3 className="mb-4">Login</h3>
                <Form>
                    <FormGroup>
                        <Label for="username">Utilizator</Label>
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Parola</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    {this.state.error && (
                        <Alert color="danger">{this.state.error}</Alert>
                    )}
                    <Button color="primary" onClick={this.handleLogin} className="mb-3" block>
                        Continua
                    </Button>
                </Form>

                {/* Redirect to Register */}
                <div className="text-center">
                    <span>Nu ai un cont? </span>
                    <Button color="link" onClick={this.handleRedirectToRegister}>
                        Creeaza unul aici!
                    </Button>
                </div>
            </Container>
        );
    }
}

export default withRouter(LoginPage);
