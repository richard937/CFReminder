var userID;
var count;

// chrome.browserAction.setBadgeText({ text: '5' });

//gets the last username and set it to the variable

chrome.storage.sync.get("CFhandle", function (data) {
    if (!chrome.runtime.error) {
        console.log(data);
        userID = data.CFhandle;
    }
});


//gets the details of last contest and set the value

let array = ["contestName", "notSolved"];

chrome.storage.sync.get(array, function (data) {
    if (!chrome.runtime.error) {
        console.log(data);
        document.getElementById("contest-name").innerHTML = data.contestName;
        document.getElementById("unsolved").innerHTML = data.notSolved;
        count = data.notSolved;
        count = count.toString();
        chrome.browserAction.setBadgeText({ text: count });
    }
});

// chrome.browserAction.setBadgeText({ text: count });

document.getElementById("sync_button").addEventListener('click', function () {
    getContestID();
});



//function to get the ID of last contest

// issue: need to fetch the last div2 contest;
// logic: if the last contest is div1 then increse the id to 1;

function getContestID() {
    let request = new XMLHttpRequest();
    let url = "https://codeforces.com/api/contest.list";
    let id;

    request.open('GET', url, true);
    request.send();

    request.onload = function () {

        // Begin accessing JSON data here
        var json = JSON.parse(this.response)
        if (json.status == "OK") {
            var arr = json.result;
            var len = arr.length;

            for (let index = 0; index < len; index++) {
                obj = arr[index];
                if (obj.phase == "FINISHED") {
                    id = obj.id;
                    document.getElementById("contest-name").innerHTML = obj.name;

                    //sets new last contest name
                    chrome.storage.sync.set({
                        "contestName": obj.name,
                    });

                    break;
                }
            }
        } else {
            console.log('error');
        }

        //console.log(id);
        getContestDetails(id);
    }
    //console.log(id); //not accessible
}



//function to get all the problems of a contest
function getContestDetails(id) {


    var request = new XMLHttpRequest();
    let contestID = id;
    let link = `https://codeforces.com/api/contest.standings?contestId=${contestID}`;

    request.open('GET', link, true);
    request.send();

    request.onload = function () {

        // Begin accessing JSON data here
        var json = JSON.parse(this.response)

        if (json.status == "OK") {
            var arr = json.result.problems;
            var len = arr.length;

            for (let index = 0; index < len; index++) {

                var object = arr[index];
                //console.log(object.name);

                var problems = document.getElementById("problems");

                var child = document.createElement("tr");
                child.setAttribute("id", object.index);

                var first = document.createElement("td");
                first.innerHTML = object.index;
                child.appendChild(first);
                var second = document.createElement("td");

                var a = document.createElement("a");
                var cfLink = `https://codeforces.com/contest/${contestID}/problem/${object.index}`;
                a.setAttribute("href", cfLink);
                a.setAttribute("target", "blank");
                a.innerHTML = object.name;
                second.appendChild(a);
                child.appendChild(second);

                problems.appendChild(child);

            }
            //console.log(id);
            getContest(id, len);

        } else {
            console.log('error')
        }
    }

}



//function to get correct submission
function getContest(id, len) {

    var request = new XMLHttpRequest();
    let contestID = id;
    let link = `https://codeforces.com/api/contest.status?contestId=${contestID}&handle=${userID}`;

    request.open('GET', link, true);
    request.send();

    request.onload = function () {

        // Begin accessing JSON data here
        var json = JSON.parse(this.response)

        if (json.status == "OK") {
            var arr = json.result;
            var sublen = arr.length;
            let set = new Set();

            for (let index = 0; index < sublen; index++) {
                var object = arr[index];
                if (object.verdict = 'OK') {
                    var ID = object.problem.index;
                    var question = document.getElementById(ID);
                    question.style.backgroundColor = '#d6f6ca';
                    set.add(ID);
                }

            }
            let solved = set.size;
            let unsolved = len - solved;

            document.getElementById("questions-block").style.display = "block";
            document.getElementById("unsolved").innerHTML = unsolved;

            //sets new unsolved no of questions
            chrome.storage.sync.set({
                "notSolved": unsolved,
            });

        } else {
            console.log('error')
        }
    }
}


