import * as axios from 'axios';

const API_URI = process.env.VUE_APP_API_URI;

function getInitConfig() {
    const url = `${API_URI}/convert`;
    return axios.get(url);
}

function upload(formData, onUploadProgress = null) {
    const config = {
        onUploadProgress: onUploadProgress,
    }
    const url = `${API_URI}/convert/upload`;
    return axios.post(url, formData, config);
}

function checkStatus(id) {
    const url = `${API_URI}/convert/status`;
    return axios.get(url, {params: {id}})
        .then(e => e.data)
        .catch((err) => {
            return 'not_found'
        })
}

function getDownloadLink(id) {
    return `${API_URI}/convert/download?id=${id}`;
}

export default {getInitConfig, checkStatus, upload, getDownloadLink}
