import React, { Component } from 'react';
import '../App.css';
import Header from './Header';
import 'mdbreact/dist/css/mdb.css';
import Utils from "../utils/Utils";

class PageContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
        }
    }

    componentDidMount() {
        Utils.sendRequest("https://" + this.props.dataApi, 'get', function (response) {
            this.setState({tableData: response.data});
        }.bind(this));
    }

    render() {
        const Content = this.props.content;
        if (!this.state.tableData) {
            return <Header/>;
        } else {
            return (
                <div className="App">
                    <Header active={this.props.name}/>
                    <Content root={this} data={this.state.tableData}/>
                </div>
            );
        }
    }
}

export default PageContent;
