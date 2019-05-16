import React from 'react';
import {Route} from 'react-router-dom';

import {LoginPageWithRouter} from './pages/LoginPage';
import {PrivateRoute} from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import PageContent from "./pages/PageContent";
import CamTable from "./pages/cams/CamTable";
import TicketTable from "./pages/tickets/TicketTable";
import ServerTable from "./pages/server/ServerTable";
import RuleTable from "./pages/rules/RuleTable";

class App extends React.Component {

    render() {
        return (
                <div>
                    <PrivateRoute exact path="/" component={HomePage} />
                    <PrivateRoute path="/cams" component={CamPage}/>
                    <PrivateRoute path="/server" component={ServerPage}/>
                    <PrivateRoute path="/rules" component={RulesPage}/>
                    <PrivateRoute path="/tickets" component={TicketsPage}/>
                    <Route path="/login" render={LoginPageWithRouter} />
                </div>
        );
    }
}

const CamPage = () => {
    return (
        <PageContent name="CAMs" content={CamTable} dataApi={process.env.REACT_APP_API_CAMS}/>
    )
};

const ServerPage = () => {
    return (
        <PageContent name="Server" content={ServerTable} dataApi={process.env.REACT_APP_API_SERVER}/>
    )
};
const RulesPage = () => {
    return (
        <PageContent name="Rules" content={RuleTable} dataApi={process.env.REACT_APP_API_RULES}/>
    )
};
const TicketsPage = () => {
    return (
        <PageContent name="Tickets" content={TicketTable} dataApi={process.env.REACT_APP_API_TICKETS}/>
    )
};


export { App };