
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

    const xhr = new XMLHttpRequest();
    xhr.open('POST', ROOT_API_URL + '/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("Authorization", 'Basic Y2xpZW50aWQ6YWJjZGVmZw==');
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {
            // Request finished. Do processing here.
            console.log("status was okay");
            alert("Seccessfully registered user!");
            //resolve(xhr.response);
            window.location.replace(ROOT_FE_URL + '/login.html');
        }else if (this.readyState === XMLHttpRequest.DONE && this.status !== 201){
            console.log("request failed");
            //reject(xhr.status);
        }
    }
      
    xhr.ontimeout = function () {
        reject('timeout')
      }

    xhr.send(JSON.stringify(newUser));
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