const ROOT_API_URL = 'http://localhost:9090';
const ROOT_FE_URL = 'http://localhost:9191/web-app';

loginUser = () => {
    alert('login user');
    const emailAddress = document.getElementById('emailAddress').value;
    const password = document.getElementById('password').value;
    
    //validate required fields
    if(emailAddress === '' || password === ''){
        alert("All fields are required.");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', ROOT_API_URL + '/oauth/token', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", 'Basic Y2xpZW50aWQ6YWJjZGVmZw==');
    xhr.addEventListener('load', function() {
        var responseObject = JSON.parse(this.response);
        console.log(responseObject);
        if (responseObject.access_token) {
            //tokenElement.innerHTML = responseObject.token;
            console.log('responseObject.access_token: ', responseObject.access_token);
            sessionStorage.setItem('webapp', responseObject.access_token);
            //redirect to user home
            window.location.replace( ROOT_FE_URL + "/home.html");
        } else {
            // tokenElement.innerHTML = "No token received";
            console.log("No token received");
        }
    });

    xhr.ontimeout = function () {
        reject('timeout')
      }

    const data = 'grant_type=password&username=' + emailAddress + '&password=' + password;
    xhr.send(data);
}

getUserDetails = () => {
    //check if token is existing in session
    const token = sessionStorage.getItem('webapp');
    if(!token){
        //remove appname
        sessionStorage.removeItem('appname');
        //redirect to login
        window.location.replace( ROOT_FE_URL + "/login.html");
    }

    return 'Kitchie';
}

logout = () => {
    alert('Logging out...');
    sessionStorage.removeItem('appname');
    sessionStorage.removeItem('webapp')
    window.location.replace( ROOT_FE_URL);
}

showWelcome = () => {
    const name = getUserDetails();

    console.log('name: ', name);
    const userDiv = document.getElementById('user-div');

    userDiv.innerHTML = '<h3>Welcome, Kitchie!</h3>';
}

