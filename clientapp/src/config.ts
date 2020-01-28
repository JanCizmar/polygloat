const DEFAULT_API_URL = window.location.origin + '/api/';
const DEVELOPMENT_API_URL = 'http://localhost:8080/api/';

// noinspection JSUnusedAssignment
var url = DEFAULT_API_URL;

//dont change this, its for production build
// #if process.env.target!=="appbundle"
url = DEVELOPMENT_API_URL;
// #endif

export const CONFIG = {
    API_URL: url,
};
