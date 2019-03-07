var fs = require('fs');
var system = require('system');
var args = system.args;

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

if (args.length !== 2) {
    console.log("Wrong number of arguments");
    phantom.exit();
}

var season = args[1];

var pages = {
    "2016-2017": "3316",
    "2017-2018": "3750",
    "2018-2019": "4363",
}


if (pages[season] == undefined) {
    console.log("Season " + season + " not yet supported");
    phantom.exit();
}

var urlBase = "http://stat.ffrs.asso.fr/stats/match/classement/"

var url = urlBase + pages[season]

var steps = [
    function () {
        // we first need a cookie from stat.ffrs.asso.fr
        page.open('http://stat.ffrs.asso.fr/stats/statistique/index/RILH?bandeau=1/')
    },
    function () {
        page.open(url)
    },
    function () {
        var rankings = page.evaluate(function () {
            var tables = document.getElementsByTagName("table");
            var rankings = [
                {
                    rank: 'Pl',
                    teams: 'Equipe',
                    points: 'Pts',
                    played: "J.",
                    wins: 'V.',
                    draws: 'E.',
                    loses: 'P.',
                    forfaited: 'F.',
                    goals: 'buts',
                    goalsAllowed: 'BE.',
                    goalsDiff: 'diff.',
                }]
            for (var i = 0; i < tables.length; i++) {
                for (var j = 1; j < tables[i].rows.length; j++) {
                    rankings.push(
                        {
                            rank: tables[i].rows[j].cells[0].innerText.trim(),
                            teams: tables[i].rows[j].cells[1].innerText.trim().replace(" PN", ""),
                            points: tables[i].rows[j].cells[2].innerText.trim(),
                            played: tables[i].rows[j].cells[3].innerText.trim(),
                            wins: tables[i].rows[j].cells[4].innerText.trim(),
                            draws: tables[i].rows[j].cells[5].innerText.trim(),
                            loses: tables[i].rows[j].cells[6].innerText.trim(),
                            forfaited: tables[i].rows[j].cells[7].innerText.trim(),
                            goals: tables[i].rows[j].cells[8].innerText.trim(),
                            goalsAllowed: tables[i].rows[j].cells[9].innerText.trim(),
                            goalsDiff: tables[i].rows[j].cells[10].innerText.trim(),
                        }
                    )
                }
            }
            return rankings
        });
        console.log("rankings: " + JSON.stringify(rankings));
        var filename = 'v2_rankings' + season + '.json';
        fs.write(filename, JSON.stringify(rankings), 'w');
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