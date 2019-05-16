import React, { Component } from 'react';
import { MDBContainer, MDBBtn} from 'mdbreact';

class FormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    render() {
        const Modal = this.props.formModal;
        const buttonContent = this.props.btnClassName ? '' : this.props.operation + " " + this.props.name;
        return (
            <MDBContainer>
                <MDBBtn onClick={this.toggle} className={this.props.btnClassName}>
                    {buttonContent}
                </MDBBtn>
                <Modal name={this.props.name}
                       elementId={this.props.id}
                       api={this.props.api}
                       update={this.props.update}
                       isOpen={this.state.modal}
                       toggleModal={this.toggle}
                       isEditModal={false}
                       root={this.props.root}
                       operation={this.props.operation}/>
            </MDBContainer>
        );
    }
}

export default FormModal;
