import React, { useEffect, useState } from "react";
import {
    Container,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    CardText,
    Button,
    Row,
    Col
} from "reactstrap";
import * as API_MESSAGES from "./api/message-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

const AdminMessageViewer = () => {
    const [messages, setMessages] = useState([]);
    const [errorStatus, setErrorStatus] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = () => {
        API_MESSAGES.getMessages((result, status, err) => {
            if (result !== null && status === 200) {
                setMessages(result);
            } else {
                setErrorStatus(status);
                setError(err);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            API_MESSAGES.deleteMessage(id, (result, status, err) => {
                if (status === 200 || status === 204) {
                    fetchMessages();
                } else {
                    setErrorStatus(status);
                    setError(err);
                }
            });
        }
    };

    return (
        <Container className="mt-5">
            <CardHeader><strong>Mesajele Utilizatorilor</strong></CardHeader>
            <Card className="p-3">
                <Row>
                    {messages.map((msg) => (
                        <Col md="6" key={msg.id} className="mb-4">
                            <Card className="shadow-sm">
                                <CardBody>
                                    <CardTitle tag="h5">{msg.subject}</CardTitle>
                                    <CardText><strong>Utilizator:</strong> {msg.name}</CardText>
                                    <CardText><strong>Email:</strong> {msg.email}</CardText>
                                    <CardText><strong>Mesaj:</strong> {msg.content}</CardText>
                                    <Button color="danger" size="sm" onClick={() => handleDelete(msg.id)}>Sterge Mesajul</Button>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
                {errorStatus > 0 && <APIResponseErrorMessage errorStatus={errorStatus} error={error} />}
            </Card>
        </Container>
    );
};

export default AdminMessageViewer;