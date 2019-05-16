import React, { Component } from 'react';
import { MDBContainer, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';

import DeleteModal from "./DeleteModal";

class ElementDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      editModal: false
    }
  }

  toggleDelete = () => {
    this.setState({
      deleteModal: !this.state.deleteModal
    });
  };

  toggleEdit = () => {
    this.setState({
      editModal: !this.state.editModal
    });
  };

  render() {
    const EditModal = this.props.editModal;
    const elementId = this.props.element.id === undefined ? this.props.element.host : this.props.element.id;
    return (
        <MDBContainer>
          <div className="dropdown-button">
            <MDBDropdown>
              <MDBDropdownToggle className="fa fa-ellipsis-v" color="primary">
              </MDBDropdownToggle>
              <MDBDropdownMenu basic>
                <MDBDropdownItem onClick={this.toggleEdit}>
                  <span className="fa fa-pencil dropdown-icon"/>
                  Edit
                </MDBDropdownItem>
                <MDBDropdownItem onClick={this.toggleDelete}>
                  <span className="fa fa-trash dropdown-icon"/>
                  Delete
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
          <DeleteModal elementId={elementId}
                       api={this.props.api}
                       method={this.props.customMethodTitle ? this.props.customMethodTitle : 'Delete'}
                       isOpen={this.state.deleteModal}
                       name={this.props.name}
                       update={this.props.update}
                       toggleModal={this.toggleDelete}/>
          <EditModal parent={this}
                     isEditModal={true}
                     root={this.props.root}
                     isOpen={this.state.editModal}
                     element={this.props.element}
                     operation="Edit"
                     update={this.props.update}
                     toggleModal={this.toggleEdit}
                     name={this.props.name}/>
        </MDBContainer>
    );
  }
}

export default ElementDropdown;
