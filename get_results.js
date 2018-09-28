var fs = require('fs');

var page = new WebPage(), testindex = 0, loadInProgress = false;

page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.onLoadStarted = function () {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function () {
    loadInProgress = false;
    console.log("load finished");
};



var steps = [
    function () {
        //Load Login Page
        page.open('http://stat.ffrs.asso.fr/stats/match/resultats/3750');
    },
    function () {
        page.evaluate(function () {
            var num = document.getElementById('numero');
            num.selectedIndex = 1;
            num.onchange();
        });
    },
    function () {
        page.evaluate(function () {
            console.log(document.getElementById('numero').innerHTML);
        })
    },
    function () {
        var allResults = page.evaluate(function () {
            var tables = document.getElementsByTagName("table");
            var captions = document.getElementsByTagName('caption');
            var results = []
            for (var i = 0; i < tables.length; i++) {
                var array = []
                for (var j = 1; j < tables[i].rows.length; j++) {
                    var score = tables[i].rows[j].cells[5].innerText
                    var scores = score.replace(/(\r\n|\n|\r)/g, '').split('-')
                    array.push({
                        day: tables[i].rows[j].cells[1].innerText.trim(),
                        schedule: tables[i].rows[j].cells[2].innerText.trim(),
                        place: tables[i].rows[j].cells[3].innerText.trim(),
                        teamA: tables[i].rows[j].cells[4].innerText.replace(/\sPN/g, '').trim(),
                        scoreA: scores[0].trim(),
                        scoreB: scores[1].trim(),
                        teamB: tables[i].rows[j].cells[6].innerText.replace(/\sPN/g, '').trim()
                    });
                }
                results.push({
                    date: captions[i].innerText.replace(/\//gm, '-'),
                    results: array
                });
            }
            return results
        });
        for (var i = 0; i < allResults.length; i++) {
            var date = allResults[i].date;
            var dates = date.split('-');
            var reversedDate = dates[2] + '-' + dates[1] + '-' + dates[0]
            for (var j = 0; j < allResults[i].results.length; j++) {
                var teamA = allResults[i].results[j].teamA.replace(/\s/gm, '-');
                var teamB = allResults[i].results[j].teamB.replace(/\s/gm, '-');
                var filename = 'content/results/seasons/2017-2018/' + reversedDate + '_' + teamA + '_' + teamB + '.md';
                fs.write(filename,
                    '---\n'
                    + 'day: "' + date + '"\n'
                    + 'schedule: "' + allResults[i].results[j].schedule + '"\n'
                    + 'place: "' + allResults[i].results[j].place + '"\n'
                    + 'ateam: "' + allResults[i].results[j].teamA + '"\n'
                    + 'bteam: "' + allResults[i].results[j].teamB + '"\n'
                    + 'ascore: "' + allResults[i].results[j].scoreA + '"\n'
                    + 'bscore: "' + allResults[i].results[j].scoreB + '"\n'
                    + 'season: "2017-2018"\n'
                    + '---\n'
                    , 'w');
            }
        }
        console.log(JSON.stringify(allResults));
    },

    function () {
        console.log("test complete!");
        phantom.exit();
    }
]



interval = setInterval(function () {
    if (!loadInProgress && typeof steps[testindex] == "function") {
        console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
}, 50);