var pages = [
  {season: '2016-2017', page: '3316'},
  {season: '2017-2018', page: '3750'},
  {season: '2018-2019', page: '4363'},
];

var base = 'http://stat.ffrs.asso.fr/stats/match/';

function cleanDate(x) {
  return x.innerText.replace(/\//gm, '-');
}

function cleanScores(score) {
  return score.replace(/(\r\n|\n|\r)/g, '').split('-');
}

function clean(x) {
  return x.innerText.trim();
}

function team(x) {
  return x.replace(' PN', '');
}

function transformResults(document) {
  const tables = document.getElementsByTagName('table');
  const captions = document.getElementsByTagName('caption');
  var results = [];
  for (var i = 0; i < tables.length; i++) {
    const date = cleanDate(captions[i]);
    for (var j = 1; j < tables[i].rows.length; j++) {
      const cells = tables[i].rows[j].cells;
      const scores = cleanScores(cells[5].innerText);
      results.push({
        date: date,
        day: clean(cells[1]),
        schedule: clean(cells[2]),
        place: clean(cells[3]),
        ateam: team(clean(cells[4])),
        ascore: scores[0].trim(),
        bscore: scores[1].trim(),
        bteam: team(clean(cells[6]))
      });
    }
  }
  return results;
}

function transformRankings(document) {
  const tables = document.getElementsByTagName('table');
  var rankings = [{
    rank: 'Pl',
    teams: 'Equipe',
    points: 'Pts',
    played: 'J.',
    wins: 'V.',
    draws: 'E.',
    loses: 'P.',
    forfaited: 'F.',
    goals: 'buts',
    goalsAllowed: 'BE.',
    goalsDiff: 'diff.',
  }];
  for (var i = 0; i < tables.length; i++) {
    for (var j = 1; j < tables[i].rows.length; j++) {
      const cells = tables[i].rows[j].cells;
      rankings.push({
        rank: clean(cells[0]),
        teams: team(clean(cells[1])),
        points: clean(cells[2]),
        played: clean(cells[3]),
        wins: clean(cells[4]),
        draws: clean(cells[5]),
        loses: clean(cells[6]),
        forfaited: clean(cells[7]),
        goals: clean(cells[8]),
        goalsAllowed: clean(cells[9]),
        goalsDiff: clean(cells[10]),
      })
    }
  }
  return rankings;
};

function transformPlayers(document) {
  const tables = document.getElementsByTagName('table');
  var players = [{
    rank: 'Pl',
    player: 'Joueur',
    team: 'Equipe',
    games: 'Matchs',
    goals: 'Buts',
    passes: 'Passes',
    points: 'Points',
    box: 'Pénalités',
  }];
  for (var i = 0; i < tables.length; i++) {
    for (var j = 1; j < tables[i].rows.length; j++) {
      const cells = tables[i].rows[j].cells;
      players.push({
        rank: clean(cells[0]),
        players: clean(cells[1]),
        teams: team(clean(cells[2])),
        games: clean(cells[3]),
        goals: clean(cells[4]),
        passes: clean(cells[5]),
        points: clean(cells[6]),
        box: clean(cells[7]).replace(' "', ''),
      });
    }
  }
  return players
};

function updateContent(toReplace, newContent) {
  cy.readFile('src/stores/seasons.js.temp').then(function(content) {
    content = content.replace(toReplace, newContent)
    cy.writeFile('src/stores/seasons.js.temp', content);
  });
}

function transformSeason(season, pageID) {
  const resultsPage = base + 'resultats/' + pageID;
  cy.visit(resultsPage);
  cy.wait(2000);
  cy.get('#numero').select('ALL');
  cy.wait(2000);

  cy.document().then(function(document) {
    const results = transformResults(document, season);

    const toReplace = '\|results:' + season + '\|';
    updateContent(toReplace, JSON.stringify(results));
    cy.log('season:' + season);
  });

  const rankingPage = base + 'classement/' + pageID;
  cy.visit(rankingPage);
  cy.wait(2000);
  cy.document().then(function(document) {
    const rankings = transformRankings(document)

    const toReplace = '\|rankings:' + season + '\|';
    updateContent(toReplace, JSON.stringify(rankings));
    cy.log('season:' + season);
  });

  const playersPage = base + 'buteurs/' + pageID;
  cy.visit(playersPage);
  cy.wait(2000);
  cy.document().then(function(document) {
    const players = transformPlayers(document);

    const toReplace = '\|players:' + season + '\|';
    updateContent(toReplace, JSON.stringify(players));
    cy.log('season:' + season);
  });
}

context('My First Test', function() {
  it('Does not do much!', function() {
    cy.visit(
        'http://stat.ffrs.asso.fr/stats/statistique/index/RILH?bandeau=1/');
    // cy.wait(1000);
    cy.getCookie('_ffrs_session').should('exist');

    cy.readFile('src/stores/seasons.js.in').then(function(content) {
      cy.writeFile('src/stores/seasons.js.temp', content);
    });

    for (var idx = 0; idx < pages.length; idx++) {
      const season = pages[idx].season;
      const pageID = pages[idx].page;
      transformSeason(season, pageID)
      cy.wait(30000);
    }

    cy.readFile('src/stores/seasons.js.temp').then(function(content) {
      cy.writeFile('src/stores/seasons.final.js', content);
    });
  });
})