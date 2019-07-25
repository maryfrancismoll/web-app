import { getAuthority } from './common.js';

const ROOT_API_URL = 'http://localhost:8080';
const ROOT_FE_URL = 'http://52.63.137.211/spaces';

console.log('getAuthority(): ', getAuthority());

if (getAuthority() !== 'ADMIN'){
    alert('You do not have access to this page.');
    window.location.replace(ROOT_FE_URL + '/home.html');
}

