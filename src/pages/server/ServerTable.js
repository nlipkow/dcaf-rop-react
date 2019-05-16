import React, {Component} from "react";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import Utils from "../../utils/Utils";
import ServerFormModal from "./ServerFormModal";
import FormModal from "../../components/FormModal";
import ElementDropdown from "../../components/ElementDropdown";

class ServerTable extends Component {

    componentDidMount() {
        this.props.root.componentDidMount();
    }

    renderServerTable(array) {
        return array.map((server, i) =>
            <tr key={i}>
                <td>{server.host}</td>
                <td>{server.preSharedKey}</td>
                <td>
                    <ul>
                        {this.renderResources(server.resources)}
                    </ul>
                </td>
                <td><ElementDropdown name="Server"
                                     api={process.env.REACT_APP_API_SERVER}
                                     editModal={ServerFormModal}
                                     element={server}
                                     update={this.componentDidMount.bind(this)}/></td>
            </tr>
        );
    }

    renderResources(resources) {
        return resources.map((resource, i) =>
            <li key={i}>{resource.url} [{Utils.getMethodsString(resource.methods)}]</li>
        );
    }

    render () {
        return (
            <>
                <h2>Server</h2>
                <p>The server for which the SAM is responsible for and which SAM can configure.</p>
                <MDBTable align ="center" responsive striped bordered hover>
                    <MDBTableHead color="unique-color !important">
                        <tr>
                            <th className="text-center"> Host </th>
                            <th className="text-center"> Secret </th>
                            <th className="text-center"> Resources </th>
                            <th className="text-center"> Menu </th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {this.renderServerTable(this.props.data)}
                    </MDBTableBody>
                </MDBTable>
                <FormModal name="Server"
                           operation="Add"
                           formModal={ServerFormModal}
                           update={this.componentDidMount.bind(this)}/>
            </>
        )
    }
}

export default ServerTable;