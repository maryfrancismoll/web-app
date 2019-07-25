
const getToken = () => {
    //get token from session storage
    const token = sessionStorage.getItem('webapp');
    if(!token){
        alert("You need to be logged in to post a space.");
        //redirect user to login
        window.location.replace( ROOT_FE_URL + "/login.html");
    }
    return token;
}

const getAllCategories = () => {
    const categoriesDiv = document.getElementById('categories-div');

    const xhr = new XMLHttpRequest();
    xhr.open('GET', ROOT_API_URL + '/category', true);
    xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
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

const displayCategories = (list) => {
    //get element where the table will be placed
    const categoriesDiv = document.getElementById('categories-div');
    let tableValue = 
        '<table class="table table-hover table-bordered">' + 
            '<thead>' +
                '<tr>' + 
                    '<th>Name</th>' + 
                    '<th>Description</th>' + 
                    '<th>Action</th>' + 
                '</tr>' +
            '</thead>' + 
            '<tbody>';

    list.forEach(function(element) {
        console.log(element);
        tableValue += 
            '<tr id="'+ element.id +'">' +
                '<td id="name-'+ element.id +'">' + element.name + '</td>' +
                '<td id="description-'+ element.id +'">' + element.description + '</td>' +
                '<td>' + 
                    '<div id="btns-div-'+ element.id +'">' +
                        '<button class="btn btn-primary" id="edit-'+ element.id +'" onclick="editCategory(' + element.id + ')">Edit</button>' +
                    '</div>' +
                    '<button class="btn btn-outline-danger" id="delete-'+ element.id +'" onclick="deleteCategory(' + element.id + ')">Delete</button>' +
                '</td>' +
            '</tr>';
    });

    tableValue += '</tbody></table>';
    categoriesDiv.innerHTML = tableValue;
}

const saveNewCategory = () => {
    //get values from form
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    
    //TODO: validate

    //save
    const category = {
        name: name,
        description: description,
    }

    sendRequest('POST', '/category', category, 201, true);
}

const editCategory = (id) => {
    //change edit button to save
    const btn = document.getElementById('edit-' + id);
    const buttonsDiv = document.getElementById('btns-div-' + id);

    //check button label
    if(btn.innerHTML === 'Edit'){ 
        btn.innerHTML = 'Save'; 
        btn.classList = "btn btn-success";

        //add cancel button
        buttonsDiv.innerHTML += '<button class="btn btn-outline-warning" id="cancel-'+ id +'" onclick="cancelEdit(' + id + ')">Cancel</button>';

        //change title cell to input
        const nameTd = document.getElementById('name-' + id);
        const nameValue = nameTd.innerHTML;
        nameTd.innerHTML = '<input type="text" id="input-name-' + id + '" value="' + nameValue + '">';

        //change description cell to input
        const descriptionTd = document.getElementById('description-' + id);
        const descriptionValue = descriptionTd.innerHTML;
        descriptionTd.innerHTML = '<input type="text" id="input-description-' + id + '" value="' + descriptionValue + '">';

    }else if(btn.innerHTML === 'Save'){
        console.log('Save category and reload page.');

        const updatedCategory = {
            id: id,
            name: document.getElementById('input-name-' + id).value,
            description: document.getElementById('input-description-' + id).value,
        }
        console.log(updatedCategory);

        sendRequest('PUT', '/category', updatedCategory, 200, false);
    }
}

const deleteCategory = (id) => {
    let confirmed = confirm("Are you sure you want to delete this category? Spaces with this category will be deleted too.");

    if(confirmed){
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', ROOT_API_URL + '/category/' + id, true);
        xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
                console.log("status was okay");
                console.log(this.response);
                // resolve(xhr.response);

                getAllCategories();
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

const cancelEdit = (id) => {
    getAllCategories();
}

const sendRequest = (method, url, body, successCode, reloadPage) => {
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
            //reload table
            if(reloadPage){
                window.location.replace(ROOT_FE_URL + '/categories.html');
            }else{
                getAllCategories();
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