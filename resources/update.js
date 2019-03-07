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

if (args.length !== 3) {
    console.log("Wrong number of arguments");
    phantom.exit();
}

var filepath = args[1];
var outputpath = args[2];

var pages = [
    { season: "2016-2017", page: "3316" },
    { season: "2017-2018", page: "3750" },
    { season: "2018-2019", page: "4363" },
]

var content = fs.read(filepath);

var urlBase = "http://stat.ffrs.asso.fr/stats/match/"

var steps = [
    {
        args: {},
        call:
            function (x) {
                // we first need a cookie from stat.ffrs.asso.fr
                page.open('http://stat.ffrs.asso.fr/stats/statistique/index/RILH?bandeau=1/')
            }
    }
]

for (var idx = 0; idx < pages.length; idx++) {
    var pageToLoad = urlBase + 'resultats/' + pages[idx].page
    var season = pages[idx].season;
    steps.push({
        args: { pageToLoad },
        call: function (x) {
            console.log(x.pageToLoad)
            page.open(x.pageToLoad)
        }
    });
    steps.push({
        args: {}, call: function (x) {
            page.evaluate(function () {
                var num = document.getElementById('numero');
                num.selectedIndex = 1;
                num.onchange();
            });
        }
    });
    steps.push({
        args: { season }, call: function (x) {
            const season = x.season;
            console.log('season:' + season)
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
                            ateam: tables[i].rows[j].cells[4].innerText.trim().replace(" PN", ""),
                            ascore: scores[0].trim(),
                            bscore: scores[1].trim(),
                            bteam: tables[i].rows[j].cells[6].innerText.trim().replace(" PN", "")
                        });
                    }
                }
                return results
            });
            var toReplace = '\|results:' + season + '\|';
            console.log('toReplace:' + toReplace);
            content = content.replace(toReplace, JSON.stringify(results));
        }
    });
}


for (var idx = 0; idx < pages.length; idx++) {
    var pageToLoad = urlBase + 'classement/' + pages[idx].page
    var season = pages[idx].season;
    steps.push({
        args: { pageToLoad },
        call: function (x) {
            console.log(x.pageToLoad)
            page.open(x.pageToLoad)
        }
    });

    steps.push({
        args: { season }, call: function (x) {
            var season = x.season;
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
            var toReplace = '\|rankings:' + season + '\|';
            console.log('toReplace:' + toReplace);
            content = content.replace(toReplace, JSON.stringify(rankings));
        }
    });
}

steps.push({
    call: function () {
        console.log(content);
        fs.write(outputpath, content, 'w');
        phantom.exit();
    }
});

interval = setInterval(function () {
    var step = steps[testindex];
    if (!loadInProgress && typeof step.call == "function") {
        console.log("step " + (testindex + 1));
        step.call(step.args);
        testindex++;
    }
    if (typeof step.call != "function") {
        console.log("test complete!");
        phantom.exit();
    }
}, 50);
