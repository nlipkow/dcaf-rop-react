import React, { Component } from 'react';
import '../App.css';
import PageNavBar from "../components/PageNavBar";

class Header extends Component {

    render() {
        return (
            <header className="App-header">
                <PageNavBar active={this.props.active}/>
                <script>var Alert = ReactBootstrap.Alert;</script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
                    integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
                    crossOrigin="anonymous"/>
            </header>
        );
    }
}

export default Header;
