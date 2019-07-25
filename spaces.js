
getToken = () => {
    //get token from session storage
    const token = sessionStorage.getItem('webapp');
    if(!token){
        alert("You need to be logged in to post a space.");
        //redirect user to login
        window.location.replace( ROOT_FE_URL + "/login.html");
    }
    return token;
}

saveNewSpace = () => {
    alert('save new space');

    //get values from form
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const categoryId = document.getElementById('category').value;
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

    console.log('space: ', space);

    sendRequest('POST', '/space', space, 201, true);
}

sendRequest = (method, url, body, successCode, newpage) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, ROOT_API_URL + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === successCode) {
            // Request finished. Do processing here.
            console.log("status was okay");
            alert(this.response);
            //resolve(xhr.response);
            //redirect to user's list of spaces when successful
            if(newpage){
                window.location.replace(ROOT_FE_URL + '/myspaces.html');
            }else{
                getMySpaces();
            }
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

    xhr.send(JSON.stringify(body));
}

getMySpaces = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', ROOT_API_URL + '/space/user', true);
    xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log("status was okay");
            console.log(this.response);
            // resolve(xhr.response);

            // display in table
            displaySpaces(JSON.parse(this.response));
        }else if (this.readyState === XMLHttpRequest.DONE && this.status === 401){
            console.log("request failed");
            console.log('status for failing: ', this.status);
            // reject(xhr.status);
            // access issue, redirect to login
            alert("You need to be logged in or with an access to view this page.");
            window.location.replace(ROOT_FE_URL + '/login.html');
        }
    }
      
    xhr.ontimeout = function () {
        reject('timeout')
      }

    xhr.send();
}

displaySpaces = (list) => {
    console.log('list: ', [...list]);

    //get element where the table will be placed
    const spacesDiv = document.getElementById('my-spaces');
    let tableValue = 
        '<table class="table table-hover table-bordered">' + 
            '<thead>' +
                '<tr>' + 
                    '<th>Title</th>' + 
                    '<th>Category</th>' + 
                    '<th>Daily Rate</th>' + 
                    '<th>Description</th>' + 
                    '<th>Address</th>' + 
                    '<th style="display:none">Available From</th>' + 
                    '<th style="display:none">Available To</th>' + 
                    '<th>Action</th>' + 
                '</tr>' +
            '</thead>' + 
            '<tbody>';

    list.forEach(function(element) {
        console.log(element);
        tableValue += 
            '<tr id="'+ element.id +'">' +
                '<td id="user-id-'+ element.id +'" style="display: none">' + element.userId + '</td>' +
                '<td id="category-id-'+ element.id +'" style="display: none">' + element.category.id + '</td>' +
                '<td id="title-'+ element.id +'">' + element.title + '</td>' +
                '<td id="category-'+ element.id +'">' + element.category.name + '</td>' +
                '<td id="daily-rate-'+ element.id +'">' + element.dailyRate + '</td>' +
                '<td id="description-'+ element.id +'">' + element.description + '</td>' +
                '<td id="address-'+ element.id +'">' + element.address + '</td>' +
                '<td id="available-from-'+ element.id +'" style="display:none">' + element.availableFrom + '</td>' +
                '<td id="available-to-'+ element.id +'" style="display:none">' + element.availableTo + '</td>' +
                '<td>' + 
                    '<div id="btns-div-'+ element.id +'">' +
                        '<button class="btn btn-primary" id="edit-'+ element.id +'" onclick="editSpace(' + element.id + ')">Edit</button>' +
                    '</div>' +
                    '<button class="btn btn-outline-danger" id="delete-'+ element.id +'" onclick="deleteSpace(' + element.id + ')">Delete</button>' +
                '</td>' +
            '</tr>';
    });

    tableValue += '</tbody></table>';
    spacesDiv.innerHTML = tableValue;
}

sayHello = () => {
    alert("Hello!");
}

editSpace = (id) => {
    alert('edit space ' + id);

    //change edit button to save
    const btn = document.getElementById('edit-' + id);
    const buttonsDiv = document.getElementById('btns-div-' + id);

    //check button label
    if(btn.innerHTML === 'Edit'){
        btn.innerHTML = 'Save'; 
        btn.className = 'btn btn-success';

        //add cancel button
        buttonsDiv.innerHTML += '<button class="btn btn-outline-warning" id="cancel-'+ id +'" onclick="cancelEdit(' + id + ')">Cancel</button>';

        //change title cell to input
        const titleTd = document.getElementById('title-' + id);
        const titleValue = titleTd.innerHTML;
        titleTd.innerHTML = '<input type="text" id="input-title-' + id + '" value="' + titleValue + '">';

        //change title cell to input
        const categoryTd = document.getElementById('category-' + id);
        const categoryText = categoryTd.innerHTML;
        categoryTd.innerHTML = '';

        //Create and append select list
        var dropdown = document.createElement("select");
        dropdown.id = "category-select-" + id;
        categoryTd.appendChild(dropdown);

        //get categories
        const xhr = new XMLHttpRequest();
        xhr.open('GET', ROOT_API_URL + '/category', true);
        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // display in table
                const list = JSON.parse(this.response);
                //Create and append the options
                list.forEach(function(element) {
                    console.log(element);

                    const opt = document.createElement("option"); 
                    opt.text = element.name;
                    opt.value = element.id;
                    console.log(categoryText, ' === ', element.name);
                    if(categoryText  === element.name) {
                        opt.selected = true;
                    }
                    dropdown.options.add(opt);
                    
                });
            }else if (this.readyState === XMLHttpRequest.DONE && this.status === 401){
                alert("You need to be logged in or with an access to view this page.");
                window.location.replace(ROOT_FE_URL + '/login.html');
            }
        }
            
        xhr.ontimeout = function () {
            reject('timeout')
            }
    
        xhr.send();


        //change daily rate cell to input
        const dailyRateTd = document.getElementById('daily-rate-' + id);
        const dailyRateValue = dailyRateTd.innerHTML;
        dailyRateTd.innerHTML = '<input type="text" id="input-daily-rate-' + id + '" value="' + dailyRateValue + '">';

        //change description cell to input
        const descriptionTd = document.getElementById('description-' + id);
        const descriptionValue = descriptionTd.innerHTML;
        descriptionTd.innerHTML = '<input type="text" id="input-description-' + id + '" value="' + descriptionValue + '">';

        //change address cell to input
        const addressTd = document.getElementById('address-' + id);
        const addressValue = addressTd.innerHTML;
        addressTd.innerHTML = '<input type="text" id="input-address-' + id + '" value="' + addressValue + '">';

    }else if(btn.innerHTML === 'Save'){
        console.log('Save spaces and reload page.');

        const userIdTd = document.getElementById('user-id-' + id);
        const availableFromTd = document.getElementById('available-from-' + id);
        const availableToTd = document.getElementById('available-to-' + id);

        const updatedSpace = {
            id: id,
            userId: userIdTd.innerHTML,
            title: document.getElementById('input-title-' + id).value,
            categoryId: document.getElementById('category-select-' + id).value, //document.getElementById('category-' + id).value,
            description: document.getElementById('input-description-' + id).value,
            dailyRate: document.getElementById('input-daily-rate-' + id).value,
            address: document.getElementById('input-address-' + id).value,
            availableFrom : availableFromTd.innerHTML,
            availableTo : availableToTd.innerHTML,
        }
        console.log(updatedSpace);

        sendRequest('PUT', '/space', updatedSpace, 200, false);
    }
    
}

cancelEdit = (id) => {
    getMySpaces();
}

deleteSpace = (id) => {
    let confirmed = confirm("Are you sure you want to delete this space?");

    if(confirmed){
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', ROOT_API_URL + '/space/' + id, true);
        xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
                console.log("status was okay");
                console.log(this.response);
                // resolve(xhr.response);

                getMySpaces();
            }else if (this.readyState === XMLHttpRequest.DONE && this.status === 401){
                console.log("request failed");
                console.log('status for failing: ', this.status);
                // reject(xhr.status);
                // access issue, redirect to login
                alert("You need to be logged in or with an access to view this page.");
                window.location.replace(ROOT_FE_URL + '/login.html');
            }
        }
        
        xhr.ontimeout = function () {
            reject('timeout')
        }

        xhr.send();
    }
}

initializeSpaceForm = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', ROOT_API_URL + '/category', true);
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log("status was okay");
            console.log(this.response);
            // resolve(xhr.response);

            // display in table
            displayCategories(JSON.parse(this.response));
        }else if (this.readyState === XMLHttpRequest.DONE && this.status === 401){
            console.log("request failed");
            console.log('status for failing: ', this.status);
            // reject(xhr.status);
            // access issue, redirect to login
            alert("You need to be logged in or with an access to view this page.");
            window.location.replace(ROOT_FE_URL + '/login.html');
        }
    }
      
    xhr.ontimeout = function () {
        reject('timeout')
      }

    xhr.send();
}

displayCategories = (list) => {
    console.log('list: ', [...list]);

    const dropdown = document.getElementById("category");

    list.forEach(function(element) {
        console.log(element);

        const opt = document.createElement("option"); 
        opt.text = element.name;
        opt.value = element.id;
        dropdown.options.add(opt);
        
    });

}
