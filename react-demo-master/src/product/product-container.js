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
    Modal,
    ModalHeader,
    ModalBody,
    CardHeader
} from "reactstrap";
import * as API_PRODUCTS from "./api/product-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import ProductForm from "./components/product-form";

const initialProductState = {
    name: "",
    quantity: "",
    price: "",
    inStock: true
};

const ProductContainer = () => {
    const [products, setProducts] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);
    const [productForm, setProductForm] = useState(initialProductState);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        API_PRODUCTS.getProducts((result, status, err) => {
            if (result !== null && status === 200) {
                setProducts(result);
            } else {
                setErrorStatus(status);
                setError(err);
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: name === "inStock" ? value === "true" : value }));
    };

    const handleSubmit = () => {
        if (!productForm.name || productForm.quantity === "" || productForm.price === "") {
            alert("Please complete all fields.");
            return;
        }

        if (isEditing) {
            API_PRODUCTS.updateProduct(productForm, (result, status, err) => {
                if (status === 200) {
                    fetchProducts();
                    resetForm();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        } else {
            API_PRODUCTS.postProduct(productForm, (result, status, err) => {
                if (status === 200 || status === 201) {
                    fetchProducts();
                    resetForm();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    const handleEdit = (product) => {
        setProductForm(product);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (name) => {
        if (window.confirm(`Are you sure you want to delete product: ${name}?`)) {
            API_PRODUCTS.deleteProduct(name, (result, status, err) => {
                if (status === 200 || status === 204) {
                    fetchProducts();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    const resetForm = () => {
        setProductForm(initialProductState);
        setIsEditing(false);
        setShowModal(false);
    };

    return (
        <Container className="mt-5">
            <CardHeader><strong>Editeaza Produse</strong></CardHeader>
            <Card className="p-3">
                <Row className="mb-3">
                    <Col>
                        <Button color="primary" onClick={() => { setShowModal(true); setIsEditing(false); setProductForm(initialProductState); }}>
                            Adauga Produs
                        </Button>
                    </Col>
                </Row>

                <Row>
                    {products.map(product => (
                        <Col md="4" className="mb-4" key={product.id}>
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle tag="h5">{product.name}</CardTitle>
                                    <CardText><strong>Cantitate:</strong> {product.quantity}</CardText>
                                    <CardText><strong>Pret:</strong> {product.price} Lei</CardText>
                                    <CardText><strong>Status:</strong> {product.inStock ? "In Stoc" : "Stoc Epuizat"}</CardText>
                                    <div className="d-flex justify-content-between">
                                        <Button color="warning" size="sm" onClick={() => handleEdit(product)}>Editeaza</Button>
                                        <Button color="danger" size="sm" onClick={() => handleDelete(product.name)}>Sterge</Button>
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
                    {isEditing ? "Actualizeaza Produs" : "Adauga Produs"}
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Nume</Label>
                        <Input name="name" value={productForm.name} onChange={handleInputChange} disabled={isEditing} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="quantity">Cantitate</Label>
                        <Input name="quantity" type="number" value={productForm.quantity} onChange={handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="price">Pret</Label>
                        <Input name="price" type="number" value={productForm.price} onChange={handleInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="inStock">Stoc</Label>
                        <Input type="select" name="inStock" value={productForm.inStock} onChange={handleInputChange}>
                            <option value={true}>In Stoc</option>
                            <option value={false}>Stock Epuizat</option>
                        </Input>
                    </FormGroup>
                    <Button color="success" onClick={handleSubmit}>
                        {isEditing ? "Actualizeaza Produs" : "Salveaza Produs"}
                    </Button>
                </ModalBody>
            </Modal>
        </Container>
    );
};

export default ProductContainer;
