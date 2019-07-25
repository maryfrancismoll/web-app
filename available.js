
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

sendRequestForList = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', ROOT_API_URL + url, true);
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

getAvailableSpaces = () => {
    //
    sendRequestForList('/book');

    const categoryRequest = new XMLHttpRequest();
    categoryRequest.open('GET', ROOT_API_URL + '/category', true);
    categoryRequest.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log("status was okay");
            console.log(this.response);
            
            // display in table
            displayCategories(JSON.parse(this.response));
        }else if (this.readyState === XMLHttpRequest.DONE && this.status === 401){
            console.log("request failed");
            console.log('status for failing: ', this.status);
            // access issue, redirect to login
            alert("You need to be logged in or with an access to view this page.");
            window.location.replace(ROOT_FE_URL + '/login.html');
        }
    }
      
    categoryRequest.ontimeout = function () {
        reject('timeout')
      }

      categoryRequest.send();
}

displaySpaces = (list) => {
    console.log('list: ', [...list]);

    //get element where the table will be placed
    const spacesDiv = document.getElementById('available-div');
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
                '<td><button id="edit-'+ element.id +'" onclick="bookSpace(' + element.id + ')">Book</button></div>' +
                '</td>' +
            '</tr>';
    });

    tableValue += '</tbody></table>';
    spacesDiv.innerHTML = tableValue;
}

displayCategories = (list) => {
    console.log('list: ', [...list]);

    const dropdown = document.getElementById("category");

    let opt = document.createElement("option"); 
        opt.text = 'All';
        opt.value = 0;
        dropdown.options.add(opt);

    list.forEach(function(element) {
        console.log(element);

        opt = document.createElement("option"); 
        opt.text = element.name;
        opt.value = element.id;
        dropdown.options.add(opt);
        
    });

}

filterList = () => {
    //get filters
    const categoryId = document.getElementById('category').value;
    const start_date = document.getElementById('start_date').value;
    const end_date = document.getElementById('end_date').value;

    console.log(categoryId, " : ", start_date, " : ", end_date);
    alert("pause...");

    let params = '';
    if (categoryId > 0){
        params += 'categoryId=' + categoryId + '&';
    }
    if(start_date !== ''){
        params += 'from=' + start_date + '&';
    }
    if(end_date !== ''){
        params += 'to=' + end_date;
    }

    console.log('params: ', params);
    sendRequestForList('/book?' + params);
    alert('pause again');
}

bookSpace = (id) => {
    //validate start and end dates
    if (document.getElementById('start_date').value === '' || document.getElementById('end_date').value === ''){
        alert('Please specify dates. ');
        return;
    }

    //create the obect
    const booking = {
        spaceId : id,
        from : document.getElementById('start_date').value,
        to : document.getElementById('end_date').value,
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', ROOT_API_URL + '/book', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("Authorization", 'Bearer ' + getToken());
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 201) {
            // Request finished. Do processing here.
            console.log("status was okay");
            alert(this.response);
            
            
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

    xhr.send(JSON.stringify(booking));
}