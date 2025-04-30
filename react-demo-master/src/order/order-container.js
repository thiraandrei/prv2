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
import * as API_ORDERS from "./api/order-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import OrderForm from "./components/order-form";

const OrderContainer = () => {
    const [orders, setOrders] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        API_ORDERS.getOrders((result, status, err) => {
            if (result !== null && status === 200) {
                setOrders(result);
            } else {
                setErrorStatus(status);
                setError(err);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            API_ORDERS.deleteOrder(id, (result, status, err) => {
                if (status === 200 || status === 204) {
                    fetchOrders();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    const handleStatusChange = (id, newStatus) => {
        API_ORDERS.getOrderById(id, (result, status) => {
            if (status === 200 && result) {
                const updatedOrder = { ...result, status: newStatus };
                API_ORDERS.updateOrder(updatedOrder, (res, updateStatus, updateErr) => {
                    if (updateStatus === 200) {
                        fetchOrders();
                    } else {
                        setErrorStatus(updateStatus);
                        setError(updateErr);
                    }
                });
            }
        });
    };

    return (
        <Container className="mt-5">
            <CardHeader><strong>Editeaza Comenzi</strong></CardHeader>
            <Card className="p-3">
                <Row className="mb-3">
                    <Col>
                        <Button color="primary" onClick={() => setShowModal(true)}>Adauga Comanda</Button>
                    </Col>
                </Row>

                <Row>
                    {orders.map(order => (
                        <Col md="4" className="mb-4" key={order.id}>
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle tag="h5">{order.firstName} {order.lastName}</CardTitle>
                                    <CardText><strong>Email:</strong> {order.email}</CardText>
                                    <CardText><strong>Adresa:</strong> {order.address}</CardText>
                                    <CardText><strong>Produs:</strong> {order.product}</CardText>
                                    <CardText><strong>Cantitate:</strong> {order.quantity}</CardText>
                                    <CardText><strong>Status:</strong> {order.status}</CardText>

                                    <FormGroup>
                                        <Label>Actualizeaza Status</Label>
                                        <Input type="select" value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)}>
                                            <option value="">Select status</option>
                                            <option value="Placed">Plasata</option>
                                            <option value="Shipped">Livrata</option>
                                            <option value="Delivered">Finalizata</option>
                                        </Input>
                                        <Button
                                            color="warning"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => handleStatusChange(order.id, statusUpdate)}
                                            disabled={!statusUpdate}
                                        >
                                            Actualizeaza
                                        </Button>
                                    </FormGroup>

                                    <div className="d-flex justify-content-between">
                                        <Button color="danger" size="sm" onClick={() => handleDelete(order.id)}>Sterge</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {errorStatus > 0 && <APIResponseErrorMessage errorStatus={errorStatus} error={error} />}
            </Card>

            <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
                <ModalHeader toggle={() => setShowModal(false)}>Adauga Comanda Noua</ModalHeader>
                <ModalBody>
                    <OrderForm reloadHandler={() => {
                        fetchOrders();
                        setShowModal(false);
                    }} />
                </ModalBody>
            </Modal>
        </Container>
    );
};

export default OrderContainer;
