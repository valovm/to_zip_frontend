import * as axios from 'axios';

const BASE_URL = `${process.env.API_HOST}/api/v1`;

function getInitConfig() {
    const url = `${BASE_URL}/convert`;
    return axios.get(url);
}

function upload(formData) {
    const config = {
        // onUploadProgress: progressEvent => console.log(progressEvent.loaded)
    }
    const url = `${BASE_URL}/convert/upload`;
    return axios.post(url, formData, config);
}

function checkStatus(id) {
    const url = `${BASE_URL}/convert/status`;
    return axios.get(url, {params: {id}})
        .then(e => e.data)
        .catch((err) => {
            return 'not_found'
        })
}

function getDownloadLink(id) {
    return `${BASE_URL}/convert/download?id=${id}`;
}

export default {getInitConfig, checkStatus, upload, getDownloadLink}
