var handle = document.getElementById("username");

//gets the 'info' object and sets the input value
chrome.storage.sync.get("CFhandle", function (data) {
    if (!chrome.runtime.error) {
        console.log(data.CFhandle);
        handle.value = data.CFhandle;
    }
});


document.getElementById("user_button").addEventListener('click', function () {
    getDetails();
});

// function to get details of a user
function getDetails() {
    var request = new XMLHttpRequest();

    var url = "http://codeforces.com/api/user.info?handles=";
    var username = handle.value;

    info = {
        "CFhandle": username,
    };

    //saves the 'info' object
    chrome.storage.sync.set(info, function () {
        if (!chrome.runtime.error) {
            console.log("Username Updated");
            console.log(info);
        }
    })

    request.open('GET', url + username, true)
    request.onload = function () {

        // Begin accessing JSON data here
        var json = JSON.parse(this.response)

        if (json.status == "OK") {
            var object = json.result[0];

            var photo = `https:${object.titlePhoto}`;
            document.getElementById("photo").setAttribute("src", photo);

            var fullName = `${object.firstName} ${object.lastName}`;
            document.getElementById("name").innerHTML = fullName;

            var rating = object.rating;
            document.getElementById("rating").innerHTML = rating;

            var rank = object.rank;
            document.getElementById("rank").innerHTML = rank;

            var college = object.organization;
            document.getElementById("college").innerHTML = college;

            var city = object.city;
            document.getElementById("city").innerHTML = city;

            document.getElementById("profile").style.display = "block";

        } else {
            console.log('error')
        }
    }

    request.send()
}