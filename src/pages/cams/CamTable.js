import ElementDropdown from "../../components/ElementDropdown";
import CamFormModal from "./CamFormModal";
import React from "react";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import FormModal from "../../components/FormModal";

class CamTable extends React.Component {

    componentDidMount() {
        this.props.root.componentDidMount();
    }

    renderCamTable(cams) {
        return cams.map((cam, i) =>
            <tr key={i}>
                <td>{cam.name}</td>
                <td>{cam.id}</td>
                <td><ElementDropdown name="CAM"
                                     api={process.env.REACT_APP_API_CAMS}
                                     editModal={CamFormModal}
                                     element={cam}
                                     update={this.componentDidMount.bind(this)}
                />
                </td>
            </tr>
        );
    }

    render () {
        return (
            <>
                <h2>CAMs</h2>
                <p>The subjects which are authorized to request tickets.</p>
                <MDBTable align ="center" striped bordered hover>
                    <MDBTableHead color="unique-color !important" textWhite>
                        <tr>
                            <th className="text-center"> Name </th>
                            <th className="text-center"> Host </th>
                            <th className="text-center"> Menu </th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {this.renderCamTable(this.props.data)}
                    </MDBTableBody>
                </MDBTable>
                <FormModal name="CAM" operation="Add" formModal={CamFormModal} update={this.componentDidMount.bind(this)}/>
            </>
        )
    }
}

export default CamTable