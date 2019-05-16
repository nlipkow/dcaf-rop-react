import React, {Component} from 'react';
import '../../App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import {MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
import Utils from "../../utils/Utils";

class CamFormModal extends Component {
    constructor(props) {
        super(props);
        const element = this.props.element;
        this.state = {
            name: element ? element.name : '',
            id: element ? element.id : '',
            callbackSuccess: false,
        };
    }

    async handleSubmit(e) {
        e.preventDefault();
        Utils.showLoader();

        let httpMethod;
        let url = 'https://' + process.env.REACT_APP_API_CAMS;
        if (this.props.isEditModal) {
            httpMethod = 'patch';
        } else {
            httpMethod = 'post';
        }

        const payload = JSON.stringify({
            name: this.state.name,
            id: this.state.id
        });

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        await Utils.sendRequest(url, httpMethod, this.onSuccess.bind(this), this.onFail.bind(this), payload, headers);
        Utils.hideLoader();
    }

    onFail(error) {
        let errorMessage;

        if (error.response !== undefined) {
            let errorCode = error.response.status;
            if (errorCode === 422) {
                errorMessage = "This host already exists, please pick another one.";
            } else {
                errorMessage = "Error: Response code from SAM was: " + errorCode;
            }
        } else {
            errorMessage = "Unexpected Error: " + error.message;
        }

        let warning = document.getElementById("warning-cam");
        warning.innerHTML = errorMessage;
        setTimeout(() => {
            if (warning) {
                warning.innerHTML = "";
            }
        }, 5000);
    }

    onSuccess() {
        if (!this.props.isEditModal) {
            this.setState({name: ''});
            this.setState({id: ''});
        }

        this.props.update();
        this.props.toggleModal();
    }

    handleNameChange(event) {
        event.preventDefault();
        this.setState({name: event.target.value})
    }

    handleIdChange(event) {
        this.setState({id: event.target.value})
    }

    toggleModal() {
        this.props.toggleModal();
        this.setBackOldState()
    }

    setBackOldState() {
        let element = this.props.element;
        if (element) {
            this.setState({name: element.name});
            this.setState({id: element.id});
        } else {
            this.setState({name: ''});
            this.setState({id: ''});
        }
    }

    render() {
        return (
            <MDBModal isOpen={this.props.isOpen} toggle={this.toggleModal.bind(this)}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <MDBModalHeader toggle={this.toggleModal.bind(this)}>{this.props.operation + " " + this.props.name}</MDBModalHeader>
                    <MDBModalBody>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formBasicName" onChange={this.handleNameChange.bind(this)}>
                                <Form.Label>Name</Form.Label>
                                <Form.Control defaultValue={this.state.name} type="text" placeholder="Enter name" required/>
                                <Form.Control.Feedback type="invalid">
                                    Please choose a username.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="idForm" onChange={this.handleIdChange.bind(this)}>
                                <Form.Label>Host</Form.Label>
                                <Form.Control defaultValue={this.state.id} placeholder="Enter hostname" disabled={this.props.isEditModal} required/>
                                <div className="warning" id="warning-cam"/>
                            </Form.Group>
                        </Form.Row>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggleModal.bind(this)}>
                            Cancel
                        </MDBBtn>
                        <MDBBtn color="primary" type="submit">
                            Submit
                            <span id="modal-spinner" className="spinner-border spinner-border-sm"/></MDBBtn>
                    </MDBModalFooter>
                </Form>
            </MDBModal>
        );
    }
}

export default CamFormModal;
