import React, {Component} from 'react';
import '../../App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import {MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
import Utils from "../../utils/Utils";

const regex = /^(\/(?!\/)[A-Za-z0-9_@\-^!#$%&+.,;={}()[\]]*)+[\s]+\[[\s]*(?:GET|POST|PUT|DELETE|PATCH)[\s]*(,[\s]*(?:GET|POST|PUT|DELETE|PATCH)[\s]*)*][\s]*(;[\s]*(\/(?!\/)[A-Za-z0-9_@\-^!#$%&+.,;={}()[\]]*)+[\s]+\[(?:GET|POST|PUT|DELETE|PATCH)[\s]*(,[\s]*(?:GET|POST|PUT|DELETE|PATCH))*][\s]*)*;?\s*$/m;
const PATH_REGEX_MATCH = /^[\s]*(\/(?!\/)[A-Za-z0-9_@\-^!#$%&+.,;={}()[\]]*)+/m;
const METHODS_REGEX_MATCH = /\[[\s]*(?:GET|POST|PUT|DELETE|PATCH)[\s]*(,[\s]*(?:GET|POST|PUT|DELETE|PATCH)[\s]*)*][\s]*/m;

class ServerFormModal extends Component {
    constructor(props) {
        super(props);
        const element = this.props.element;

        this.state = {
            hostname: element ? element.host : '',
            psk: element ? element.preSharedKey : '',
            resources: element ? ServerFormModal.getResourcesInputStringFromJson(element.resources) : '',
            allowedMethods: [],
            validate: false,
        };
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.state.validate) {
            let error = "Invalid input.<br />" +
                "Input resource as <path> [GET|POST|PUT|DELETE|PATCH (, GET|POST|PUT|DELETE|PATCH)]";
            let resourceWarning = document.getElementById("warning-resources");
            resourceWarning.innerHTML = error;
            setTimeout(() => resourceWarning.innerHTML = "", 5000);
            event.stopPropagation();
            return;
        }

        Utils.showLoader();
        this.extractPathAndMethods(this.state.resources.split(';'));
        let resourcesJson = [];

        for (let saiIndex in this.allowedMethods) {
            resourcesJson.push({"url":this.allowedMethods[saiIndex][0], "methods":this.allowedMethods[saiIndex][1]});
        }

        await this.addServer(resourcesJson);
    }

    async addServer(resources) {
        let httpMethod;
        let url;
        if (this.props.isEditModal) {
            httpMethod = 'patch';
            url = 'https://' + process.env.REACT_APP_API_SERVER;
        } else {
            httpMethod = 'post';
            url = 'https://' + process.env.REACT_APP_API_SERVER;
        }

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        const payload = JSON.stringify({
            host: this.state.hostname,
            preSharedKey: this.state.psk,
            resources: resources
        });

        await Utils.sendRequest(url, httpMethod, this.onSuccess.bind(this), this.onFail.bind(this), payload, headers);
        Utils.hideLoader();
    }

    onFail(error) {
        let errorMessage;
        if (error.response !== undefined) {
            let errorCode = error.response.status;
            if (errorCode === 422) {
                errorMessage = "This host already exists, please pick another one";
            } else {
                errorMessage = "Error: Response code from SAM was: " + errorCode;
            }
        } else {
            errorMessage = "Unexpected Error: " + error.message;
        }

        let warning = document.getElementById("warning-server");
        warning.innerHTML = errorMessage;
        setTimeout(() => {
            if (warning) {
                warning.innerHTML = "";
            }
        }, 5000);
    }

    onSuccess() {
        if (!this.props.isEditModal) {
            this.setState({hostname: ''});
            this.setState({psk: ''});
            this.setState({resources: ''});
        }

        this.props.update();
        this.props.toggleModal();
    }

    extractPathAndMethods(resourcesArray) {
        if (this.state.resources === "") {
            return false;
        }
        let resources = [];
        for(let i = 0; i < resourcesArray.length; i++)  {
            if (!resourcesArray[i])  {
                continue;
            }
            let allowedMethods = 0;
            let path = resourcesArray[i].match(PATH_REGEX_MATCH)[0];
            let extractedMethods = resourcesArray[i].match(METHODS_REGEX_MATCH)[0].replace('[', '').replace(']', '');
            if (extractedMethods == null) {
                throw new Error('Validation Error');
            }
            let methodsArray = extractedMethods.split(',');

            for(let j = 0; j < methodsArray.length; j++) {
                let methodValue = ServerFormModal.getMethodValue(methodsArray[j].trim());
                if(!methodValue) {
                    throw new Error('Validation Error');
                }
                allowedMethods |= methodValue;
            }

            resources.push([path, allowedMethods])
        }

        this.allowedMethods = resources;
    }

    static getMethodValue(methodString) {
        if(!("GET".localeCompare(methodString))) {
            return 1;
        }
        if(!("POST".localeCompare(methodString))) {
            return 2;
        }
        if(!("PUT".localeCompare(methodString))) {
            return 4;
        }
        if(!("DELETE".localeCompare(methodString))) {
            return 8;
        }
        if(!("PATCH".localeCompare(methodString))) {
            return 16;
        }

        return 0;
    }

    static getResourcesInputStringFromJson(resources) {
        let resourcesString = '';
        for (let i in resources) {
            let r = resources[i];
            resourcesString += r.url + " [" + Utils.getMethodsString(r.methods) + "];"
        }

        return resourcesString;
    }

    handleHostChange(event) {
        event.preventDefault();
        this.setState({hostname: event.target.value})
    }

    handlePSKChange(event) {
        this.setState({psk: event.target.value})
    }

    handleResourcesChange(event) {
        this.setState({validate: regex.test(event.target.value)});
        this.setState({resources: event.target.value})
    }

    toggleModal() {
        this.props.toggleModal();
        this.setBackOldState()
    }

    setBackOldState() {
        let element = this.props.element;
        if (element) {
            this.setState({hostname: element.host});
            this.setState({psk: element.preSharedKey});
            this.setState({resources: ServerFormModal.getResourcesInputStringFromJson(element.resources)});
        } else {
            this.setState({hostname: ''});
            this.setState({psk: ''});
            this.setState({resources: ''});
        }
    }

    render() {
        return (
            <MDBModal isOpen={this.props.isOpen} toggle={this.props.toggleModal}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <MDBModalHeader toggle={this.props.toggleModal}>{this.props.operation + " " + this.props.name}</MDBModalHeader>
                    <MDBModalBody>
                        <Form.Row>
                            <Form.Group as={Col} controlId="hostNameInput" onChange={this.handleHostChange.bind(this)}>
                                <Form.Label>Hostname or ipv6 address</Form.Label>
                                <Form.Control defaultValue={this.state.hostname} placeholder="Enter hostname or ipv6 address" required disabled={this.props.isEditModal}/>
                                <div className="warning" id="warning-server"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="pskForm" onChange={this.handlePSKChange.bind(this)}>
                                <Form.Label>Secret</Form.Label>
                                <Form.Control defaultValue={this.state.psk} placeholder="Enter secret" required/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="resourcesForm" >
                            <Form.Label>Resources</Form.Label>
                            <Form.Control defaultValue={this.state.resources}
                                          onInput={this.handleResourcesChange.bind(this)}
                                          placeholder="Enter semicolon-seperated resources as <path> [GET|POST|PUT|DELETE|PATCH (, GET|POST|PUT|DELETE|PATCH)]"
                                          required/>
                            <div className="warning" id="warning-resources"/>
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.props.toggleModal}>
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

export default ServerFormModal;
