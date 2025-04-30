import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import * as API_PRODUCTS from "./api/product-api";

const ProductsPage = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        API_PRODUCTS.getProducts((result, status, err) => {
            if (result !== null && status === 200) {
                setProducts(result);
            }
        });
    }, []);

    const handleQuantityChange = (event, product) => {
        const value = event.target.value;
        const quantity = parseInt(value, 10);

        if (isNaN(quantity) || quantity < 1) {
            setQuantities({ ...quantities, [product.name]: "" });
            return;
        }

        if (quantity > product.quantity) {
            alert(`You cannot add more than ${product.quantity} items.`);
            setQuantities({ ...quantities, [product.name]: product.quantity });
            return;
        }

        setQuantities({ ...quantities, [product.name]: quantity });
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.name];

        if (!quantity || quantity <= 0 || quantity > product.quantity) {
            alert("Please enter a valid quantity.");
            return;
        }

        onAddToCart(product, quantity);
        alert(`${quantity} of ${product.name} added to cart!`);
        setQuantities({ ...quantities, [product.name]: "" }); // Reset input field
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>Toate Produsele</h2>
            <Row className="justify-content-center">
                {products.map(product => {
                    const isOutOfStock = product.quantity === 0;

                    return (
                        <Col sm="6" md="4" lg="3" key={product.id} className="mb-4">
                            <Card className="shadow-sm border-0 rounded text-center p-3">
                                <div className="d-flex justify-content-center">
                                    <img 
                                        src={`/images/${product.name}.jpg`} 
                                        alt={product.name} 
                                        className="rounded" 
                                        onError={(e) => e.target.src = "/images/default.jpg"} 
                                        style={{ width: "100%", height: "200px", objectFit: "contain" }}
                                    />
                                </div>
                                <CardBody>
                                    <CardTitle tag="h5" className="font-weight-bold">{product.name}</CardTitle>
                                    <CardText className="text-muted">Disponibile: {product.quantity}</CardText>
                                    <CardText className="text-muted">Pret: {product.price} Lei</CardText>
                                    <CardText>
                                        <strong>Stoc:</strong>{" "}
                                        {isOutOfStock ? (
                                            <span style={{ color: "red", fontWeight: "bold" }}>Stoc Epuizat</span>
                                        ) : (
                                            <span style={{ color: "green", fontWeight: "bold" }}>Disponibile</span>
                                        )}
                                    </CardText>

                                    {!isOutOfStock && (
                                        <>
                                            <Input
                                                type="number"
                                                min="1"
                                                max={product.quantity}
                                                placeholder={`Max: ${product.quantity}`}
                                                className="text-center"
                                                value={quantities[product.name] || ""}
                                                onChange={(e) => handleQuantityChange(e, product)}
                                            />
                                            <Button 
                                                color="primary" 
                                                className="mt-3 w-100"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!quantities[product.name] || quantities[product.name] <= 0}
                                            >
                                                Adauga in Cos
                                            </Button>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

export default ProductsPage;
