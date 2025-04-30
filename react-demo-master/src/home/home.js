import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from "reactstrap";
import { withRouter } from "react-router-dom";
import * as API_ORDERS from "../order/api/order-api";

const Home = ({ history }) => {
    const [bestSellers, setBestSellers] = useState([]);

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

                const topProducts = sorted.map(([name, quantity]) => ({ name, quantity }));
                setBestSellers(topProducts);
            }
        });
    }, []);

    const handleRedirect = () => {
        history.push("/pageProducts");
    };

    return (
        <Container className="mt-5 text-center">
            <Row>
                <Col>
                    <h1 style={{ fontWeight: "bold", fontSize: "2.5rem" }}>
                        Bine ati venit! 
                    </h1>
                    <p className="lead">
                        Descopera acum produsele noastre!
                    </p>
                    <img
                        src="/images/mockup.jpg"
                        alt="Dental Products"
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            height: "auto",
                            marginTop: "20px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                        }}
                        onError={(e) => e.target.src = "/images/default.jpg"}
                    />
                    <div className="mt-4">
                        <Button
                            onClick={handleRedirect}
                            style={{
                                padding: "12px 30px",
                                fontSize: "1.1rem",
                                background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                                border: "none",
                                borderRadius: "30px",
                                color: "white",
                                boxShadow: "0 4px 15px rgba(0, 114, 255, 0.4)"
                            }}
                        >
                             Produse
                        </Button>
                    </div>
                </Col>
            </Row>

            {bestSellers.length > 0 && (
                <>
                    <h2 className="mt-5 mb-3">🔥 Cele mai bine vandute 🔥</h2>
                    <Row className="justify-content-center">
                        {bestSellers.map((product, idx) => (
                            <Col md="4" key={idx} className="mb-4">
                                <Card className="shadow text-center">
                                    <img
                                        src={`/images/${product.name}.jpg`}
                                        alt={product.name}
                                        className="img-fluid"
                                        style={{ height: "200px", objectFit: "contain" }}
                                        onError={(e) => e.target.src = "/images/default.jpg"}
                                    />
                                    <CardBody>
                                        <CardTitle tag="h5">{product.name}</CardTitle>
                                        <CardText>Cantitate vanduta: <strong>{product.quantity}</strong></CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default withRouter(Home);
