registerUser = () => {
    alert("register user");
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    var newUser = {
        firstname : firstname,
        lastname : lastname,
        emailAddress : emailAddress,
        password : password
    }

    console.log('new user: ', newUser);
    alert(newUser);

    const promise = await post('http://localhost/register', 'Basic Y2xpZW50aWQ6YWJjZGVmZw==', newUser);
    console.log('promise: ', promise);
    alert('promise: ', promise);

    alert("hello");
}

post = (url, authorization, parameters) => {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", authorization);

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
                console.log("status was okay");
                resolve(xhr.response);
            }else if (this.readyState === XMLHttpRequest.DONE && this.status !== 200){
                console.log("request failed");
                reject(xhr.status);
            }
        }

        xhr.ontimeout = function () {
            reject('timeout')
          }
        xhr.send(parameters);
    })
  }