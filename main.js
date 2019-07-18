const ROOT_API_URL = 'http://localhost:9090';

registerUser = () => {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    //validate required fields
    if(firstname === '' || lastname === '' || emailAddress === '' || password === '' || confirmPassword === ''){
        alert("All fields are required.");
        return;
    }

    //validate email address
    if (!validateEmail(emailAddress)){
        alert("Email address is invalid");
        return;
    }

    //validate password
    if(!validatePassword(password)){
        return;
    }

    //validate password === confirm password
    if(password !== confirmPassword){
        alert("Passwords do not match.");
        return;
    }
        
    var newUser = {
        firstName : firstname,
        lastName : lastname,
        emailAddress : emailAddress,
        password : password
    }

    console.log('new user: ', newUser);
    
    const promise = postRegister('/register', 'Basic Y2xpZW50aWQ6YWJjZGVmZw==', newUser);
}

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

validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

validatePassword = (password) => {
    if (password.length < 12){
        alert("Password must be at least 12 characters in length.");
        return false;
    }
    return true;
}

postRegister : Promise = (url, authorization, parameters) => {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", ROOT_API_URL + url, true);
        
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", authorization);

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && (this.status === 200 || this.status === 201)) {
                // Request finished. Do processing here.
                console.log("status was okay");
                alert("Seccessfully registered user!");
                resolve(xhr.response);
            }else if (this.readyState === XMLHttpRequest.DONE && this.status !== 200){
                console.log("request failed");
                reject(xhr.status);
            }
        }

        xhr.ontimeout = function () {
            reject('timeout')
          }
        xhr.send(JSON.stringify(parameters));
    })
}