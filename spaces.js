const ROOT_API_URL = 'http://localhost:9090';
const ROOT_FE_URL = 'http://localhost:9191/web-app';

saveNewSpace = () => {
    alert('save new space');

    //get token from session storage
    const token = sessionStorage.getItem('webapp');
    if(!token){
        alert("You need to be logged in to post a space.");
        //redirect user to login
        window.location.replace( ROOT_FE_URL + "/login.html");
    }

    //get values from form
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const categoryId = 1; // document.getElementById('category').value;
    const address = document.getElementById('address').value;
    const dailyRate = document.getElementById('dailyRate').value;

    //TODO: validate

    //save
    const space = {
        title: title,
        categoryId: categoryId,
        description: description,
        dailyRate: dailyRate,
        address: address
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', ROOT_API_URL + '/space', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + token);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {
            // Request finished. Do processing here.
            console.log("status was okay");
            alert(this.response);
            //resolve(xhr.response);
            //redirect to user's list of spaces when successful
            window.location.replace(ROOT_FE_URL + '/myspaces.html');
        }else if (this.readyState === XMLHttpRequest.DONE && this.status === 401){
            console.log("request failed");
            console.log('status for failing: ', this.status);
            //reject(xhr.status);
            // access issue, redirect to login
            alert("You need to be logged in to post a space or your access has expired.");
            window.location.replace(ROOT_FE_URL + '/login.html');
        }
    }
      
    xhr.ontimeout = function () {
        reject('timeout')
      }

    xhr.send(JSON.stringify(space));
}