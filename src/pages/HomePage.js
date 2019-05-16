import React, { Component } from 'react';
import '../App.css';
import Header from './Header';
import 'mdbreact/dist/css/mdb.css';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ticketPic from "../images/tickets.jpg";
import Container from "react-bootstrap/Container";
import {Col} from "mdbreact";
import Row from "react-bootstrap/Row";


class HomePage extends Component {

    render() {
        return (
            <div className="App">
                <Header active="Home"/>
                This website lets you configure your authorization manager.
                {/*<Dashboard/>*/}
            </div>
        );
    }
}

const HomeCard = (title, message, image) => {
    return (
        <Card style={{ width: '16rem' }}>
            <Card.Img variant="top" src={image}/>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                    {message}
                </Card.Text>
                <Button variant="primary">Go to {title}</Button>
            </Card.Body>
        </Card>
    )
};

const Dashboard = () => {
    return <Container>
        <Row>
            <Col>
                {HomeCard("Tickets", "There are currently 13 Tickets granted", ticketPic)}
            </Col>
            <Col>
                {HomeCard("CAMs", "...", ticketPic)}
            </Col>
        </Row>
    </Container>;
};

export default HomePage;
