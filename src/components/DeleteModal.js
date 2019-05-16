import {MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader} from "mdbreact";
import React, {Component} from "react";
import Utils from "../utils/Utils";
import RevokeCheckbox from "./RevokeCheckbox";

class DeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            revokeChecked: false
        }
    }

    toggle = () => {
        if (this.props.toggleModal === undefined) {
            this.setState({
                modal: !this.state.modal
            });
        } else {
            this.props.toggleModal();
        }
        this.setState({revokeChecked: false});
    };

    async handleDelete() {
        let url = 'https://' + this.props.api + '?id=' + encodeURI(this.props.elementId);
        if (this.state.revokeChecked) {
            url += "&revoke=true"
        }
        DeleteModal.showLoader();
        await Utils.sendRequest(url, 'delete',
            this.onSuccess.bind(this), null);
        this.setState({revokeChecked: false});
        DeleteModal.hideLoader();
    }

    onSuccess() {
        this.props.update();
        DeleteModal.hideLoader();
        this.toggle();
    }

    static showLoader() {
        const spinner = document.getElementById("modal-spinner");
        if (spinner !== null) {
            if (spinner.style.display === "none" || !spinner.style.display) {
                spinner.style.display = "inline-block";
            }
        }
    }

    static hideLoader() {
        const spinner = document.getElementById("modal-spinner");
        if (spinner !== null) {
            if (spinner.style.display === "inline-block" || !spinner.style.display) {
                spinner.style.display = "none";
            }
        }
    }

    handleRevokeCheck() {
        this.setState({revokeChecked: !this.state.revokeChecked})
    }

    render () {
        const operation = this.props.operation ? this.props.operation : 'Delete';
        const extraNote = this.props.name === "CAM" || this.props.name === "Server" ? " Every access rule " +
            "referenced by this record will be deleted as well." : "";

        return (
            <MDBModal isOpen={this.props.isOpen === undefined ? this.state.modal : this.props.isOpen} toggle={this.props.toggleModal}>
                <MDBModalHeader toggle={this.props.toggleModal === undefined ? this.toggle : this.props.toggleModal}>
                    {operation + " " + this.props.name}
                </MDBModalHeader>
                <MDBModalBody>
                    Are you sure you want to {operation.toLowerCase()} {this.props.name} with id {this.props.elementId}?
                    {extraNote}
                </MDBModalBody>
                <MDBModalFooter>
                    <RevokeCheckbox handler={this.handleRevokeCheck.bind(this)}/>
                    <MDBBtn color="secondary" onClick={this.props.toggleModal === undefined ? this.toggle : this.props.toggleModal}>
                        Cancel
                    </MDBBtn>
                    <MDBBtn color="primary" onClick={() => this.handleDelete()}>
                        {operation}
                        <span id="modal-spinner" className="spinner-border spinner-border-sm"/></MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        )
    }
}

export default DeleteModal;