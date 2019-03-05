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

var urlBase = "http://stat.ffrs.asso.fr/stats/match/resultats/"

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
        page.evaluate(function () {
            var num = document.getElementById('numero');
            num.selectedIndex = 1;
            num.onchange();
        });
    },
    function () {
        var results = page.evaluate(function () {
            var tables = document.getElementsByTagName("table");
            var captions = document.getElementsByTagName('caption');
            var results = []
            for (var i = 0; i < tables.length; i++) {
                var date = captions[i].innerText.replace(/\//gm, '-')
                for (var j = 1; j < tables[i].rows.length; j++) {
                    var score = tables[i].rows[j].cells[5].innerText
                    var scores = score.replace(/(\r\n|\n|\r)/g, '').split('-')
                    results.push({
                        date: date,
                        day: tables[i].rows[j].cells[1].innerText.trim(),
                        schedule: tables[i].rows[j].cells[2].innerText.trim(),
                        place: tables[i].rows[j].cells[3].innerText.trim(),
                        teamA: tables[i].rows[j].cells[4].innerText.trim().replace(" PN", ""),
                        scoreA: scores[0].trim(),
                        scoreB: scores[1].trim(),
                        teamB: tables[i].rows[j].cells[6].innerText.trim().replace(" PN", "")
                    });
                }
            }
            return results
        });
        var filename = 'v2_results_' + season + '.json';
        fs.write(filename, JSON.stringify(results), 'w');
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