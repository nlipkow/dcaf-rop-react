import React from 'react';
import '../css/Login.css';
import Utils from '../utils/Utils';
import logo from "../images/wadi.png";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {withRouter} from "react-router-dom";
import Container from "react-bootstrap/Container";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        Utils.logout();

        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const {username, password} = this.state;

        if (!(username && password)) {
            return;
        }

        let that = this;
        Utils.login(username, password, this.onFail)
            .then(
                response => {
                    if (response.status < 300) {
                        const {from} = that.props.location.state || {from: {pathname: "/"}};
                        that.props.history.push(from);
                    }
                },
            );
    }

    onFail(error) {
        let errorMessage;
        if (error.response !== undefined) {
            let errorCode = error.response.status;
            if (errorCode === 401) {
                errorMessage = "Wrong combination of username and password. <br>Please try again.";
            } else {
                errorMessage = "Error: Response code from SAM was: " + errorCode;
            }
        } else {
            errorMessage = "Unexpected Error: " + error.message;
        }

        let warning = document.getElementById("warning-wrongCredentials");
        warning.innerHTML = errorMessage;
        setTimeout(() => {
            if (warning) {
                warning.innerHTML = "";
            }
        }, 5000);
        return error;
    }

    render() {

        // const for React CSS transition declaration
        let component = <Modal parent={this} change={ this.handleChange } onSubmit={ this.handleSubmit } key='modal'/>;

        return <ReactCSSTransitionGroup transitionName="animation" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
            { component }
        </ReactCSSTransitionGroup>
    }
}

// Modal
class Modal extends React.Component {

    render() {
        const { username, password } = this.props.parent.state;
        return <div className='Modal'>
            <Logo />
            <form onSubmit= { this.props.onSubmit }>
                <Input type='text' name='username' placeholder='username' value={username} onChange={this.props.change}  />
                <Input type='password' name='password' placeholder='password' value={password} onChange={this.props.change} />
                <Container>
                    <div className="warning login" id="warning-wrongCredentials"/>
                </Container>
                <button className="form button"> Sign In</button>
            </form>
        </div>
    }
}

// Generic input field
class Input extends React.Component {
    render() {
        return <div className='Input'>
            <input type={ this.props.type } name={ this.props.name } placeholder={ this.props.placeholder } onChange={this.props.onChange} required autoComplete="current-password"/>
            <label className="login label" htmlFor={ this.props.name } />
        </div>
    }

}

class Logo extends React.Component {
    render() {
        return <div className="logo">
            <img alt="" className="mw-100" src={logo} style={{width: "250px"}}/>
        </div>
    }
}

export const LoginPageWithRouter = withRouter(LoginPage);