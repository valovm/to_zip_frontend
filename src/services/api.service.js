import * as axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

function upload(formData) {
    const url = `${BASE_URL}/convert/upload`;
    return axios.post(url, formData);
}

function checkStatus(id) {
    const url = `${BASE_URL}/convert/status`;
    return axios.get(url, {params: {id}}).then(e => e.data);
}

function getDownloadLink(id) {
    return `${BASE_URL}/convert/download?id=${id}`;
}

export default {checkStatus, upload, getDownloadLink}
