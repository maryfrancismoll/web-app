import { getAuthority } from './common.js';

const ROOT_API_URL = 'http://localhost:9090';
const ROOT_FE_URL = 'http://localhost:9191/web-app';

console.log('getAuthority(): ', getAuthority());

if (getAuthority() !== 'ADMIN'){
    alert('You do not have access to this page.');
    window.location.replace(ROOT_FE_URL + '/home.html');
}

