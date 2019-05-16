import React, {Component} from 'react';
import '../../App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import {MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
import Properties from "../../utils/Properties";
import Utils from "../../utils/Utils";
import RevokeCheckbox from "../../components/RevokeCheckbox"

class RuleFormModal extends Component {
    constructor(props) {
        super(props);
        const element = this.props.element;
        this.state = {
            cams: [],
            server: [],
            name: element ? element.id : '',
            camId: element ? element.camIdentifier : '',
            serverHost: element ? element.accessRules[0].serverInfo.host : '',
            resourcePath: element ? element.accessRules[0].resource : '',
            resources:  element ? element.accessRules[0].serverInfo.resources : [],
            methods: element ?
                RuleFormModal.getAvailableMethodsFromResource(element.accessRules[0].resource, element.accessRules[0].serverInfo.resources) : 0,
            getChecked: element ? element.accessRules[0].methods & Properties.Methods.GET : false,
            postChecked: element ? element.accessRules[0].methods & Properties.Methods.POST : false,
            putChecked: element ? element.accessRules[0].methods & Properties.Methods.PUT : false,
            deleteChecked: element ? element.accessRules[0].methods & Properties.Methods.DELETE : false,
            patchChecked: element ? element.accessRules[0].methods & Properties.Methods.PATCH : false,
            revokeChecked: false,
        };
    }

    componentDidMount() {
        Utils.sendRequest("https://" + process.env.REACT_APP_API_CAMS, 'get', function (response) {
            this.setState({cams: response.data});
        }.bind(this));

        Utils.sendRequest("https://" + process.env.REACT_APP_API_SERVER, 'get', function (response) {
            this.setState({server: response.data});
        }.bind(this));
    }

    setBackOldState() {
        let element = this.props.element;
        if (element) {
            this.setState({name: element.id});
            this.setState({camId: element.camIdentifier});
            this.setState({serverHost: element.accessRules[0].serverInfo.host});
            this.setState({resources: element.accessRules[0].serverInfo.resources});
            this.setState({methods: RuleFormModal.getAvailableMethodsFromResource(element.accessRules[0].resource, element.accessRules[0].serverInfo.resources)});
            this.setState({resourcePath: element.accessRules[0].resource});
            this.setState({getChecked: element.accessRules[0].methods & Properties.Methods.GET});
            this.setState({postChecked: element.accessRules[0].methods & Properties.Methods.POST});
            this.setState({putChecked: element.accessRules[0].methods & Properties.Methods.PUT});
            this.setState({deleteChecked: element.accessRules[0].methods & Properties.Methods.DELETE});
            this.setState({patchChecked: element.accessRules[0].methods & Properties.Methods.PATCH});
        } else {
            this.setState({name: ''});
            this.setState({camId: ''});
            this.setState({serverHost: ''});
            this.setState({resources: []});
            this.setState({methods: 0});
            this.setState({resourcePath: ''});
            this.setState({getChecked: false});
            this.setState({postChecked: false});
            this.setState({putChecked: false});
            this.setState({deleteChecked: false});
            this.setState({patchChecked: false});
        }
        this.setState({revokeChecked: false});
    }

    async handleSubmit(event) {
        event.preventDefault();

        let allowedMethods = 0;

        if(!this.atLeastOneMethodSelected()) {
            let warning = document.getElementById("warning-checkbox");
            warning.innerHTML = "Please select at least one method.";
            setTimeout(() => {
                if (warning) {
                    warning.innerHTML = "";
                }
            }, 5000);
            return true;
        } else {
            allowedMethods = this.state.getChecked ? allowedMethods | Properties.Methods.GET : allowedMethods;
            allowedMethods = this.state.postChecked ? allowedMethods | Properties.Methods.POST : allowedMethods;
            allowedMethods = this.state.putChecked ? allowedMethods | Properties.Methods.PUT : allowedMethods;
            allowedMethods = this.state.deleteChecked ? allowedMethods | Properties.Methods.DELETE : allowedMethods;
            allowedMethods = this.state.patchChecked ? allowedMethods | Properties.Methods.PATCH : allowedMethods;
        }

        Utils.showLoader();
        let url = "https://" + process.env.REACT_APP_API_RULES;
        if (this.state.revokeChecked) {
            url += "?revoke=true"
        }
        let httpMethod;
        if (this.props.isEditModal) {
            httpMethod = 'patch';
        } else {
            httpMethod = 'post';
        }

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        let json = [];
        let server = this.getServerFromHostAddress(this.state.serverHost);
        json.push({"serverInfo": server, "resource":this.state.resourcePath, "methods":allowedMethods});
        const payload = JSON.stringify({
            id: this.state.name,
            camIdentifier: this.state.camId,
            accessRules: json
        });

        await Utils.sendRequest(url, httpMethod, this.onSuccess.bind(this), this.onFail.bind(this), payload, headers);
        this.setState({revokeChecked: false});
        Utils.hideLoader();
    }

    onFail(error) {
        let errorMessage;

        if (error.response !== undefined) {
            let errorCode = error.response.status;
            if (errorCode === 422) {
                errorMessage = "This rule name already exists, please pick another one.";
            } else {
                errorMessage = "Error: Response code from SAM was: " + errorCode;
            }
        } else {
            errorMessage = "Unexpected Error: " + error.message;
        }

        let warning = document.getElementById("warning-rules");
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
            this.setState({serverHost: ''});
            this.setState({resources: []});
        }
        this.props.update();
        this.props.toggleModal();
    }

    atLeastOneMethodSelected() {
        return this.state.getChecked || this.state.postChecked || this.state.putChecked || this.state.deleteChecked ||
            this.state.patchChecked;
    }

    getServerFromHostAddress(host) {
        let allServer = this.state.server;
        if (allServer) {
            for (let i in allServer) {
                if (allServer[i].host === host) {
                    return allServer[i];
                }
            }
        }
    }

    handleNameChange(event) {
        this.setState({name: event.target.value})
    }

    handleCamDropChange(event) {
        this.setState({camId: this.getCamIdFromName(event.target.value)})
    }

    getCamIdFromName(camName) {
        let cams = this.state.cams;
        for(let camIndex in cams) {
            if (cams[camIndex].name === camName) {
                return cams[camIndex].id;
            }
        }
    }

    renderCamDropdownItems() {
        return this.state.cams.map((cam, i) =>
            <option key={i}>{cam.name}</option>
        )
    }

    handleServerDropChange(event) {
        let selectedHost = event.target.value;
        let server = this.state.server;
        let resources = [];
        for (let sIndex in this.state.server) {
            if (server[sIndex].host === selectedHost) {
                resources = server[sIndex].resources;
            }
        }

        if (this.state.serverHost !== selectedHost) {
            this.setState({resourcePath: ''});
            this.setState({methods: 0});
            this.setState({getChecked: false});
            this.setState({postChecked: false});
            this.setState({putChecked: false});
            this.setState({deleteChecked: false});
            this.setState({patchChecked: false});
        }
        this.setState({serverHost: selectedHost});
        this.setState({resources: resources});
    }

    renderServerDropdownItems() {
        return this.state.server.map((server, i) =>
            <option key={i} value={server.host}>{server.host}</option>
        )
    }

    getCamNameFromCamId(camId) {
        let cams = this.state.cams;
        for (let i in cams) {
            if (cams[i].id === camId) {
                return cams[i].name;
            }
        }
    }

    handleResourcesDropChange(event) {
        let selectedResource = event.target.value;
        let resources = this.state.resources;
        let methods = RuleFormModal.getAvailableMethodsFromResource(selectedResource, resources);

        if (this.state.resourcePath !== selectedResource) {
            this.setState({getChecked: false});
            this.setState({postChecked: false});
            this.setState({putChecked: false});
            this.setState({deleteChecked: false});
            this.setState({patchChecked: false});
        }
        this.setState({methods: methods});
        this.setState({resources: resources});
        this.setState({resourcePath: event.target.value});
    }

    handleGetChange() {
        this.setState({getChecked: !this.state.getChecked})
    }

    handlePostChange() {
        this.setState({postChecked: !this.state.postChecked})
    }

    handlePutChange() {
        this.setState({putChecked: !this.state.putChecked})
    }

    handleDeleteChange() {
        this.setState({deleteChecked: !this.state.deleteChecked})
    }

    handlePatchChange() {
        this.setState({deleteChecked: !this.state.deleteChecked})
    }

    handleRevokeCheck() {
        this.setState({revokeChecked: !this.state.revokeChecked})
    }

    static getAvailableMethodsFromResource(resource, resources) {
        for (let sIndex in resources) {
            if (resources[sIndex].url === resource) {
                return resources[sIndex].methods;
            }
        }

        return 0;
    }

    renderResourcesDropdownItems() {
        return this.state.resources.map((resource, i) =>
            <option key={i} value={resource.url.toLowerCase()}>{resource.url}</option>
        )
    }

    toggleModal() {
        this.props.toggleModal();
        this.setBackOldState();
    }

    render() {
        return (
            <MDBModal isOpen={this.props.isOpen} toggle={this.toggleModal.bind(this)}>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <MDBModalHeader toggle={this.toggleModal.bind(this)}>{this.props.operation} {this.props.name}</MDBModalHeader>
                    <MDBModalBody>
                        <Form.Row>
                            <Form.Group as={Col} controlId="name" onChange={this.handleNameChange.bind(this)}>
                                <Form.Label>Name</Form.Label>
                                <Form.Control placeholder="Enter an unique name for the rule"
                                              defaultValue={this.state.name}
                                              required disabled={this.props.isEditModal}/>
                                <div className="warning" id="warning-rules"/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>CAM</Form.Label>
                                <Form.Control as="select"
                                              onChange={this.handleCamDropChange.bind(this)}
                                              id="camOptions"
                                              className="form-control"
                                              value={this.getCamNameFromCamId(this.state.camId)}
                                              required>
                                    <option key={44} value="">Choose...</option>
                                    {this.renderCamDropdownItems()}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Server</Form.Label>
                                <Form.Control as="select"
                                              onChange={this.handleServerDropChange.bind(this)}
                                              id="serverOptions" className="form-control"
                                              value={this.state.serverHost} required>
                                    <option value="" >Choose...</option>
                                    {this.renderServerDropdownItems()}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} required>
                                <Form.Label>Resources</Form.Label>
                                <Form.Control as="select"
                                              id="inputState"
                                              value={this.state.resourcePath}
                                              className="form-control"
                                              required
                                              disabled={this.state.serverHost === "Choose..." ||
                                              ! this.state.serverHost}
                                              onChange={this.handleResourcesDropChange.bind(this)}>
                                    <option value="">Choose...</option>
                                    {this.renderResourcesDropdownItems()}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Methods </Form.Label>
                        </Form.Row>
                        <Form.Row>
                            <Form.Check inline
                                        onChange={this.handleGetChange.bind(this)} label="GET"
                                        checked={this.state.getChecked}
                                        disabled={!(Properties.Methods.GET & this.state.methods)}
                                        type='checkbox'
                                        id={`inline-checkbox-1`} />
                            <Form.Check inline
                                        label="POST"
                                        onChange={this.handlePostChange.bind(this)}
                                        checked={this.state.postChecked}
                                        disabled={!(Properties.Methods.POST & this.state.methods)}
                                        type='checkbox'
                                        id={`inline-checkbox-2`} />
                            <Form.Check inline
                                        checked={this.state.putChecked}
                                        onChange={this.handlePutChange.bind(this)}
                                        disabled={!(Properties.Methods.PUT & this.state.methods)}
                                        label="PUT"
                                        type='checkbox'
                                        id={`inline-checkbox-3`}
                            />
                            <Form.Check inline
                                        label="DELETE"
                                        onChange={this.handleDeleteChange.bind(this)}
                                        checked={this.state.deleteChecked}
                                        disabled={!(Properties.Methods.DELETE & this.state.methods)}
                                        type='checkbox' id={`inline-checkbox-4`} />
                            <Form.Check inline
                                        label="PATCH"
                                        onChange={this.handlePatchChange.bind(this)}
                                        checked={this.state.patchChecked}
                                        disabled={!(Properties.Methods.PATCH & this.state.methods)}
                                        type='checkbox'
                                        id={`inline-checkbox-5`} />
                            <div id="warning-checkbox" className="warning"/>
                        </Form.Row>
                        <Form.Row>
                            <div>&nbsp;</div>
                        </Form.Row>
                        {this.props.isEditModal && <RevokeCheckbox handler={this.handleRevokeCheck.bind(this)}/>}
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

export default RuleFormModal;
