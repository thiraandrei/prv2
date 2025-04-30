import React, { useState } from "react";
import {
    Container, Card, CardHeader, CardBody,
    Form, FormGroup, Label, Input, Button, Alert
} from "reactstrap";
import * as API_MESSAGES from "./api/message-api";

const MessagePage = () => {
    const [message, setMessage] = useState({
        name: "",
        email: "",
        subject: "",
        content: ""
    });

    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        API_MESSAGES.postMessage(message, (result, code, error) => {
            if (code === 200 || code === 201) {
                setStatus("success");
                setMessage({ name: "", email: "", subject: "", content: "" });
            } else {
                setStatus("error");
            }
        });
    };

    return (
        <Container className="mt-5">
            <Card>
                <CardHeader><h4>Contact</h4></CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="name">Nume</Label>
                            <Input type="text" name="name" id="name" value={message.name} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" id="email" value={message.email} onChange={handleChange} required />
                        </FormGroup>
                        {/* <FormGroup>
                            <Label for="subject">Subject</Label>
                            <Input type="text" name="subject" id="subject" value={message.subject} onChange={handleChange} required />
                        </FormGroup> */}
                        <FormGroup>
                            <Label for="content">Mesaj</Label>
                            <Input type="textarea" name="content" id="content" rows="5" value={message.content} onChange={handleChange} required />
                        </FormGroup>
                        <Button type="submit" color="primary">Trimite Mesajul</Button>
                    </Form>
                    {status === "success" && <Alert color="success" className="mt-3">Mesaj trimis cu succes!</Alert>}
                    {status === "error" && <Alert color="danger" className="mt-3">Ceva nu a mers bine.</Alert>}
                </CardBody>
            </Card>
        </Container>
    );
};

export default MessagePage;
