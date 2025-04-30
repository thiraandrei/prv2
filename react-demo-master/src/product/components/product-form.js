import React from 'react';
import validate from "./validators/product-validators"; // Așigurați-vă că aveți validatorii necesari implementați
import Button from "react-bootstrap/Button";
import * as API_PRODUCTS from "../api/product-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";
import { Col, Row, FormGroup, Input, Label, FormFeedback } from 'reactstrap';

class ProductForm extends React.Component {
    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                name: {
                    value: '',
                    placeholder: 'What is the product name?...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                quantity: {
                    value: '',
                    placeholder: 'Quantity...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        isNumber: true
                    }
                },
                price: {
                    value: '',
                    placeholder: 'Price...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true,
                        isNumber: true
                    }
                },
                inStock: {
                    value: '',
                    placeholder: 'In stock...',
                    valid: false,
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

    registerProduct(product) {
        return API_PRODUCTS.postProduct(product, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted product with id: " + result);
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
        let product = {
            name: this.state.formControls.name.value,
            quantity: parseInt(this.state.formControls.quantity.value, 10),
            price: parseFloat(this.state.formControls.price.value),
            inStock: this.state.formControls.inStock.value === "true"
        };

        console.log(product);
        this.registerProduct(product);
    }

    render() {
        return (
            <div>
                <FormGroup>
                    <Label for="name">Name:</Label>
                    <Input type="text" name="name" id="name" value={this.state.formControls.name.value}
                        onChange={this.handleChange} valid={this.state.formControls.name.valid}
                        invalid={!this.state.formControls.name.valid && this.state.formControls.name.touched}/>
                    <FormFeedback>Name must be at least 3 characters long</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="quantity">Quantity:</Label>
                    <Input type="number" name="quantity" id="quantity" value={this.state.formControls.quantity.value}
                        onChange={this.handleChange} valid={this.state.formControls.quantity.valid}
                        invalid={!this.state.formControls.quantity.valid && this.state.formControls.quantity.touched}/>
                    <FormFeedback>Quantity is required and must be a number</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="price">Price:</Label>
                    <Input type="number" name="price" id="price" value={this.state.formControls.price.value}
                        onChange={this.handleChange} valid={this.state.formControls.price.valid}
                        invalid={!this.state.formControls.price.valid && this.state.formControls.price.touched}/>
                    <FormFeedback>Price is required and must be a number</FormFeedback>
                </FormGroup>

                <FormGroup>
                    <Label for="inStock">In Stock:</Label>
                    <Input type="select" name="inStock" id="inStock" value={this.state.formControls.inStock.value}
                        onChange={this.handleChange} valid={this.state.formControls.inStock.valid}
                        invalid={!this.state.formControls.inStock.valid && this.state.formControls.inStock.touched}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </Input>
                    <FormFeedback>Stock status is required</FormFeedback>
                </FormGroup>

                <Button color="primary" onClick={this.handleSubmit} disabled={!this.state.formIsValid}>Submit</Button>

                {this.state.errorStatus > 0 && <APIResponseErrorMessage errorStatus={this.state.errorStatus} error={this.state.error}/>}
            </div>
        );
    }
}

export default ProductForm;
