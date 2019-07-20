export function parseJwt() {
    if (!sessionStorage.getItem('webapp')){
        return;
    }
    const token = sessionStorage.getItem('webapp');
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function getAuthority() {
    const jsonToken = parseJwt();
    if(!jsonToken.authorities || jsonToken.authorities.size === 0){
        return undefined;
    }

    //get first item in array, expecting only one authority
    return jsonToken.authorities[0];
}

