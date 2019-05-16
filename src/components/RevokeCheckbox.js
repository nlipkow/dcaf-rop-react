import React from "react";
import Form from 'react-bootstrap/Form';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const RevokeCheckbox = props => (
    <Form.Row>
        <Form.Check id="revokeCheck" type='checkbox' onChange={props.handler}/>
        <Form.Label htmlFor="revokeCheck">Revoke Tickets?&nbsp;
            <OverlayTrigger overlay={
                <Tooltip id="tooltip">
                    If checked, all tickets affected by this change will be revoked.
                </Tooltip>
            }
            >
                <div className="fa fa-question-circle"/>
            </OverlayTrigger>
            &nbsp;
        </Form.Label>
    </Form.Row>
);

export default RevokeCheckbox;