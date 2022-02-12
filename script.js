import $ from 'jquery'
import './style.scss'

// create variable for later use
var dateAsc = false
var nameAsc = false

$.getJSON("https://api.github.com/repositories/19438/commits", function (data) {
    var items = [];
    $.each(data, function (key, val) {
        // this is to get the date form the json array and format it in m/d/y so that it is readable
        var date = new Date(val['commit']['committer']['date'])
        var formattedDate = [
            ('0' + (date.getMonth() + 1)).slice(-2),
            ('0' + date.getDate()).slice(-2),
            date.getFullYear()
        ].join('-')

        // add each set of data into an array so that we can display the info
        items.push("<tr id='row'><td id='" + (key) + "'>" + val['commit']['author']['name'] + "</td><td id='" + (key) + "'>" + formattedDate + "</td><td id='" + (key) + "'>" + val['commit']['message'] + "</td><td id='" + (key) + "'>" + val['commit']['url'] + "</td></tr>");

    });
    // add all info from the array into the table
    $('tbody').append(items)
});

// function to create an array based off of what is currently displayed
function createArray() {
    var commits = [];
    var rows = document.querySelectorAll('#row');
    // iterate through all of the rows in the table
    Array.from(rows).forEach(function (el) {
        var td = el.querySelectorAll('td');
        var items = []
        // iterate all of the values within the row and add their inner value to an array
        Array.from(td).forEach(function (item, key) {
            items.push(item.innerText)
        })
        // add each value into an array
        commits.push({
            "name": items[0],
            "date": items[1],
            "message": items[2],
            "url": items[3]
        })
    });
    return commits

}

// function to replace data displayed with sorted data
function replaceWithSort(array) {
    var commits = [];
    var rows = document.querySelectorAll('#row');

    Array.from(rows).forEach(function (el, count) {
        var td = el.querySelectorAll('td');
        Array.from(td).forEach(function (item, key) {
            if (key == 0) {
                $(item).text(array[count]['name'])
            }
            if (key == 1) {
                $(item).text(array[count]['date'])
            }
            if (key == 2) {
                $(item).text(array[count]['message'])
            }
            if (key == 3) {
                $(item).text(array[count]['url'])
            }
        })
    });
    return commits
}

// function to sort the array in ascending alphabetical order
function sortAlphabeticalAsc() {
    var commits = createArray()
    commits.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
    replaceWithSort(commits)
}

// function to sort the array in descending alphabetical order
function sortAlphabeticalDesc() {
    var commits = createArray()
    commits.sort((a, b) => b.name !== a.name ? b.name < a.name ? -1 : 1 : 0);
    replaceWithSort(commits)
}

// detect the name heading click and depending on what the current state of the sort is run the appropriate sorting function
$('#authorName').click(function () {
    if (nameAsc == true) {
        sortAlphabeticalDesc()
        $('#authorName svg').css('transform', 'rotate(180deg)')
    } else {
        sortAlphabeticalAsc()
        $('#authorName svg').css('transform', 'rotate(0deg)')
    }
    nameAsc = !nameAsc
})

// detect the date heading click and depending on what the current state of the sort is run the appropriate sorting function
$('#date').click(function () {
    if (dateAsc == true) {
        sortDateDesc()
        $('#date svg').css('transform', 'rotate(180deg)')
    } else {
        sortDateAsc()
        $('#date svg').css('transform', 'rotate(0deg)')
    }
    dateAsc = !dateAsc
})

// function to sort the array in ascending date order
function sortDateAsc() {
    var commits = createArray()
    commits.sort((a, b) => new Date(a.date) - new Date(b.date))

    // sort oldest to newest
    replaceWithSort(commits)
}

// function to sort the array in descending date order
function sortDateDesc() {
    var commits = createArray()
    commits.sort((a, b) => (new Date(b.date) - new Date(a.date)))
    // sort newest to oldest
    replaceWithSort(commits)
}