import { Store } from 'svelte/store.js';
export default new Store({
  pages: [
    { name: "Accueil", link: "home" },
    { name: "Equipes", link: "teams" },
    { name: "Competition", link: "competition" },
    { name: "Contact", link: "contact" }
  ],
  selectedPage: 'home',
  teams: [
    {
      name: "Enfants loisir",
      schedules: ["Samedi: 14h à 16h"],
      description: 'Apprentissage des bases du roller afin de pouvoir evoluer en toute autonomie.',
      gears: [
        { name: "Roller", description: "pas de roues noires, ni de freins." },
      ]
    },
    {
      name: "Roller hockey enfants",
      schedules: ["Samedi: 14h à 16h"],
      description: 'Initiation et pratique du Roller Hockey.',
      gears: [
        { name: "Roller", description: "pas de roues noires, ni de freins" },
        { name: "Crosse", description: "type hockey sur glace" },
        { name: "Jambières", description: "" },
        { name: "Coudières", description: "" },
        { name: "Coquille", description: "pour les filles coquille adaptée" },
        {
          name: "Protège poitrine",
          description: "pour les filles uniquement"
        },
        { name: "Casque", description: "avec protection faciale intégrale" },
        { name: "Protège cou", description: "" },
        { name: "Gants de hockey", description: "" }
      ]
    },
    {
      name: "Roller hockey pre-nationale",
      schedules: ["Mardi: 19h30 à 21h", "Jeudi: 19h30 à 21h"],
      description: 'Competition de roller hockey adulte.',
      gears: [
        { name: "Roller", description: "pas de roues noires, ni de freins" },
        {
          name: "Crosse",
          description:
            "type hockey sur glace, prévoir une deuxième de secours"
        },
        { name: "Jambières", description: "" },
        {
          name: "Coudières",
          description: "les fitness sont acceptées cependant déconseillées"
        },
        {
          name: "Casque",
          description: "avec protection faciale pour les mineurs(es)"
        },
        { name: "Gants de hockey", description: "" },
        { name: "Coquille", description: "" },
        {
          name: "Pantalon",
          description: "recouvrant l’ensemble des protections"
        },
        { name: "culotte ou gaine", description: "facultatif" },
        { name: "gilet rembourré", description: "facultatif" },
        { name: "épaulettes rigides interdit", description: "" }
      ]
    }
  ],
  selectedSeason: "2018-2019",
  seasons: [
    {
      year: "2018-2019",
      rankings: [{ "draws": "E.", "forfaited": "F.", "goals": "buts", "goalsAllowed": "BE.", "goalsDiff": "diff.", "loses": "P.", "played": "J.", "points": "Pts", "rank": "Pl", "teams": "Equipe", "wins": "V." }, { "draws": "0", "forfaited": "0", "goals": "72", "goalsAllowed": "26", "goalsDiff": "46", "loses": "1", "played": "10", "points": "27", "rank": "1", "teams": "Amiens", "wins": "9" }, { "draws": "1", "forfaited": "1", "goals": "93", "goalsAllowed": "47", "goalsDiff": "46", "loses": "1", "played": "10", "points": "20", "rank": "2", "teams": "Dunkerque", "wins": "7" }, { "draws": "0", "forfaited": "0", "goals": "80", "goalsAllowed": "44", "goalsDiff": "36", "loses": "3", "played": "9", "points": "18", "rank": "3", "teams": "Bethune", "wins": "6" }, { "draws": "0", "forfaited": "0", "goals": "52", "goalsAllowed": "43", "goalsDiff": "9", "loses": "3", "played": "8", "points": "15", "rank": "4", "teams": "Pont de Metz", "wins": "5" }, { "draws": "1", "forfaited": "0", "goals": "49", "goalsAllowed": "78", "goalsDiff": "-29", "loses": "5", "played": "8", "points": "7", "rank": "5", "teams": "Valenciennes", "wins": "2" }, { "draws": "0", "forfaited": "0", "goals": "59", "goalsAllowed": "87", "goalsDiff": "-28", "loses": "8", "played": "10", "points": "6", "rank": "6", "teams": "Boulogne sur Mer", "wins": "2" }, { "draws": "0", "forfaited": "1", "goals": "39", "goalsAllowed": "119", "goalsDiff": "-80", "loses": "8", "played": "9", "points": "-2", "rank": "7", "teams": "Moreuil", "wins": "0" }],
      results: [
        {
          day: "21-10-2018",
          schedule: "10h00",
          place: "Boulogne",
          ateam: "BOULOGNE SUR MER",
          bteam: "AMIENS",
          ascore: "4",
          bscore: "7"
        },
        {
          day: "21-10-2018",
          schedule: "12h00",
          place: "Boulogne",
          ateam: "DUNKERQUE",
          bteam: "MOREUIL",
          ascore: "22",
          bscore: "2"
        },
        {
          day: "11-11-2018",
          schedule: "10h00",
          place: "Pont de Metz",
          ateam: "PONT DE METZ",
          bteam: "AMIENS",
          ascore: "2",
          bscore: "5"
        },
        {
          day: "11-11-2018",
          schedule: "12h00",
          place: "Pont de Metz",
          ateam: "BETHUNE",
          bteam: "DUNKERQUE",
          ascore: "1",
          bscore: "7"
        },
        {
          day: "11-11-2018",
          schedule: "14h00",
          place: "Pont de Metz",
          ateam: "BOULOGNE SUR MER",
          bteam: "MOREUIL",
          ascore: "12",
          bscore: "3"
        },
        {
          day: "18-11-2018",
          schedule: "10h00",
          place: "Moreuil",
          ateam: "MOREUIL",
          bteam: "PONT DE METZ",
          ascore: "4",
          bscore: "15"
        },
        {
          day: "18-11-2018",
          schedule: "12h00",
          place: "Moreuil",
          ateam: "BETHUNE",
          bteam: "VALENCIENNES",
          ascore: "16",
          bscore: "3"
        },
        {
          day: "18-11-2018",
          schedule: "14h00",
          place: "Moreuil",
          ateam: "DUNKERQUE",
          bteam: "AMIENS",
          ascore: "0",
          bscore: "5"
        },
        {
          day: "02-12-2018",
          schedule: "10h00",
          place: "Amiens",
          ateam: "AMIENS",
          bteam: "BETHUNE",
          ascore: "9",
          bscore: "5"
        },
        {
          day: "02-12-2018",
          schedule: "12h00",
          place: "Amiens",
          ateam: "PONT DE METZ",
          bteam: "BOULOGNE SUR MER",
          ascore: "7",
          bscore: "5"
        },
        {
          day: "02-12-2018",
          schedule: "14h00",
          place: "Amiens",
          ateam: "DUNKERQUE",
          bteam: "VALENCIENNES",
          ascore: "11",
          bscore: "11"
        },
        {
          day: "09-12-2018",
          schedule: "10h00",
          place: "Boulogne",
          ateam: "BETHUNE",
          bteam: "MOREUIL",
          ascore: "15",
          bscore: "2"
        },
        {
          day: "09-12-2018",
          schedule: "12h00",
          place: "Boulogne",
          ateam: "DUNKERQUE",
          bteam: "BOULOGNE SUR MER",
          ascore: "15",
          bscore: "6"
        },
        {
          day: "09-12-2018",
          schedule: "14h00",
          place: "Boulogne",
          ateam: "AMIENS",
          bteam: "VALENCIENNES",
          ascore: "10",
          bscore: "5"
        },
        {
          day: "16-12-2018",
          schedule: "10h00",
          place: "Pont de Metz",
          ateam: "VALENCIENNES",
          bteam: "MOREUIL",
          ascore: "15",
          bscore: "10"
        },
        {
          day: "16-12-2018",
          schedule: "12h00",
          place: "Pont de Metz",
          ateam: "BOULOGNE SUR MER",
          bteam: "BETHUNE",
          ascore: "3",
          bscore: "16"
        },
        {
          day: "16-12-2018",
          schedule: "14h00",
          place: "Pont de Metz",
          ateam: "PONT DE METZ",
          bteam: "DUNKERQUE",
          ascore: "7",
          bscore: "11"
        },
        {
          day: "13-01-2019",
          schedule: "10h00",
          place: "Moreuil",
          ateam: "MOREUIL",
          bteam: "AMIENS",
          ascore: "1",
          bscore: "8"
        },
        {
          day: "13-01-2019",
          schedule: "12h00",
          place: "Moreuil",
          ateam: "VALENCIENNES",
          bteam: "BOULOGNE SUR MER",
          ascore: "9",
          bscore: "4"
        },
        {
          day: "13-01-2019",
          schedule: "14h05",
          place: "Moreuil",
          ateam: "BETHUNE",
          bteam: "PONT DE METZ",
          ascore: "4",
          bscore: "8"
        },
        {
          day: "20-01-2019",
          schedule: "10h00",
          place: "Boulogne",
          ateam: "AMIENS",
          bteam: "BOULOGNE SUR MER",
          ascore: "7",
          bscore: "3"
        },
        {
          day: "20-01-2019",
          schedule: "12h00",
          place: "Boulogne",
          ateam: "VALENCIENNES",
          bteam: "PONT DE METZ",
          ascore: "2",
          bscore: "6"
        },
        {
          day: "27-01-2019",
          schedule: "10h00",
          place: "Boulogne",
          ateam: "BETHUNE",
          bteam: "AMIENS",
          ascore: "3",
          bscore: "1"
        },
        {
          day: "27-01-2019",
          schedule: "12h35",
          place: "Boulogne",
          ateam: "BOULOGNE SUR MER",
          bteam: "PONT DE METZ",
          ascore: "2",
          bscore: "6"
        },
        {
          day: "27-01-2019",
          schedule: "14h00",
          place: "Boulogne",
          ateam: "VALENCIENNES",
          bteam: "DUNKERQUE",
          ascore: "2",
          bscore: "11"
        },
        {
          day: "03-02-2019",
          schedule: "10h00",
          place: "PONT DE METZ",
          ateam: "AMIENS",
          bteam: "PONT DE METZ",
          ascore: "10",
          bscore: "1"
        },
        {
          day: "03-02-2019",
          schedule: "12h00",
          place: "Pont de Metz",
          ateam: "DUNKERQUE",
          bteam: "BETHUNE",
          ascore: "5",
          bscore: "8"
        },
        {
          day: "03-02-2019",
          schedule: "14h00",
          place: "Moreuil",
          ateam: "MOREUIL",
          bteam: "BOULOGNE SUR MER",
          ascore: "11",
          bscore: "15"
        }
      ]
    },
    {
      year: "2017-2018",
      rankings: [{ "draws": "E.", "forfaited": "F.", "goals": "buts", "goalsAllowed": "BE.", "goalsDiff": "diff.", "loses": "P.", "played": "J.", "points": "Pts", "rank": "Pl", "teams": "Equipe", "wins": "V." }, { "draws": "2", "forfaited": "0", "goals": "141", "goalsAllowed": "39", "goalsDiff": "102", "loses": "1", "played": "14", "points": "35", "rank": "1", "teams": "Camon", "wins": "11" }, { "draws": "1", "forfaited": "0", "goals": "99", "goalsAllowed": "44", "goalsDiff": "55", "loses": "2", "played": "13", "points": "31", "rank": "2", "teams": "Bethune", "wins": "10" }, { "draws": "0", "forfaited": "0", "goals": "108", "goalsAllowed": "56", "goalsDiff": "52", "loses": "5", "played": "13", "points": "24", "rank": "3", "teams": "Pont de Metz", "wins": "8" }, { "draws": "2", "forfaited": "1", "goals": "116", "goalsAllowed": "69", "goalsDiff": "47", "loses": "2", "played": "13", "points": "24", "rank": "4", "teams": "Dunkerque", "wins": "8" }, { "draws": "0", "forfaited": "0", "goals": "44", "goalsAllowed": "124", "goalsDiff": "-80", "loses": "9", "played": "13", "points": "12", "rank": "5", "teams": "Boulogne sur Mer", "wins": "4" }, { "draws": "0", "forfaited": "1", "goals": "54", "goalsAllowed": "79", "goalsDiff": "-25", "loses": "6", "played": "11", "points": "10", "rank": "6", "teams": "Amiens", "wins": "4" }, { "draws": "1", "forfaited": "2", "goals": "69", "goalsAllowed": "96", "goalsDiff": "-27", "loses": "7", "played": "12", "points": "3", "rank": "7", "teams": "Valenciennes", "wins": "2" }, { "draws": "0", "forfaited": "2", "goals": "18", "goalsAllowed": "142", "goalsDiff": "-124", "loses": "9", "played": "11", "points": "-4", "rank": "8", "teams": "Arras-Vyruce", "wins": "0" }],
      results: [
        {
          day: "29-10-2017",
          schedule: "10h15",
          place: "St Catherine les Arras",
          ateam: "ARRAS-VYRUCE",
          bteam: "CAMON",
          ascore: "1",
          bscore: "19"
        },
        {
          day: "29-10-2017",
          schedule: "12h00",
          place: "St Catherine les Arras",
          ateam: "VALENCIENNES",
          bteam: "BOULOGNE SUR MER",
          ascore: "7",
          bscore: "5"
        },
        {
          day: "29-10-2017",
          schedule: "14h00",
          place: "St Catherine les Arras",
          ateam: "BETHUNE",
          bteam: "DUNKERQUE",
          ascore: "7",
          bscore: "2"
        },
        {
          day: "11-11-2017",
          schedule: "20h30",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "AMIENS",
          ascore: "10",
          bscore: "7"
        },
        {
          day: "05-11-2017",
          schedule: "09h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "CAMON",
          ascore: "2",
          bscore: "10"
        },
        {
          day: "05-11-2017",
          schedule: "09h00",
          place: "St Catherine les Arras",
          ateam: "ARRAS-VYRUCE",
          bteam: "BETHUNE",
          ascore: "3",
          bscore: "12"
        },
        {
          day: "05-11-2017",
          schedule: "11h00",
          place: "St Catherine les Arras",
          ateam: "VALENCIENNES",
          bteam: "AMIENS",
          ascore: "7",
          bscore: "9"
        },
        {
          day: "05-11-2017",
          schedule: "12h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "PONT DE METZ",
          ascore: "10",
          bscore: "7"
        },
        {
          day: "18-11-2017",
          schedule: "20h00",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "VALENCIENNES",
          ascore: "11",
          bscore: "8"
        },
        {
          day: "19-11-2017",
          schedule: "10h00",
          place: "St Catherine les Arras",
          ateam: "ARRAS-VYRUCE",
          bteam: "AMIENS",
          ascore: "3",
          bscore: "8"
        },
        {
          day: "19-11-2017",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "DUNKERQUE",
          ascore: "2",
          bscore: "10"
        },
        {
          day: "19-11-2017",
          schedule: "12h00",
          place: "BOULOGNE",
          ateam: "BETHUNE",
          bteam: "CAMON",
          ascore: "7",
          bscore: "4"
        },
        {
          day: "26-11-2017",
          schedule: "09h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "ARRAS-VYRUCE",
          ascore: "16",
          bscore: "3"
        },
        {
          day: "26-11-2017",
          schedule: "10h00",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "VALENCIENNES",
          ascore: "14",
          bscore: "3"
        },
        {
          day: "26-11-2017",
          schedule: "11h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "PONT DE METZ",
          ascore: "1",
          bscore: "20"
        },
        {
          day: "26-11-2017",
          schedule: "13h00",
          place: "BOULOGNE",
          ateam: "BETHUNE",
          bteam: "AMIENS",
          ascore: "9",
          bscore: "2"
        },
        {
          day: "03-12-2017",
          schedule: "09h00",
          place: "AMIENS",
          ateam: "AMIENS",
          bteam: "CAMON",
          ascore: "2",
          bscore: "10"
        },
        {
          day: "03-12-2017",
          schedule: "10h00",
          place: "St Catherine les Arras",
          ateam: "ARRAS-VYRUCE",
          bteam: "BOULOGNE SUR MER",
          ascore: "1",
          bscore: "6"
        },
        {
          day: "03-12-2017",
          schedule: "12h10",
          place: "St Catherine les Arras",
          ateam: "VALENCIENNES",
          bteam: "DUNKERQUE",
          ascore: "9",
          bscore: "9"
        },
        {
          day: "03-12-2017",
          schedule: "14h00",
          place: "St Catherine les Arras",
          ateam: "BETHUNE",
          bteam: "PONT DE METZ",
          ascore: "1",
          bscore: "2"
        },
        {
          day: "06-01-2018",
          schedule: "20h00",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "CAMON",
          ascore: "3",
          bscore: "6"
        },
        {
          day: "08-04-2018",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "AMIENS",
          ascore: "10",
          bscore: "6"
        },
        {
          day: "08-04-2018",
          schedule: "12h30",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "BETHUNE",
          ascore: "2",
          bscore: "15"
        },
        {
          day: "14-01-2018",
          schedule: "10h00",
          place: "SAINTE CATHERINE LES ARRAS",
          ateam: "ARRAS-VYRUCE",
          bteam: "PONT DE METZ",
          ascore: "1",
          bscore: "10"
        },
        {
          day: "14-01-2018",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "AMIENS",
          ascore: "5",
          bscore: "0"
        },
        {
          day: "14-01-2018",
          schedule: "12h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "CAMON",
          ascore: "6",
          bscore: "6"
        },
        {
          day: "14-01-2018",
          schedule: "12h00",
          place: "SAINTE CATHERINE LES ARRAS",
          ateam: "BETHUNE",
          bteam: "VALENCIENNES",
          ascore: "9",
          bscore: "4"
        },
        {
          day: "28-01-2018",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "BETHUNE",
          ascore: "7",
          bscore: "3"
        },
        {
          day: "28-01-2018",
          schedule: "11h00",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "ARRAS-VYRUCE",
          ascore: "19",
          bscore: "1"
        },
        {
          day: "28-01-2018",
          schedule: "12h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "VALENCIENNES",
          ascore: "5",
          bscore: "3"
        },
        {
          day: "11-03-2018",
          schedule: "10h00",
          place: "AMIENS",
          ateam: "AMIENS",
          bteam: "PONT DE METZ",
          ascore: "6",
          bscore: "3"
        },
        {
          day: "10-02-2018",
          schedule: "20h30",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "BOULOGNE SUR MER",
          ascore: "14",
          bscore: "0"
        },
        {
          day: "10-02-2018",
          schedule: "20h30",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "DUNKERQUE",
          ascore: "12",
          bscore: "4"
        },
        {
          day: "11-02-2018",
          schedule: "12h25",
          place: "AMIENS",
          ateam: "AMIENS",
          bteam: "VALENCIENNES",
          ascore: "9",
          bscore: "7"
        },
        {
          day: "11-02-2018",
          schedule: "13h00",
          place: "LAMBERSART",
          ateam: "BETHUNE",
          bteam: "ARRAS-VYRUCE",
          ascore: "5",
          bscore: "0"
        },
        {
          day: "17-02-2018",
          schedule: "18h30",
          place: "TOURCOING",
          ateam: "VALENCIENNES",
          bteam: "PONT DE METZ",
          ascore: "0",
          bscore: "5"
        },
        {
          day: "25-02-2018",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "BOULOGNE SUR MER",
          ascore: "13",
          bscore: "7"
        },
        {
          day: "25-02-2018",
          schedule: "12h00",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "BETHUNE",
          ascore: "8",
          bscore: "8"
        },
        {
          day: "03-03-2018",
          schedule: "20h30",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "BOULOGNE SUR MER",
          ascore: "20",
          bscore: "1"
        },
        {
          day: "04-03-2018",
          schedule: "09h00",
          place: "SAINTE CATHERINE LES ARRAS",
          ateam: "ARRAS-VYRUCE",
          bteam: "DUNKERQUE",
          ascore: "2",
          bscore: "24"
        },
        {
          day: "04-03-2018",
          schedule: "10h00",
          place: "AMIENS",
          ateam: "AMIENS",
          bteam: "BETHUNE",
          ascore: "3",
          bscore: "7"
        },
        {
          day: "04-03-2018",
          schedule: "11h00",
          place: "SAINTE CATHERINE LES ARRAS",
          ateam: "VALENCIENNES",
          bteam: "CAMON",
          ascore: "3",
          bscore: "12"
        },
        {
          day: "17-03-2018",
          schedule: "18h10",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "AMIENS",
          ascore: "8",
          bscore: "2"
        },
        {
          day: "18-03-2018",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "ARRAS-VYRUCE",
          ascore: "5",
          bscore: "0"
        },
        {
          day: "18-03-2018",
          schedule: "11h00",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "BETHUNE",
          ascore: "4",
          bscore: "5"
        },
        {
          day: "18-03-2018",
          schedule: "12h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "VALENCIENNES",
          ascore: "5",
          bscore: "0"
        },
        {
          day: "25-03-2018",
          schedule: "09h00",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "PONT DE METZ",
          ascore: "6",
          bscore: "1"
        },
        {
          day: "25-03-2018",
          schedule: "10h00",
          place: "SAINTE CATHERINE LES ARRAS",
          ateam: "ARRAS-VYRUCE",
          bteam: "VALENCIENNES",
          ascore: "3",
          bscore: "18"
        },
        {
          day: "25-03-2018",
          schedule: "12h00",
          place: "SAINTE CATHERINE LES ARRAS",
          ateam: "BETHUNE",
          bteam: "BOULOGNE SUR MER",
          ascore: "11",
          bscore: "3"
        },
        {
          day: "01-04-2018",
          schedule: "14h00",
          place: "PONT DE METZ",
          ateam: "CAMON",
          bteam: "DUNKERQUE",
          ascore: "5",
          bscore: "0"
        }
      ]
    },
    {
      year: "2016-2017",
      rankings: [{ "draws": "E.", "forfaited": "F.", "goals": "buts", "goalsAllowed": "BE.", "goalsDiff": "diff.", "loses": "P.", "played": "J.", "points": "Pts", "rank": "Pl", "teams": "Equipe", "wins": "V." }, { "draws": "0", "forfaited": "0", "goals": "101", "goalsAllowed": "33", "goalsDiff": "68", "loses": "0", "played": "10", "points": "30", "rank": "1", "teams": "Tourcoing", "wins": "10" }, { "draws": "0", "forfaited": "0", "goals": "46", "goalsAllowed": "36", "goalsDiff": "10", "loses": "3", "played": "7", "points": "12", "rank": "2", "teams": "Camon", "wins": "4" }, { "draws": "0", "forfaited": "0", "goals": "54", "goalsAllowed": "53", "goalsDiff": "1", "loses": "4", "played": "8", "points": "12", "rank": "3", "teams": "Pont de Metz", "wins": "4" }, { "draws": "0", "forfaited": "0", "goals": "18", "goalsAllowed": "37", "goalsDiff": "-19", "loses": "3", "played": "5", "points": "6", "rank": "4", "teams": "Amiens", "wins": "2" }, { "draws": "1", "forfaited": "1", "goals": "46", "goalsAllowed": "50", "goalsDiff": "-4", "loses": "4", "played": "8", "points": "5", "rank": "5", "teams": "Dunkerque", "wins": "2" }, { "draws": "1", "forfaited": "0", "goals": "21", "goalsAllowed": "77", "goalsDiff": "-56", "loses": "7", "played": "8", "points": "1", "rank": "6", "teams": "Boulogne sur Mer", "wins": "0" }],
      results: [
        {
          day: "06-11-2016",
          schedule: "12h00",
          place: "TOURCOING",
          ateam: "DUNKERQUE",
          bteam: "TOURCOING",
          ascore: "4",
          bscore: "5"
        },
        {
          day: "06-11-2016",
          schedule: "15h00",
          place: "AMIENS",
          ateam: "AMIENS",
          bteam: "CAMON",
          ascore: "4",
          bscore: "7"
        },
        {
          day: "19-11-2016",
          schedule: "18h30",
          place: "TOURCOING",
          ateam: "TOURCOING",
          bteam: "AMIENS",
          ascore: "13",
          bscore: "3"
        },
        {
          day: "20-11-2016",
          schedule: "10h00",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "BOULOGNE SUR MER",
          ascore: "13",
          bscore: "3"
        },
        {
          day: "26-11-2016",
          schedule: "18h00",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "TOURCOING",
          ascore: "7",
          bscore: "8"
        },
        {
          day: "03-12-2016",
          schedule: "15h30",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "DUNKERQUE",
          ascore: "7",
          bscore: "5"
        },
        {
          day: "03-12-2016",
          schedule: "21h50",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "BOULOGNE SUR MER",
          ascore: "9",
          bscore: "2"
        },
        {
          day: "10-12-2016",
          schedule: "20h00",
          place: "TOURCOING",
          ateam: "TOURCOING",
          bteam: "CAMON",
          ascore: "8",
          bscore: "3"
        },
        {
          day: "18-12-2016",
          schedule: "14h00",
          place: "AMIENS",
          ateam: "DUNKERQUE",
          bteam: "AMIENS",
          ascore: "0",
          bscore: "5"
        },
        {
          day: "08-01-2017",
          schedule: "10h00",
          place: "PONT DE METZ",
          ateam: "PONT DE METZ",
          bteam: "CAMON",
          ascore: "9",
          bscore: "5"
        },
        {
          day: "08-01-2017",
          schedule: "12h00",
          place: "TOURCOING",
          ateam: "DUNKERQUE",
          bteam: "BOULOGNE SUR MER",
          ascore: "16",
          bscore: "4"
        },
        {
          day: "11-03-2017",
          schedule: "20h30",
          place: "LILLE",
          ateam: "TOURCOING",
          bteam: "BOULOGNE SUR MER",
          ascore: "14",
          bscore: "0"
        },
        {
          day: "21-01-2017",
          schedule: "20h00",
          place: "TOURCOING",
          ateam: "TOURCOING",
          bteam: "DUNKERQUE",
          ascore: "10",
          bscore: "6"
        },
        {
          day: "29-01-2017",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "PONT DE METZ",
          ascore: "3",
          bscore: "9"
        },
        {
          day: "29-01-2017",
          schedule: "15h00",
          place: "AMIENS",
          ateam: "AMIENS",
          bteam: "TOURCOING",
          ascore: "2",
          bscore: "14"
        },
        {
          day: "05-02-2017",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "AMIENS",
          ascore: "3",
          bscore: "4"
        },
        {
          day: "05-02-2017",
          schedule: "12h00",
          place: "TOURCOING",
          ateam: "TOURCOING",
          bteam: "PONT DE METZ",
          ascore: "15",
          bscore: "4"
        },
        {
          day: "05-02-2017",
          schedule: "14h00",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "DUNKERQUE",
          ascore: "13",
          bscore: "4"
        },
        {
          day: "02-04-2017",
          schedule: "12h00",
          place: "BOULOGNE",
          ateam: "DUNKERQUE",
          bteam: "PONT DE METZ",
          ascore: "7",
          bscore: "2"
        },
        {
          day: "12-03-2017",
          schedule: "14h00",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "TOURCOING",
          ascore: "2",
          bscore: "6"
        },
        {
          day: "19-03-2017",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "DUNKERQUE",
          ascore: "4",
          bscore: "4"
        },
        {
          day: "19-03-2017",
          schedule: "14h00",
          place: "AMIENS",
          ateam: "CAMON",
          bteam: "PONT DE METZ",
          ascore: "7",
          bscore: "3"
        },
        {
          day: "26-03-2017",
          schedule: "10h00",
          place: "BOULOGNE",
          ateam: "BOULOGNE SUR MER",
          bteam: "TOURCOING",
          ascore: "2",
          bscore: "8"
        }
      ]
    }
  ]
});