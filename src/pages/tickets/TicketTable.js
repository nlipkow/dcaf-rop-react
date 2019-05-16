import React, {Component} from "react";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import DeleteModal from "../../components/DeleteModal";
import Properties from "../../utils/Properties";
import Utils from "../../utils/Utils";
import FormModal from "../../components/FormModal";

class TicketTable extends Component {

    componentDidMount() {
        this.props.root.componentDidMount();
        this.interval = setInterval(() => this.props.root.componentDidMount(), 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderTicketTable(array) {
        return array.map((ticket, i) =>
            <tr key={i}>
                <td>{ticket.id}</td>
                <td>{Utils.getHostname(ticket[Properties.DcafEncoding.F][Properties.DcafEncoding.SAI][0][0])}</td>
                <td>{Utils.getResource(ticket[Properties.DcafEncoding.F][Properties.DcafEncoding.SAI][0][0])  +
                ' [' + Utils.getMethodsString(ticket[Properties.DcafEncoding.F][Properties.DcafEncoding.SAI][0][1]) +
                ']'}</td>
                <td>{ticket[Properties.DcafEncoding.F][Properties.DcafEncoding.TS]}</td>
                <td>{ticket[Properties.DcafEncoding.F][Properties.DcafEncoding.L]}</td>
                <td align='center'><FormModal name="Ticket"
                                              operation="Revoke"
                                              btnClassName="fa fa-times"
                                              formModal={DeleteModal}
                                              update={this.componentDidMount.bind(this)}
                                              api={process.env.REACT_APP_API_TICKETS}
                                              id={ticket.id}/></td>
            </tr>
        );
    }

    render () {
        return (
            <>
                <h2>Tickets</h2>
                <p>The currently granted tickets.</p>
                <MDBTable align="center" responsive bordered hover>
                    <MDBTableHead color="unique-color">
                        <tr>
                            <th className="text-center"> Ticket ID</th>
                            <th className="text-center"> Server</th>
                            <th className="text-center"> Resources</th>
                            <th className="text-center"> Timestamp</th>
                            <th className="text-center"> Lifetime</th>
                            <th className="text-center"> Revoke</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {this.renderTicketTable(this.props.data)}
                    </MDBTableBody>
                </MDBTable>
            </>
        )
    }
}

export default TicketTable;