import Properties from "./Properties";
import React from "react";
import https from "https";
import axios from 'axios';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// const axios = require('axios');

class Utils extends React.Component {

    static getHostname(uri) {
        const url = require('url');
        return url.parse(uri).hostname;
    }

    static getResource(uri) {
        const url = require('url');
        return url.parse(uri).path;
    }

    static async sendRequest(url, method, successCallback, failCallback, data = null, headers=null) {

        axios({
            method: method,
            url: url,
            headers: headers,
            data: data,
            auth: localStorage.getItem('user') ?  JSON.parse(localStorage.getItem('user')) : null,
        })
            .then(successCallback)
            .catch(failCallback)
    }


    static login(username, password, onFail) {
        let json = {"username":username, "password": password, "isLogin":true};

        let user;
        let pass;
        if (json.hasOwnProperty("isLogin") && json.isLogin) {
            user = json.username;
            pass = json.password;
        }

        return axios({
            method: 'get',
            url: "https://localhost:8443/authorize",
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
            auth: {
                username: user,
                password: pass
            },
        })
            .then(function (response)  {
                if (response.status !== 200) {
                    if (response.status === 401) {
                        console.log("fail");
                        // auto logout if 401 response returned from api
                        Utils.logout();
                        // window.location.reload(true);
                    }

                    const error = (response && response.message) || response.statusText;
                    return Promise.reject(error);
                }
                let userData = {username: username, password: password};
                window.localStorage.setItem('user', JSON.stringify(userData));

                return response;
            })
            .catch(onFail)
    }

    static logout() {
        localStorage.removeItem('user');
    }

    static getMethodsString(methods) {
        let allowedMethods = '';

        if (Properties.Methods.GET & methods) {
            allowedMethods += "GET, "
        }
        if (Properties.Methods.POST & methods) {
            allowedMethods += "POST, "
        }
        if (Properties.Methods.PUT & methods) {
            allowedMethods += "PUT, "
        }
        if (Properties.Methods.DELETE & methods) {
            allowedMethods += "DELETE, "
        }
        if (Properties.Methods.PATCH & methods) {
            allowedMethods += "PATCH, "
        }

        return allowedMethods.substring(0, allowedMethods.length - 2);
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

    handleSuccess (response, username, password)  {
        if (response.status !== 200) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                Utils.logout();
                window.location.reload(true);
            }

            const error = (response && response.message) || response.statusText;
            return Promise.reject(error);
        }
        let userData = {username: username, password: password};
        window.localStorage.setItem('user', JSON.stringify(userData));

        return response;
    }

}

export default Utils