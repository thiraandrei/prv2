import React, { useState, useEffect } from "react";
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
    Alert
} from "reactstrap";
import * as API_ORDERS from "../order/api/order-api";
import * as API_DISCOUNTS from "../discountcodes/api/discount-api";

const CartPage = ({ cart, onRemoveFromCart, onPlaceOrder }) => {
    const [orderDetails, setOrderDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "cash",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });

    const [orderSuccess, setOrderSuccess] = useState(false);
    const [discountCode, setDiscountCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountError, setDiscountError] = useState(null);

    const calculateTotalPrice = (product, quantity) => {
        return (product.price * quantity).toFixed(2);
    };

    const calculateGrandTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const discounted = total * (1 - discountPercent / 100);
        return discounted.toFixed(2);
    };

    const handleChange = (event) => {
        setOrderDetails({ ...orderDetails, [event.target.name]: event.target.value });
    };

    const handleDiscountCheck = () => {
        if (!discountCode.trim()) return;

        API_DISCOUNTS.getDiscounts((result, status) => {
            if (status === 200 && result) {
                const found = result.find(code => code.name.toLowerCase() === discountCode.toLowerCase());
                if (found) {
                    setDiscountPercent(found.percentage);
                    setDiscountError(null);
                } else {
                    setDiscountPercent(0);
                    setDiscountError("Invalid discount code.");
                }
            }
        });
    };

    const handlePlaceOrder = () => {
        if (!orderDetails.firstName || !orderDetails.lastName || !orderDetails.email || !orderDetails.address || !orderDetails.city || !orderDetails.postalCode) {
            alert("Please fill in all order details!");
            return;
        }

        if (orderDetails.paymentMethod === "card" && (!orderDetails.cardNumber || !orderDetails.expiryDate || !orderDetails.cvv)) {
            alert("Please fill in all credit card details.");
            return;
        }

        cart.forEach(item => {
            const order = {
                firstName: orderDetails.firstName,
                lastName: orderDetails.lastName,
                email: orderDetails.email,
                address: `${orderDetails.address}, ${orderDetails.city}, ${orderDetails.postalCode}`,
                productName: item.product.name,
                quantity: item.quantity,
                status: "Placed"
            };

            API_ORDERS.postOrder(order, (result, status, error) => {
                if (status === 200 || status === 201) {
                    console.log(`Order placed successfully for ${item.product.name}`);
                }
            });
        });

        setOrderSuccess(true);
        onPlaceOrder();
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Cosul de Cumparaturi</h2>

            {orderSuccess && (
                <Alert color="success" className="text-center">
                    <h4 className="alert-heading">🎉 Multumim pentru comanda dumneavoastra!</h4>
                    <p>Comanda a fost plasata cu succes.</p>
                    <hr />
                    <p className="mb-0"> <strong>{orderDetails.email}</strong>.</p>
                </Alert>
            )}

            {!orderSuccess && cart.length === 0 && (
                <h4 className="text-center">Cosul de cumparaturi este gol.</h4>
            )}

            {!orderSuccess && cart.length > 0 && (
                <>
                    <Row><Col sm="12"><h4>Vizualizeaza Produsele Tale</h4></Col></Row>
                    <Row className="mb-4">
                        <Col sm="12">
                            <Card><CardBody>
                                {cart.map((item, index) => (
                                    <Row key={index} className="align-items-center mb-3">
                                        <Col sm="2">
                                            <img 
                                                src={`/images/${item.product.name}.jpg`} 
                                                alt={item.product.name} 
                                                className="img-fluid rounded" 
                                                onError={(e) => e.target.src = "/images/default.jpg"} 
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                        </Col>
                                        <Col sm="5">
                                            <CardTitle tag="h5">{item.product.name}</CardTitle>
                                            <CardText>Cantitate: {item.quantity}</CardText>
                                            <CardText>Pret Unitar: {item.product.price.toFixed(2)} Lei</CardText>
                                        </Col>
                                        <Col sm="3">
                                            <CardText><strong>Total: {calculateTotalPrice(item.product, item.quantity)} Lei</strong></CardText>
                                        </Col>
                                        <Col sm="2" className="text-right">
                                            <Button color="danger" onClick={() => onRemoveFromCart(item.product.name)}>Sterge</Button>
                                        </Col>
                                    </Row>
                                ))}
                            </CardBody></Card>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm="4">
                            <Input
                                placeholder="Introdu Codul de Reducere"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                        </Col>
                        <Col sm="2">
                            <Button color="info" onClick={handleDiscountCheck}>Aplica</Button>
                        </Col>
                        <Col sm="6" className="text-right">
                            <h4><strong>Total cos: {calculateGrandTotal()} Lei</strong></h4>
                            {discountPercent > 0 && <small className="text-success">Discount aplicat: {discountPercent}%</small>}
                            {discountError && <small className="text-danger">{discountError}</small>}
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="6">
                            <h4>Datele Tale</h4>
                            <FormGroup><Label>Prenume</Label><Input type="text" name="firstName" value={orderDetails.firstName} onChange={handleChange} required /></FormGroup>
                            <FormGroup><Label>Nume</Label><Input type="text" name="lastName" value={orderDetails.lastName} onChange={handleChange} required /></FormGroup>
                            <FormGroup><Label>Email</Label><Input type="email" name="email" value={orderDetails.email} onChange={handleChange} required /></FormGroup>
                            <FormGroup><Label>Strada</Label><Input type="text" name="address" value={orderDetails.address} onChange={handleChange} required /></FormGroup>
                            <FormGroup><Label>Orasul</Label><Input type="text" name="city" value={orderDetails.city} onChange={handleChange} required /></FormGroup>
                            <FormGroup><Label>Cod Postal</Label><Input type="text" name="postalCode" value={orderDetails.postalCode} onChange={handleChange} required /></FormGroup>
                        </Col>

                        <Col sm="6">
                            <h4>Selecteaza Metoda de Plata</h4>
                            <FormGroup>
                                <Label>
                                    <Input type="radio" name="paymentMethod" value="cash" checked={orderDetails.paymentMethod === "cash"} onChange={handleChange} /> Plata Ramburs
                                </Label>
                            </FormGroup>
                            <FormGroup>
                                <Label>
                                    <Input type="radio" name="paymentMethod" value="card" checked={orderDetails.paymentMethod === "card"} onChange={handleChange} /> Plata cu Cardul
                                </Label>
                            </FormGroup>
                            {orderDetails.paymentMethod === "card" && (
                                <>
                                    <FormGroup><Label>Numar Card</Label><Input type="text" name="cardNumber" value={orderDetails.cardNumber} onChange={handleChange} required /></FormGroup>
                                    <FormGroup><Label>Data Expirarii</Label><Input type="text" name="expiryDate" placeholder="MM/YY" value={orderDetails.expiryDate} onChange={handleChange} required /></FormGroup>
                                    <FormGroup><Label>CVV</Label><Input type="text" name="cvv" value={orderDetails.cvv} onChange={handleChange} required /></FormGroup>
                                </>
                            )}
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col sm="12" className="text-center">
                            <Button color="success" onClick={handlePlaceOrder}>Plaseaza Comanda</Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default CartPage;
