import React from 'react';
import validate from "./validators/order-validators"; // Ensure you implement the necessary validators
import Button from "react-bootstrap/Button";
import * as API_ORDERS from "../api/order-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row, FormGroup, Input, Label, FormFeedback } from 'reactstrap';

class OrderForm extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                firstName: {
                    value: '',
                    placeholder: 'Enter First Name...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 2,
                        isRequired: true
                    }
                },
                lastName: {
                    value: '',
                    placeholder: 'Enter Last Name...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 2,
                        isRequired: true
                    }
                },
                email: {
                    value: '',
                    placeholder: 'Enter Email...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        emailValidator: true
                    }
                },
                address: {
                    value: '',
                    placeholder: 'Enter Address...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                productName: {
                    value: '',
                    placeholder: 'Enter Product Name...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
                quantity: {
                    value: '',
                    placeholder: 'Enter Quantity...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        isNumber: true
                    }
                },
                status: {
                    value: 'Placed',
                    placeholder: 'Select Order Status...',
                    valid: true,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleForm() {
        this.setState({ collapseForm: !this.state.collapseForm });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;
        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });
    };

    registerOrder(order) {
        return API_ORDERS.postOrder(order, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully placed order with id: " + result);
                this.reloadHandler();
            } else {
                this.setState({
                    errorStatus: status,
                    error: error
                });
            }
        });
    }

    handleSubmit() {
        let order = {
            firstName: this.state.formControls.firstName.value,
            lastName: this.state.formControls.lastName.value,
            email: this.state.formControls.email.value,
            address: this.state.formControls.address.value,
            productName: this.state.formControls.productName.value,
            quantity: parseInt(this.state.formControls.quantity.value, 10),
            status: this.state.formControls.status.value
        };

        console.log(order);
        this.registerOrder(order);
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="firstName">Prenume:</Label>
                    <Input type="text" name="firstName" id="firstName" value={this.state.formControls.firstName.value}
                        onChange={this.handleChange} valid={this.state.formControls.firstName.valid}
                        invalid={!this.state.formControls.firstName.valid && this.state.formControls.firstName.touched}/>
                    <FormFeedback>First name must be at least 2 characters long</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="lastName">Nume:</Label>
                    <Input type="text" name="lastName" id="lastName" value={this.state.formControls.lastName.value}
                        onChange={this.handleChange} valid={this.state.formControls.lastName.valid}
                        invalid={!this.state.formControls.lastName.valid && this.state.formControls.lastName.touched}/>
                    <FormFeedback>Last name must be at least 2 characters long</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="email">Email:</Label>
                    <Input type="email" name="email" id="email" value={this.state.formControls.email.value}
                        onChange={this.handleChange} valid={this.state.formControls.email.valid}
                        invalid={!this.state.formControls.email.valid && this.state.formControls.email.touched}/>
                    <FormFeedback>Valid email is required</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="address">Adresa:</Label>
                    <Input type="text" name="address" id="address" value={this.state.formControls.address.value}
                        onChange={this.handleChange} valid={this.state.formControls.address.valid}
                        invalid={!this.state.formControls.address.valid && this.state.formControls.address.touched}/>
                    <FormFeedback>Address must be at least 5 characters long</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="productName">Numele Produsului:</Label>
                    <Input type="text" name="productName" id="productName" value={this.state.formControls.productName.value}
                        onChange={this.handleChange} valid={this.state.formControls.productName.valid}
                        invalid={!this.state.formControls.productName.valid && this.state.formControls.productName.touched}/>
                    <FormFeedback>Product name is required</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="quantity">Cantitate:</Label>
                    <Input type="number" name="quantity" id="quantity" value={this.state.formControls.quantity.value}
                        onChange={this.handleChange} valid={this.state.formControls.quantity.valid}
                        invalid={!this.state.formControls.quantity.valid && this.state.formControls.quantity.touched}/>
                    <FormFeedback>Cantitatea trebuie sa fie un numar</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="status">Statusul Comenzii:</Label>
                    <Input type="select" name="status" id="status" value={this.state.formControls.status.value}
                        onChange={this.handleChange} valid={this.state.formControls.status.valid}>
                        <option value="Placed">Plasata</option>
                        <option value="Shipped">Livrata</option>
                        <option value="Delivered">Finalizata</option>
                    </Input>
                </FormGroup>

                <Button color="primary" onClick={this.handleSubmit} disabled={!this.state.formIsValid}>Submit Order</Button>

                {this.state.errorStatus > 0 && <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>}
            </div>
        );
    }
}

export default OrderForm;
