import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import * as API_ORDERS from "../order/api/order-api";
import * as API_PRODUCTS from "../product/api/product-api";

const BestSellersPage = ({ onAddToCart }) => {
    //const [bestSellers, setBestSellers] = useState([]);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        API_ORDERS.getOrders((ordersResult, ordersStatus) => {
            if (ordersStatus === 200 && ordersResult) {
                const soldMap = {};

                ordersResult.forEach(order => {
                    if (soldMap[order.product]) {
                        soldMap[order.product] += order.quantity;
                    } else {
                        soldMap[order.product] = order.quantity;
                    }
                });

                const sorted = Object.entries(soldMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3);

                const topProductNames = sorted.map(([name]) => name);

                API_PRODUCTS.getProducts((productsResult, productsStatus) => {
                    if (productsStatus === 200 && productsResult) {
                        const matchedProducts = productsResult.filter(p => topProductNames.includes(p.name));
                        const enrichedProducts = matchedProducts.map(p => ({
                            ...p,
                            soldQuantity: soldMap[p.name]
                        }));
                        setProducts(enrichedProducts);
                    }
                });
            }
        });
    }, []);

    const handleQuantityChange = (event, product) => {
        const value = parseInt(event.target.value, 10);
        setQuantities({ ...quantities, [product.name]: isNaN(value) ? "" : Math.min(value, product.quantity) });
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.name];
        if (!quantity || quantity <= 0) return alert("Invalid quantity");
        onAddToCart(product, quantity);
        alert(`${quantity} of ${product.name} added to cart!`);
        setQuantities({ ...quantities, [product.name]: "" });
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">🔥 Cele mai bine vandute 🔥</h2>
            <Row className="justify-content-center">
                {products.map((product, idx) => (
                    <Col md="4" key={idx} className="mb-4">
                        <Card className="text-center shadow">
                            <img
                                src={`/images/${product.name}.jpg`}
                                alt={product.name}
                                className="img-fluid"
                                onError={(e) => e.target.src = "/images/default.jpg"}
                                style={{ height: "200px", objectFit: "contain" }}
                            />
                            <CardBody>
                                <CardTitle tag="h5">{product.name}</CardTitle>
                                <CardText>Vandute: <strong>{product.soldQuantity}</strong></CardText>
                                <CardText>Disponibile: {product.quantity}</CardText>
                                <CardText className="text-muted">Pret: {product.price} Lei</CardText>
                                <CardText>
                                    <strong>Stoc:</strong> {product.quantity > 0 ? (
                                        <span style={{ color: "green", fontWeight: "bold" }}>Disponibil</span>
                                    ) : (
                                        <span style={{ color: "red", fontWeight: "bold" }}>Stoc Epuizat</span>
                                    )}
                                </CardText>
                                {product.quantity > 0 && (
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
                ))}
            </Row>
        </Container>
    );
};

export default BestSellersPage;
