import React, {Component} from "react";
import {MDBTable, MDBTableBody, MDBTableHead} from "mdbreact";
import Utils from "../../utils/Utils";
import FormModal from "../../components/FormModal";
import RuleFormModal from "./RuleFormModal";
import ElementDropdown from "../../components/ElementDropdown";

class RuleTable extends Component {

    componentDidMount() {
        this.props.root.componentDidMount();
    }

    renderAccessRuleTable(array) {
        return array.map((rule, i) =>
            <tr key={i}>
                <td>{rule.id}</td>
                <td>{rule.camIdentifier}</td>
                <td>
                    <ul>
                        {this.renderRuleTable(rule.accessRules)}
                    </ul>
                </td>
                <td>{rule.hasOwnProperty("expiration") ? rule["expiration"] : "none"}</td>
                <td><ElementDropdown name="Access Rule"
                                     api={process.env.REACT_APP_API_RULES}
                                     element={rule}
                                     editModal={RuleFormModal}
                                     root={this.props.root}
                                     update={this.componentDidMount.bind(this)}/></td>
            </tr>
        );
    }

    renderRuleTable(rules) {
        return rules.map((rule, i) =>
            <li key={i}>{rule.serverInfo.host + rule.resource + ' [' + Utils.getMethodsString(rule.methods) + ']'}</li>)

    }

    render () {
        return (
            <>
                <h2>Access Rules</h2>
                <p>The rules which determine which resources the known CAMs can access on specific server.</p>
                <MDBTable align="center" responsive striped bordered hover>
                    <MDBTableHead color="unique-color">
                        <tr>
                            <th className="text-center"> Name</th>
                            <th className="text-center"> CAM</th>
                            <th className="text-center"> Resources</th>
                            <th className="text-center"> Expiration Date</th>
                            <th className="text-center"> Menu</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {this.renderAccessRuleTable(this.props.data)}
                    </MDBTableBody>
                </MDBTable>
                <FormModal
                    name="Rule"
                    operation="Add"
                    formModal={RuleFormModal}
                    update={this.componentDidMount.bind(this)}
                    cams={this.cams}
                    root={this.props.root}
                    server={this.server}
                />
            </>
        )
    }
}

export default RuleTable;