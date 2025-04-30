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
import * as API_DISCOUNTS from "./api/discount-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

const initialDiscountState = {
    name: "",
    percentage: 0
};

const DiscountCodeManagementPage = () => {
    const [discounts, setDiscounts] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);
    const [discountForm, setDiscountForm] = useState(initialDiscountState);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = () => {
        API_DISCOUNTS.getDiscounts((result, status, err) => {
            if (result !== null && status === 200) {
                setDiscounts(result);
            } else {
                setErrorStatus(status);
                setError(err);
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDiscountForm(prev => ({ ...prev, [name]: name === "percentage" ? parseInt(value, 10) : value }));
    };

    const handleSubmit = () => {
        if (isEditing) {
            API_DISCOUNTS.updateDiscount(discountForm.name, discountForm, (result, status, err) => {
                if (status === 200) {
                    fetchDiscounts();
                    resetForm();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        } else {
            API_DISCOUNTS.postDiscount(discountForm, (result, status, err) => {
                if (status === 200 || status === 201) {
                    fetchDiscounts();
                    resetForm();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    const handleEdit = (discount) => {
        setDiscountForm(discount);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (name) => {
        if (window.confirm(`Are you sure you want to delete discount code: ${name}?`)) {
            API_DISCOUNTS.deleteDiscount(name, (result, status, err) => {
                if (status === 200 || status === 204) {
                    fetchDiscounts();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    const resetForm = () => {
        setDiscountForm(initialDiscountState);
        setIsEditing(false);
        setShowModal(false);
    };

    return (
        <Container className="mt-5">
            <CardHeader><strong>Coduri de Reducere </strong></CardHeader>
            <Card className="p-3">
                <Row className="mb-3">
                    <Col>
                        <Button color="primary" onClick={() => { setShowModal(true); setIsEditing(false); setDiscountForm(initialDiscountState); }}>
                            Adauga Cod de Reducere
                        </Button>
                    </Col>
                </Row>

                <Row>
                    {discounts.map(discount => (
                        <Col md="4" className="mb-4" key={discount.id}>
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle tag="h5">{discount.name}</CardTitle>
                                    <CardText><strong>Reducere:</strong> {discount.percentage}%</CardText>
                                    <div className="d-flex justify-content-between">
                                        <Button color="warning" size="sm" onClick={() => handleEdit(discount)}>Editeaza</Button>
                                        <Button color="danger" size="sm" onClick={() => handleDelete(discount.name)}>Sterge</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {errorStatus > 0 && <APIResponseErrorMessage errorStatus={errorStatus} error={error} />}
            </Card>

            <Modal isOpen={showModal} toggle={resetForm}>
                <ModalHeader toggle={resetForm}>{isEditing ? "Actualizeaza Cod de Reducere" : "Adauga un nou Cod de Reducere"}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Nume</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            value={discountForm.name}
                            onChange={handleInputChange}
                            disabled={isEditing} // don't allow changing the name on edit
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="percentage">Procentaj</Label>
                        <Input
                            type="number"
                            name="percentage"
                            id="percentage"
                            value={discountForm.percentage}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <Button color="success" onClick={handleSubmit}>
                        {isEditing ? "Actualizeaza Cod de Reducere" : "Save Discount"}
                    </Button>
                </ModalBody>
            </Modal>
        </Container>
    );
};

export default DiscountCodeManagementPage;
