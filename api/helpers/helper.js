const global = require("../global/global");
const axios = require('axios');


async function apiRequest(method, url, data, token) {
    try {
        const header = {
            headers: { Authorization: `Bearer ${token}` }
        };
        let res;
        if (method == 'post') {
            res = await axios.post(global.urlApi + url, data, header);
        } else {
            res = await axios.get(global.urlApi + url, data, header);
        }
        return res;
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    apiRequest
}