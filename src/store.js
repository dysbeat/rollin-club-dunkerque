import {writable} from 'svelte/store';

export const data = writable({
  pages: [
    {name: 'Accueil', link: 'home'}, {name: 'Equipes', link: 'teams'},
    {name: 'Competition', link: 'competition'},
    {name: 'Contact', link: 'contact'}
  ],
  selectedPage: 'home',
  teams: [
    {
      name: 'Enfants loisir',
      schedules: ['Samedi: 14h à 16h'],
      description:
          'Apprentissage des bases du roller afin de pouvoir evoluer en toute autonomie.',
      gears: [
        {name: 'Roller', description: 'pas de roues noires, ni de freins.'},
      ]
    },
    {
      name: 'Roller hockey enfants',
      schedules: ['Samedi: 14h à 16h'],
      description: 'Initiation et pratique du Roller Hockey.',
      gears: [
        {name: 'Roller', description: 'pas de roues noires, ni de freins'},
        {name: 'Crosse', description: 'type hockey sur glace'},
        {name: 'Jambières', description: ''},
        {name: 'Coudières', description: ''},
        {name: 'Coquille', description: 'pour les filles coquille adaptée'},
        {name: 'Protège poitrine', description: 'pour les filles uniquement'},
        {name: 'Casque', description: 'avec protection faciale intégrale'},
        {name: 'Protège cou', description: ''},
        {name: 'Gants de hockey', description: ''}
      ]
    },
    {
      name: 'Roller hockey pre-nationale',
      schedules: ['Mardi: 19h30 à 21h', 'Jeudi: 19h30 à 21h'],
      description: 'Competition de roller hockey adulte.',
      gears: [
        {name: 'Roller', description: 'pas de roues noires, ni de freins'}, {
          name: 'Crosse',
          description: 'type hockey sur glace, prévoir une deuxième de secours'
        },
        {name: 'Jambières', description: ''}, {
          name: 'Coudières',
          description: 'les fitness sont acceptées cependant déconseillées'
        },
        {
          name: 'Casque',
          description: 'avec protection faciale pour les mineurs(es)'
        },
        {name: 'Gants de hockey', description: ''},
        {name: 'Coquille', description: ''}, {
          name: 'Pantalon',
          description: 'recouvrant l’ensemble des protections'
        },
        {name: 'culotte ou gaine', description: 'facultatif'},
        {name: 'gilet rembourré', description: 'facultatif'},
        {name: 'épaulettes rigides interdit', description: ''}
      ]
    }
  ],
  selectedSeason: '2018-2019',
  seasons: [
    {
      year: '2018-2019',
      rankings: [
        {
          'draws': 'E.',
          'forfaited': 'F.',
          'goals': 'buts',
          'goalsAllowed': 'BE.',
          'goalsDiff': 'diff.',
          'loses': 'P.',
          'played': 'J.',
          'points': 'Pts',
          'rank': 'Pl',
          'teams': 'Equipe',
          'wins': 'V.'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '87',
          'goalsAllowed': '32',
          'goalsDiff': '55',
          'loses': '1',
          'played': '12',
          'points': '33',
          'rank': '1',
          'teams': 'Amiens',
          'wins': '11'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '98',
          'goalsAllowed': '53',
          'goalsDiff': '45',
          'loses': '3',
          'played': '11',
          'points': '24',
          'rank': '2',
          'teams': 'Bethune',
          'wins': '8'
        },
        {
          'draws': '1',
          'forfaited': '2',
          'goals': '93',
          'goalsAllowed': '52',
          'goalsDiff': '41',
          'loses': '1',
          'played': '11',
          'points': '18',
          'rank': '3',
          'teams': 'Dunkerque',
          'wins': '7'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '66',
          'goalsAllowed': '60',
          'goalsDiff': '6',
          'loses': '4',
          'played': '10',
          'points': '18',
          'rank': '4',
          'teams': 'Pont de Metz',
          'wins': '6'
        },
        {
          'draws': '1',
          'forfaited': '0',
          'goals': '62',
          'goalsAllowed': '92',
          'goalsDiff': '-30',
          'loses': '6',
          'played': '10',
          'points': '10',
          'rank': '5',
          'teams': 'Valenciennes',
          'wins': '3'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '64',
          'goalsAllowed': '96',
          'goalsDiff': '-32',
          'loses': '9',
          'played': '11',
          'points': '6',
          'rank': '6',
          'teams': 'Boulogne sur Mer',
          'wins': '2'
        },
        {
          'draws': '0',
          'forfaited': '1',
          'goals': '53',
          'goalsAllowed': '138',
          'goalsDiff': '-85',
          'loses': '10',
          'played': '11',
          'points': '-2',
          'rank': '7',
          'teams': 'Moreuil',
          'wins': '0'
        }
      ],
      players: [
        {
          'box': 'Pénalités',
          'games': 'Matchs',
          'goals': 'Buts',
          'passes': 'Passes',
          'player': 'Joueur',
          'points': 'Points',
          'rank': 'Pl',
          'team': 'Equipe'
        },
        {
          'box': '6 \' 00',
          'games': '9',
          'goals': '38',
          'passes': '5',
          'players': 'REMY BOYTARD',
          'points': '43',
          'rank': '1',
          'teams': 'Moreuil'
        },
        {
          'box': '4 \' 00',
          'games': '9',
          'goals': '22',
          'passes': '12',
          'players': 'ANTOINE JANOT',
          'points': '34',
          'rank': '2',
          'teams': 'Valenciennes'
        },
        {
          'box': '4 \' 00',
          'games': '6',
          'goals': '24',
          'passes': '8',
          'players': 'LUCAS DUMERLIE',
          'points': '32',
          'rank': '3',
          'teams': 'Dunkerque'
        },
        {
          'box': '12 \' 00',
          'games': '10',
          'goals': '20',
          'passes': '10',
          'players': 'CHRISTOPHE DEVAUCHELLE',
          'points': '30',
          'rank': '4',
          'teams': 'Bethune'
        },
        {
          'box': '10 \' 00',
          'games': '10',
          'goals': '10',
          'passes': '15',
          'players': 'ARNAUD PEZE',
          'points': '25',
          'rank': '5',
          'teams': 'Amiens'
        },
        {
          'box': '8 \' 00',
          'games': '11',
          'goals': '17',
          'passes': '7',
          'players': 'GABRIEL SPITZ',
          'points': '24',
          'rank': '6',
          'teams': 'Bethune'
        },
        {
          'box': '6 \' 00',
          'games': '10',
          'goals': '16',
          'passes': '8',
          'players': 'BENOIT ANDRE',
          'points': '24',
          'rank': '7',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '8',
          'goals': '15',
          'passes': '5',
          'players': 'JULIEN CLIPET',
          'points': '20',
          'rank': '8',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '32 \' 00',
          'games': '10',
          'goals': '14',
          'passes': '6',
          'players': 'JONATHAN TEMBUYSER',
          'points': '20',
          'rank': '9',
          'teams': 'Bethune'
        },
        {
          'box': '2 \' 00',
          'games': '9',
          'goals': '10',
          'passes': '10',
          'players': 'SEBASTIEN LUGAN JAMES',
          'points': '20',
          'rank': '10',
          'teams': 'Pont de Metz'
        },
        {
          'box': '2 \' 00',
          'games': '8',
          'goals': '9',
          'passes': '10',
          'players': 'NICOLAS EYROLLES',
          'points': '19',
          'rank': '11',
          'teams': 'Dunkerque'
        },
        {
          'box': '12 \' 00',
          'games': '10',
          'goals': '12',
          'passes': '6',
          'players': 'GREGOIRE KUBICKI',
          'points': '18',
          'rank': '12',
          'teams': 'Bethune'
        },
        {
          'box': '16 \' 00',
          'games': '10',
          'goals': '14',
          'passes': '3',
          'players': 'ANTHONY WALLET',
          'points': '17',
          'rank': '13',
          'teams': 'Amiens'
        },
        {
          'box': '4 \' 00',
          'games': '8',
          'goals': '11',
          'passes': '6',
          'players': 'PHILIPPE TANGHE',
          'points': '17',
          'rank': '14',
          'teams': 'Dunkerque'
        },
        {
          'box': '10 \' 00',
          'games': '9',
          'goals': '8',
          'passes': '9',
          'players': 'GREGOIRE GIGUERE',
          'points': '17',
          'rank': '15',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '13',
          'passes': '3',
          'players': 'GAUTHIER CHEVALIER',
          'points': '16',
          'rank': '16',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '9',
          'passes': '7',
          'players': 'JOHAN BIAUSQUE',
          'points': '16',
          'rank': '17',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '16 \' 00',
          'games': '9',
          'goals': '7',
          'passes': '9',
          'players': 'CYRIL LUGUET',
          'points': '16',
          'rank': '18',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '12',
          'passes': '3',
          'players': 'ANTOINE DEMARET',
          'points': '15',
          'rank': '19',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '9',
          'goals': '10',
          'passes': '4',
          'players': 'NICOLAS BRUXELLE',
          'points': '14',
          'rank': '20',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '11',
          'goals': '9',
          'passes': '4',
          'players': 'LUC FOULARD',
          'points': '13',
          'rank': '21',
          'teams': 'Bethune'
        },
        {
          'box': '2 \' 00',
          'games': '8',
          'goals': '7',
          'passes': '6',
          'players': 'MAXIME BROUCKE',
          'points': '13',
          'rank': '22',
          'teams': 'Dunkerque'
        },
        {
          'box': '6 \' 00',
          'games': '4',
          'goals': '9',
          'passes': '3',
          'players': 'JONATHAN BODEL',
          'points': '12',
          'rank': '23',
          'teams': 'Dunkerque'
        },
        {
          'box': '12 \' 00',
          'games': '9',
          'goals': '8',
          'passes': '4',
          'players': 'KENNY GERVOIS',
          'points': '12',
          'rank': '24',
          'teams': 'Amiens'
        },
        {
          'box': '10 \' 00',
          'games': '9',
          'goals': '6',
          'passes': '6',
          'players': 'NICOLAS PRAGNIACY',
          'points': '12',
          'rank': '25',
          'teams': 'Valenciennes'
        },
        {
          'box': '12 \' 00',
          'games': '10',
          'goals': '5',
          'passes': '7',
          'players': 'GAEL DAMELINCOURT',
          'points': '12',
          'rank': '26',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '8',
          'passes': '3',
          'players': 'VINCENT NAELS',
          'points': '11',
          'rank': '27',
          'teams': 'Dunkerque'
        },
        {
          'box': '6 \' 00',
          'games': '8',
          'goals': '7',
          'passes': '3',
          'players': 'LAURENT BIENKOWSKI',
          'points': '10',
          'rank': '28',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '5',
          'goals': '7',
          'passes': '3',
          'players': 'FRANCOIS MARTEEL',
          'points': '10',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '8 \' 00',
          'games': '8',
          'goals': '7',
          'passes': '3',
          'players': 'TONY LAGACHE',
          'points': '10',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '6',
          'goals': '5',
          'passes': '5',
          'players': 'YAEL AYIKA',
          'points': '10',
          'rank': '29',
          'teams': 'Dunkerque'
        },
        {
          'box': '8 \' 00',
          'games': '9',
          'goals': '3',
          'passes': '7',
          'players': 'MAXIME STEENKISTE',
          'points': '10',
          'rank': '30',
          'teams': 'Valenciennes'
        },
        {
          'box': '8 \' 00',
          'games': '11',
          'goals': '7',
          'passes': '2',
          'players': 'DAVID BILLET',
          'points': '9',
          'rank': '31',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '2 \' 00',
          'games': '10',
          'goals': '5',
          'passes': '4',
          'players': 'SULLIVAN DANTEN',
          'points': '9',
          'rank': '32',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '5',
          'goals': '7',
          'passes': '1',
          'players': 'FLORENT DELAPLACE',
          'points': '8',
          'rank': '33',
          'teams': 'Pont de Metz'
        },
        {
          'box': '6 \' 00',
          'games': '7',
          'goals': '5',
          'passes': '3',
          'players': 'ANTHONY VINCENT',
          'points': '8',
          'rank': '34',
          'teams': 'Bethune'
        },
        {
          'box': '4 \' 00',
          'games': '7',
          'goals': '5',
          'passes': '3',
          'players': 'ALLAN CAMBERLEIN',
          'points': '8',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '6',
          'goals': '4',
          'passes': '4',
          'players': 'FLORIAN NOEL',
          'points': '8',
          'rank': '35',
          'teams': 'Moreuil'
        },
        {
          'box': '10 \' 00',
          'games': '8',
          'goals': '7',
          'passes': '0',
          'players': 'MICKAEL LUGAN JAMES',
          'points': '7',
          'rank': '36',
          'teams': 'Pont de Metz'
        },
        {
          'box': '14 \' 00',
          'games': '9',
          'goals': '6',
          'passes': '1',
          'players': 'CHRISTOPHER AMIET',
          'points': '7',
          'rank': '37',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '9',
          'goals': '6',
          'passes': '1',
          'players': 'NICOLAS MERLIN',
          'points': '7',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '14 \' 00',
          'games': '11',
          'goals': '5',
          'passes': '2',
          'players': 'FAUSTIN FACOMPREZ',
          'points': '7',
          'rank': '38',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '18 \' 00',
          'games': '9',
          'goals': '5',
          'passes': '2',
          'players': 'FLORIAN CARON',
          'points': '7',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '6 \' 00',
          'games': '8',
          'goals': '4',
          'passes': '3',
          'players': 'CEDRIC FOUQUET',
          'points': '7',
          'rank': '39',
          'teams': 'Pont de Metz'
        },
        {
          'box': '10 \' 00',
          'games': '9',
          'goals': '3',
          'passes': '4',
          'players': 'TANGUY PEPONAS',
          'points': '7',
          'rank': '40',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '4',
          'passes': '2',
          'players': 'NICOLAS RIDOUX',
          'points': '6',
          'rank': '41',
          'teams': 'Bethune'
        },
        {
          'box': '16 \' 00',
          'games': '8',
          'goals': '3',
          'passes': '3',
          'players': 'VINCENT LUGAN JAMES',
          'points': '6',
          'rank': '42',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '3',
          'passes': '3',
          'players': 'ERWAN ROUDOT',
          'points': '6',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '4',
          'passes': '1',
          'players': 'GUILLAUME DANTEN',
          'points': '5',
          'rank': '43',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '2',
          'passes': '3',
          'players': 'GAEL BATARD',
          'points': '5',
          'rank': '44',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '9',
          'goals': '2',
          'passes': '3',
          'players': 'YANNICK LENGLET',
          'points': '5',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '11',
          'goals': '4',
          'passes': '0',
          'players': 'BASTIEN FACOMPREZ',
          'points': '4',
          'rank': '45',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '4',
          'goals': '3',
          'passes': '1',
          'players': 'BASTIEN POUCET',
          'points': '4',
          'rank': '46',
          'teams': 'Amiens'
        },
        {
          'box': '6 \' 00',
          'games': '6',
          'goals': '3',
          'passes': '1',
          'players': 'MAXIME HARZIG',
          'points': '4',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '16 \' 00',
          'games': '8',
          'goals': '3',
          'passes': '1',
          'players': 'THOMAS EPIFANI',
          'points': '4',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '8',
          'goals': '2',
          'passes': '2',
          'players': 'MATHIEU BOISSENOT',
          'points': '4',
          'rank': '47',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '10',
          'goals': '2',
          'passes': '2',
          'players': 'SEBASTIEN DELPLACE',
          'points': '4',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '8 \' 00',
          'games': '10',
          'goals': '2',
          'passes': '2',
          'players': 'BENOIT FRONTY',
          'points': '4',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '9',
          'goals': '1',
          'passes': '3',
          'players': 'FRANCOIS QUEMENER',
          'points': '4',
          'rank': '48',
          'teams': 'Valenciennes'
        },
        {
          'box': '18 \' 00',
          'games': '10',
          'goals': '3',
          'passes': '0',
          'players': 'FREDERIC TALMANT',
          'points': '3',
          'rank': '49',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '3',
          'passes': '0',
          'players': 'LAURENT BLOIS',
          'points': '3',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '22 \' 00',
          'games': '11',
          'goals': '2',
          'passes': '1',
          'players': 'JEREMY BENARD',
          'points': '3',
          'rank': '50',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '2',
          'passes': '1',
          'players': 'FLORIAN VITTECOQ',
          'points': '3',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '2',
          'passes': '1',
          'players': 'DAVID RENAUX',
          'points': '3',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '3',
          'players': 'MATTHIEU NISON',
          'points': '3',
          'rank': '51',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '2',
          'passes': '0',
          'players': 'BRUNO DARE',
          'points': '2',
          'rank': '52',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '2',
          'goals': '1',
          'passes': '1',
          'players': 'MAXENCE GILLION',
          'points': '2',
          'rank': '53',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '1',
          'players': 'PASCAL MINY',
          'points': '2',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '1',
          'players': 'MICHAEL THERY',
          'points': '2',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '1',
          'players': 'THOMAS JORON',
          'points': '2',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '6 \' 00',
          'games': '10',
          'goals': '1',
          'passes': '1',
          'players': 'PHILIPPE DUPONT',
          'points': '2',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '1',
          'passes': '1',
          'players': 'BENJAMIN FORTINI',
          'points': '2',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '2 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '1',
          'players': 'STEPHANE DUPRE',
          'points': '2',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '1',
          'passes': '1',
          'players': 'VALENTIN LANOY',
          'points': '2',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '2 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '2',
          'players': 'ETIENNE CHASSIN',
          'points': '2',
          'rank': '54',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '2',
          'players': 'LORINE MUCKE',
          'points': '2',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '12 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '2',
          'players': 'GREGORY GAJEWSKI',
          'points': '2',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '4 \' 00',
          'games': '10',
          'goals': '0',
          'passes': '2',
          'players': 'JEREMY LLOBERES',
          'points': '2',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '0',
          'passes': '2',
          'players': 'DAVID CLEMENT',
          'points': '2',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '0',
          'players': 'JéRéMY SPITZ',
          'points': '1',
          'rank': '55',
          'teams': 'Bethune'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '1',
          'passes': '0',
          'players': 'PIERRE CHALOPIN',
          'points': '1',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '1',
          'passes': '0',
          'players': 'STEVE MICHAUX',
          'points': '1',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '4 \' 00',
          'games': '1',
          'goals': '1',
          'passes': '0',
          'players': 'ARNAUD STEENKISTE',
          'points': '1',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '1',
          'passes': '0',
          'players': 'BENOIT KAMINSKI',
          'points': '1',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '4 \' 00',
          'games': '10',
          'goals': '1',
          'passes': '0',
          'players': 'NICOLAS COUSIN',
          'points': '1',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '6 \' 00',
          'games': '10',
          'goals': '1',
          'passes': '0',
          'players': 'SEBASTIEN BROYARD',
          'points': '1',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '0',
          'passes': '1',
          'players': 'MAXIME DUPONT',
          'points': '1',
          'rank': '56',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '1',
          'players': 'DAMIEN ALCUTA',
          'points': '1',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '1',
          'players': 'LAURENT BLONDE',
          'points': '1',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '6 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '1',
          'players': 'GREGOIRE COLBERT',
          'points': '1',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '10 \' 00',
          'games': '10',
          'goals': '0',
          'passes': '1',
          'players': 'MICKAEL FACHE',
          'points': '1',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '0',
          'passes': '0',
          'players': 'GUILLAUME COPIN',
          'points': '0',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '11',
          'goals': '0',
          'passes': '0',
          'players': 'CHRISTOPHE BOUILLEZ',
          'points': '0',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '2 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'JORDAN LANDO',
          'points': '0',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'PHILIPPE POUSSART',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'MATHIEU MINY',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'REMY FOURNIER',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'BENOIT FACOMPREZ',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '0',
          'players': 'DIEGO CREPIN',
          'points': '0',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'CYRIL CARDON',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'CLEMENT LAIGNIER',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'JULIEN DUPUIS',
          'points': '0',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'PIERRE MARTEL',
          'points': '0',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '0',
          'players': 'FLORIAN JABELIN',
          'points': '0',
          'rank': '',
          'teams': 'Moreuil'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '0',
          'passes': '0',
          'players': 'FRANCOIS CHOMEZ',
          'points': '0',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'ANTOINE SUQUET',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '0',
          'players': 'SOPHIE MINY',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'VALENTIN DEMARET',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'CYRIL LOUCHET',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'HANSI LANG',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '10',
          'goals': '0',
          'passes': '0',
          'players': 'ANTHONY BUTIN',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'ARNAUD PARIS',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '0',
          'players': 'JEAN-EUDES ANDRIEU',
          'points': '0',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'JULIEN SICOT',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '0',
          'players': 'ALEXIS PRANGERE',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        }
      ],
      results: [
        {
          'ascore': '4',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '7',
          'bteam': 'AMIENS',
          'date': '21-10-2018',
          'day': '1',
          'place': 'Boulogne',
          'schedule': '10h00'
        },
        {
          'ascore': '22',
          'ateam': 'DUNKERQUE',
          'bscore': '2',
          'bteam': 'MOREUIL',
          'date': '21-10-2018',
          'day': '1',
          'place': 'Boulogne',
          'schedule': '12h00'
        },
        {
          'ascore': '2',
          'ateam': 'PONT DE METZ',
          'bscore': '5',
          'bteam': 'AMIENS',
          'date': '11-11-2018',
          'day': '2',
          'place': 'Pont de Metz',
          'schedule': '10h00'
        },
        {
          'ascore': '1',
          'ateam': 'BETHUNE',
          'bscore': '7',
          'bteam': 'DUNKERQUE',
          'date': '11-11-2018',
          'day': '2',
          'place': 'Pont de Metz',
          'schedule': '12h00'
        },
        {
          'ascore': '12',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '3',
          'bteam': 'MOREUIL',
          'date': '11-11-2018',
          'day': '2',
          'place': 'Pont de Metz',
          'schedule': '14h00'
        },
        {
          'ascore': '4',
          'ateam': 'MOREUIL',
          'bscore': '15',
          'bteam': 'PONT DE METZ',
          'date': '18-11-2018',
          'day': '3',
          'place': 'Moreuil',
          'schedule': '10h00'
        },
        {
          'ascore': '16',
          'ateam': 'BETHUNE',
          'bscore': '3',
          'bteam': 'VALENCIENNES',
          'date': '18-11-2018',
          'day': '3',
          'place': 'Moreuil',
          'schedule': '12h00'
        },
        {
          'ascore': '0',
          'ateam': 'DUNKERQUE',
          'bscore': '5',
          'bteam': 'AMIENS',
          'date': '18-11-2018',
          'day': '3',
          'place': 'Moreuil',
          'schedule': '14h00'
        },
        {
          'ascore': '9',
          'ateam': 'AMIENS',
          'bscore': '5',
          'bteam': 'BETHUNE',
          'date': '02-12-2018',
          'day': '4',
          'place': 'Amiens',
          'schedule': '10h00'
        },
        {
          'ascore': '7',
          'ateam': 'PONT DE METZ',
          'bscore': '5',
          'bteam': 'BOULOGNE SUR MER',
          'date': '02-12-2018',
          'day': '4',
          'place': 'Amiens',
          'schedule': '12h00'
        },
        {
          'ascore': '11',
          'ateam': 'DUNKERQUE',
          'bscore': '11',
          'bteam': 'VALENCIENNES',
          'date': '02-12-2018',
          'day': '4',
          'place': 'Amiens',
          'schedule': '14h00'
        },
        {
          'ascore': '15',
          'ateam': 'BETHUNE',
          'bscore': '2',
          'bteam': 'MOREUIL',
          'date': '09-12-2018',
          'day': '5',
          'place': 'Boulogne',
          'schedule': '10h00'
        },
        {
          'ascore': '15',
          'ateam': 'DUNKERQUE',
          'bscore': '6',
          'bteam': 'BOULOGNE SUR MER',
          'date': '09-12-2018',
          'day': '5',
          'place': 'Boulogne',
          'schedule': '12h00'
        },
        {
          'ascore': '10',
          'ateam': 'AMIENS',
          'bscore': '5',
          'bteam': 'VALENCIENNES',
          'date': '09-12-2018',
          'day': '5',
          'place': 'Boulogne',
          'schedule': '14h00'
        },
        {
          'ascore': '15',
          'ateam': 'VALENCIENNES',
          'bscore': '10',
          'bteam': 'MOREUIL',
          'date': '16-12-2018',
          'day': '6',
          'place': 'Pont de Metz',
          'schedule': '10h00'
        },
        {
          'ascore': '3',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '16',
          'bteam': 'BETHUNE',
          'date': '16-12-2018',
          'day': '6',
          'place': 'Pont de Metz',
          'schedule': '12h00'
        },
        {
          'ascore': '7',
          'ateam': 'PONT DE METZ',
          'bscore': '11',
          'bteam': 'DUNKERQUE',
          'date': '16-12-2018',
          'day': '6',
          'place': 'Pont de Metz',
          'schedule': '14h00'
        },
        {
          'ascore': '1',
          'ateam': 'MOREUIL',
          'bscore': '8',
          'bteam': 'AMIENS',
          'date': '13-01-2019',
          'day': '7',
          'place': 'Moreuil',
          'schedule': '10h00'
        },
        {
          'ascore': '9',
          'ateam': 'VALENCIENNES',
          'bscore': '4',
          'bteam': 'BOULOGNE SUR MER',
          'date': '13-01-2019',
          'day': '7',
          'place': 'Moreuil',
          'schedule': '12h00'
        },
        {
          'ascore': '4',
          'ateam': 'BETHUNE',
          'bscore': '8',
          'bteam': 'PONT DE METZ',
          'date': '13-01-2019',
          'day': '7',
          'place': 'Moreuil',
          'schedule': '14h05'
        },
        {
          'ascore': '7',
          'ateam': 'AMIENS',
          'bscore': '3',
          'bteam': 'BOULOGNE SUR MER',
          'date': '20-01-2019',
          'day': '8',
          'place': 'Boulogne',
          'schedule': '10h00'
        },
        {
          'ascore': '0',
          'ateam': 'MOREUIL',
          'bscore': '5',
          'bteam': 'DUNKERQUE',
          'date': '20-01-2019',
          'day': '8',
          'place': 'Boulogne',
          'schedule': '12h00'
        },
        {
          'ascore': '2',
          'ateam': 'VALENCIENNES',
          'bscore': '6',
          'bteam': 'PONT DE METZ',
          'date': '20-01-2019',
          'day': '8',
          'place': 'Boulogne',
          'schedule': '12h00'
        },
        {
          'ascore': '3',
          'ateam': 'BETHUNE',
          'bscore': '1',
          'bteam': 'AMIENS',
          'date': '27-01-2019',
          'day': '9',
          'place': 'Boulogne',
          'schedule': '10h00'
        },
        {
          'ascore': '2',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '6',
          'bteam': 'PONT DE METZ',
          'date': '27-01-2019',
          'day': '9',
          'place': 'Boulogne',
          'schedule': '12h35'
        },
        {
          'ascore': '2',
          'ateam': 'VALENCIENNES',
          'bscore': '11',
          'bteam': 'DUNKERQUE',
          'date': '27-01-2019',
          'day': '9',
          'place': 'Boulogne',
          'schedule': '14h00'
        },
        {
          'ascore': '10',
          'ateam': 'AMIENS',
          'bscore': '1',
          'bteam': 'PONT DE METZ',
          'date': '03-02-2019',
          'day': '10',
          'place': 'PONT DE METZ',
          'schedule': '10h00'
        },
        {
          'ascore': '5',
          'ateam': 'DUNKERQUE',
          'bscore': '8',
          'bteam': 'BETHUNE',
          'date': '03-02-2019',
          'day': '10',
          'place': 'Pont de Metz',
          'schedule': '12h00'
        },
        {
          'ascore': '11',
          'ateam': 'MOREUIL',
          'bscore': '15',
          'bteam': 'BOULOGNE SUR MER',
          'date': '03-02-2019',
          'day': '10',
          'place': 'Moreuil',
          'schedule': '14h00'
        },
        {
          'ascore': '6',
          'ateam': 'MOREUIL',
          'bscore': '12',
          'bteam': 'BETHUNE',
          'date': '10-02-2019',
          'day': '11',
          'place': 'Moreuil',
          'schedule': '10h00'
        },
        {
          'ascore': '5',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '6',
          'bteam': 'DUNKERQUE',
          'date': '10-02-2019',
          'day': '11',
          'place': 'boulogne sur mer',
          'schedule': '10h00'
        },
        {
          'ascore': '2',
          'ateam': 'VALENCIENNES',
          'bscore': '10',
          'bteam': 'AMIENS',
          'date': '10-02-2019',
          'day': '11',
          'place': 'Moreuil',
          'schedule': '12h00'
        },
        {
          'ascore': '10',
          'ateam': 'AMIENS',
          'bscore': '6',
          'bteam': 'MOREUIL',
          'date': '10-03-2019',
          'day': '12',
          'place': 'Moreuil',
          'schedule': '10h00'
        },
        {
          'ascore': '5',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '9',
          'bteam': 'VALENCIENNES',
          'date': '10-03-2019',
          'day': '12',
          'place': 'Boulogne',
          'schedule': '10h00'
        },
        {
          'ascore': '5',
          'ateam': 'PONT DE METZ',
          'bscore': '9',
          'bteam': 'BETHUNE',
          'date': '10-03-2019',
          'day': '12',
          'place': 'Boulogne',
          'schedule': '12h00'
        },
        {
          'ascore': '9',
          'ateam': 'PONT DE METZ',
          'bscore': '8',
          'bteam': 'MOREUIL',
          'date': '17-03-2019',
          'day': '13',
          'place': 'Amiens',
          'schedule': '10h00'
        },
        {
          'ascore': '4',
          'ateam': 'VALENCIENNES',
          'bscore': '9',
          'bteam': 'BETHUNE',
          'date': '17-03-2019',
          'day': '13',
          'place': 'Amiens',
          'schedule': '12h00'
        },
        {
          'ascore': '5',
          'ateam': 'AMIENS',
          'bscore': '0',
          'bteam': 'DUNKERQUE',
          'date': '17-03-2019',
          'day': '13',
          'place': 'Amiens',
          'schedule': '14h00'
        }
      ]
    },
    {
      year: '2017-2018',
      rankings: [
        {
          'draws': 'E.',
          'forfaited': 'F.',
          'goals': 'buts',
          'goalsAllowed': 'BE.',
          'goalsDiff': 'diff.',
          'loses': 'P.',
          'played': 'J.',
          'points': 'Pts',
          'rank': 'Pl',
          'teams': 'Equipe',
          'wins': 'V.'
        },
        {
          'draws': '2',
          'forfaited': '0',
          'goals': '141',
          'goalsAllowed': '39',
          'goalsDiff': '102',
          'loses': '1',
          'played': '14',
          'points': '35',
          'rank': '1',
          'teams': 'Camon',
          'wins': '11'
        },
        {
          'draws': '1',
          'forfaited': '0',
          'goals': '99',
          'goalsAllowed': '44',
          'goalsDiff': '55',
          'loses': '2',
          'played': '13',
          'points': '31',
          'rank': '2',
          'teams': 'Bethune',
          'wins': '10'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '108',
          'goalsAllowed': '56',
          'goalsDiff': '52',
          'loses': '5',
          'played': '13',
          'points': '24',
          'rank': '3',
          'teams': 'Pont de Metz',
          'wins': '8'
        },
        {
          'draws': '2',
          'forfaited': '1',
          'goals': '116',
          'goalsAllowed': '69',
          'goalsDiff': '47',
          'loses': '2',
          'played': '13',
          'points': '24',
          'rank': '4',
          'teams': 'Dunkerque',
          'wins': '8'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '44',
          'goalsAllowed': '124',
          'goalsDiff': '-80',
          'loses': '9',
          'played': '13',
          'points': '12',
          'rank': '5',
          'teams': 'Boulogne sur Mer',
          'wins': '4'
        },
        {
          'draws': '0',
          'forfaited': '1',
          'goals': '54',
          'goalsAllowed': '79',
          'goalsDiff': '-25',
          'loses': '6',
          'played': '11',
          'points': '10',
          'rank': '6',
          'teams': 'Amiens',
          'wins': '4'
        },
        {
          'draws': '1',
          'forfaited': '2',
          'goals': '69',
          'goalsAllowed': '96',
          'goalsDiff': '-27',
          'loses': '7',
          'played': '12',
          'points': '3',
          'rank': '7',
          'teams': 'Valenciennes',
          'wins': '2'
        },
        {
          'draws': '0',
          'forfaited': '2',
          'goals': '18',
          'goalsAllowed': '142',
          'goalsDiff': '-124',
          'loses': '9',
          'played': '11',
          'points': '-4',
          'rank': '8',
          'teams': 'Arras-Vyruce',
          'wins': '0'
        }
      ],
      players: [
        {
          'box': 'Pénalités',
          'games': 'Matchs',
          'goals': 'Buts',
          'passes': 'Passes',
          'player': 'Joueur',
          'points': 'Points',
          'rank': 'Pl',
          'team': 'Equipe'
        },
        {
          'box': '10 \' 00',
          'games': '13',
          'goals': '32',
          'passes': '16',
          'players': 'GREGOIRE GIGUERE',
          'points': '48',
          'rank': '1',
          'teams': 'Bethune'
        },
        {
          'box': '8 \' 00',
          'games': '9',
          'goals': '35',
          'passes': '7',
          'players': 'GAUTHIER CHEVALIER',
          'points': '42',
          'rank': '2',
          'teams': 'Valenciennes'
        },
        {
          'box': '4 \' 00',
          'games': '11',
          'goals': '32',
          'passes': '10',
          'players': 'LUCAS DUMERLIE',
          'points': '42',
          'rank': '3',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '12',
          'goals': '25',
          'passes': '13',
          'players': 'BENJAMIN CAVILLON',
          'points': '38',
          'rank': '4',
          'teams': 'Camon'
        },
        {
          'box': '8 \' 00',
          'games': '14',
          'goals': '20',
          'passes': '18',
          'players': 'DAVID BINET',
          'points': '38',
          'rank': '5',
          'teams': 'Camon'
        },
        {
          'box': '6 \' 00',
          'games': '14',
          'goals': '16',
          'passes': '22',
          'players': 'JEROME MORTYR',
          'points': '38',
          'rank': '6',
          'teams': 'Camon'
        },
        {
          'box': '6 \' 00',
          'games': '14',
          'goals': '29',
          'passes': '8',
          'players': 'VICTOR DECAGNY',
          'points': '37',
          'rank': '7',
          'teams': 'Camon'
        },
        {
          'box': '4 \' 00',
          'games': '10',
          'goals': '16',
          'passes': '17',
          'players': 'CLEMENT DEREPPER',
          'points': '33',
          'rank': '8',
          'teams': 'Dunkerque'
        },
        {
          'box': '28 \' 00',
          'games': '9',
          'goals': '22',
          'passes': '7',
          'players': 'ANTOINE JANOT',
          'points': '29',
          'rank': '9',
          'teams': 'Valenciennes'
        },
        {
          'box': '6 \' 00',
          'games': '11',
          'goals': '17',
          'passes': '8',
          'players': 'NICOLAS BRUXELLE',
          'points': '25',
          'rank': '10',
          'teams': 'Pont de Metz'
        },
        {
          'box': '6 \' 00',
          'games': '11',
          'goals': '12',
          'passes': '8',
          'players': 'SEBASTIEN LUGAN JAMES',
          'points': '20',
          'rank': '11',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '14',
          'goals': '12',
          'passes': '7',
          'players': 'GUILLAUME ROSSO',
          'points': '19',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '22 \' 00',
          'games': '13',
          'goals': '12',
          'passes': '7',
          'players': 'JEREMY BENARD',
          'points': '19',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '4 \' 00',
          'games': '7',
          'goals': '14',
          'passes': '4',
          'players': 'VINCENT NAELS',
          'points': '18',
          'rank': '12',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '11',
          'passes': '7',
          'players': 'JEROME ARCELIN',
          'points': '18',
          'rank': '13',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '10',
          'goals': '14',
          'passes': '3',
          'players': 'BENOIT ANDRE',
          'points': '17',
          'rank': '14',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '12',
          'goals': '13',
          'passes': '4',
          'players': 'JULIEN LANGLACE',
          'points': '17',
          'rank': '15',
          'teams': 'Camon'
        },
        {
          'box': '4 \' 00',
          'games': '13',
          'goals': '10',
          'passes': '7',
          'players': 'NICOLAS EYROLLES',
          'points': '17',
          'rank': '16',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '11',
          'goals': '15',
          'passes': '1',
          'players': 'JULIEN CLIPET',
          'points': '16',
          'rank': '17',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '14 \' 00',
          'games': '9',
          'goals': '12',
          'passes': '4',
          'players': 'FLORENT DELAPLACE',
          'points': '16',
          'rank': '18',
          'teams': 'Pont de Metz'
        },
        {
          'box': '20 \' 00',
          'games': '10',
          'goals': '5',
          'passes': '11',
          'players': 'BERANGER JAUZE',
          'points': '16',
          'rank': '19',
          'teams': 'Amiens'
        },
        {
          'box': '8 \' 00',
          'games': '13',
          'goals': '5',
          'passes': '11',
          'players': 'GREGOIRE KUBICKI',
          'points': '16',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '10 \' 00',
          'games': '13',
          'goals': '9',
          'passes': '6',
          'players': 'MARTIN RICHIR',
          'points': '15',
          'rank': '20',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '12',
          'goals': '11',
          'passes': '3',
          'players': 'LUC FOULARD',
          'points': '14',
          'rank': '21',
          'teams': 'Bethune'
        },
        {
          'box': '2 \' 00',
          'games': '9',
          'goals': '8',
          'passes': '6',
          'players': 'DAVID BELLARD',
          'points': '14',
          'rank': '22',
          'teams': 'Camon'
        },
        {
          'box': '12 \' 00',
          'games': '8',
          'goals': '5',
          'passes': '9',
          'players': 'PHILIPPE TANGHE',
          'points': '14',
          'rank': '23',
          'teams': 'Dunkerque'
        },
        {
          'box': '24 \' 00',
          'games': '9',
          'goals': '10',
          'passes': '3',
          'players': 'SIMON LECUELLE',
          'points': '13',
          'rank': '24',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '10',
          'passes': '3',
          'players': 'ULRICH LELONG',
          'points': '13',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '10 \' 00',
          'games': '12',
          'goals': '7',
          'passes': '6',
          'players': 'CEDRIC FOUQUET',
          'points': '13',
          'rank': '25',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '7',
          'goals': '7',
          'passes': '6',
          'players': 'ANTOINE VANWORMHOUDT',
          'points': '13',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '13',
          'goals': '6',
          'passes': '7',
          'players': 'MATHIEU BOISSENOT',
          'points': '13',
          'rank': '26',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '9',
          'passes': '3',
          'players': 'JOHAN BIAUSQUE',
          'points': '12',
          'rank': '27',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '16 \' 00',
          'games': '10',
          'goals': '7',
          'passes': '4',
          'players': 'CHRISTOPHE DEVAUCHELLE',
          'points': '11',
          'rank': '28',
          'teams': 'Bethune'
        },
        {
          'box': '10 \' 00',
          'games': '10',
          'goals': '6',
          'passes': '4',
          'players': 'FRANCOIS MARTEEL',
          'points': '10',
          'rank': '29',
          'teams': 'Dunkerque'
        },
        {
          'box': '8 \' 00',
          'games': '11',
          'goals': '5',
          'passes': '5',
          'players': 'LAURENT GAUSSUIN',
          'points': '10',
          'rank': '30',
          'teams': 'Bethune'
        },
        {
          'box': '4 \' 00',
          'games': '12',
          'goals': '4',
          'passes': '6',
          'players': 'MICKAEL LUGAN JAMES',
          'points': '10',
          'rank': '31',
          'teams': 'Pont de Metz'
        },
        {
          'box': '10 \' 00',
          'games': '11',
          'goals': '6',
          'passes': '3',
          'players': 'SULLIVAN DANTEN',
          'points': '9',
          'rank': '32',
          'teams': 'Pont de Metz'
        },
        {
          'box': '6 \' 00',
          'games': '13',
          'goals': '4',
          'passes': '5',
          'players': 'RAPHAEL POULAIN',
          'points': '9',
          'rank': '33',
          'teams': 'Camon'
        },
        {
          'box': '16 \' 00',
          'games': '8',
          'goals': '3',
          'passes': '6',
          'players': 'JULIEN HARCHIN',
          'points': '9',
          'rank': '34',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '13',
          'goals': '7',
          'passes': '1',
          'players': 'MAXIME DUPONT',
          'points': '8',
          'rank': '35',
          'teams': 'Pont de Metz'
        },
        {
          'box': '22 \' 00',
          'games': '9',
          'goals': '6',
          'passes': '2',
          'players': 'JONATHAN TEMBUYSER',
          'points': '8',
          'rank': '36',
          'teams': 'Bethune'
        },
        {
          'box': '5 \' 00',
          'games': '12',
          'goals': '4',
          'passes': '4',
          'players': 'MAXIME BROUCKE',
          'points': '8',
          'rank': '37',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '9',
          'goals': '5',
          'passes': '2',
          'players': 'THIBAUT WILLAME',
          'points': '7',
          'rank': '38',
          'teams': 'Pont de Metz'
        },
        {
          'box': '10 \' 00',
          'games': '8',
          'goals': '3',
          'passes': '4',
          'players': 'JONATHAN BODEL',
          'points': '7',
          'rank': '39',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '5',
          'passes': '1',
          'players': 'SIMON DESCHEYER',
          'points': '6',
          'rank': '40',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '7',
          'goals': '5',
          'passes': '1',
          'players': 'GABRIEL SPITZ',
          'points': '6',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '2 \' 00',
          'games': '13',
          'goals': '5',
          'passes': '1',
          'players': 'DAVID BILLET',
          'points': '6',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '6 \' 00',
          'games': '12',
          'goals': '4',
          'passes': '2',
          'players': 'VINCENT LUGAN JAMES',
          'points': '6',
          'rank': '41',
          'teams': 'Pont de Metz'
        },
        {
          'box': '16 \' 00',
          'games': '10',
          'goals': '4',
          'passes': '2',
          'players': 'MAXIME DELATTRE',
          'points': '6',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '2 \' 00',
          'games': '13',
          'goals': '3',
          'passes': '3',
          'players': 'GREGORY GAJEWSKI',
          'points': '6',
          'rank': '42',
          'teams': 'Bethune'
        },
        {
          'box': '6 \' 00',
          'games': '6',
          'goals': '2',
          'passes': '4',
          'players': 'VINCENT BOCQUET',
          'points': '6',
          'rank': '43',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '5',
          'passes': '0',
          'players': 'NICOLAS LEFEVRE',
          'points': '5',
          'rank': '44',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '4',
          'passes': '1',
          'players': 'ETIENNE CHASSIN',
          'points': '5',
          'rank': '45',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '3',
          'passes': '2',
          'players': 'JOANNES SAUVAGE',
          'points': '5',
          'rank': '46',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '2',
          'passes': '3',
          'players': 'STEPHANE JOURDAN',
          'points': '5',
          'rank': '47',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '11',
          'goals': '2',
          'passes': '3',
          'players': 'CYRIL LUGUET',
          'points': '5',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '3',
          'goals': '2',
          'passes': '3',
          'players': 'LAURENT BIENKOWSKI',
          'points': '5',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '3',
          'passes': '1',
          'players': 'SEBASTIEN ELVIRA',
          'points': '4',
          'rank': '48',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '26 \' 00',
          'games': '8',
          'goals': '3',
          'passes': '1',
          'players': 'BENOIT FRONTY',
          'points': '4',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '3',
          'passes': '1',
          'players': 'JEREMY LLOBERES',
          'points': '4',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '5 \' 00',
          'games': '10',
          'goals': '2',
          'passes': '2',
          'players': 'STEEVE HERMET',
          'points': '4',
          'rank': '49',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '12',
          'goals': '2',
          'passes': '2',
          'players': 'DAVID RENAUX',
          'points': '4',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '12',
          'goals': '2',
          'passes': '2',
          'players': 'SEBASTIEN DELPLACE',
          'points': '4',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '10 \' 00',
          'games': '5',
          'goals': '1',
          'passes': '3',
          'players': 'MAXIME BALIN',
          'points': '4',
          'rank': '50',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '3',
          'passes': '0',
          'players': 'GEOFFROY CELLE',
          'points': '3',
          'rank': '51',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '6',
          'goals': '3',
          'passes': '0',
          'players': 'ANTOINE PECQUEUR',
          'points': '3',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '16 \' 00',
          'games': '9',
          'goals': '2',
          'passes': '1',
          'players': 'ANTHONY VINCENT',
          'points': '3',
          'rank': '52',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '2',
          'passes': '1',
          'players': 'ELIOTT PAYA',
          'points': '3',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '2',
          'passes': '1',
          'players': 'FRANCOIS MORETTI',
          'points': '3',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '13',
          'goals': '2',
          'passes': '1',
          'players': 'PHILIPPE DUPONT',
          'points': '3',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '2',
          'passes': '1',
          'players': 'JEROME HOLLEVOET',
          'points': '3',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '4 \' 00',
          'games': '6',
          'goals': '1',
          'passes': '2',
          'players': 'ANTHONY GRIVAUD',
          'points': '3',
          'rank': '53',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '2',
          'players': 'DORIAN LEFEVRE',
          'points': '3',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '4 \' 00',
          'games': '11',
          'goals': '1',
          'passes': '2',
          'players': 'SOPHIE MINY',
          'points': '3',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '2 \' 00',
          'games': '1',
          'goals': '1',
          'passes': '2',
          'players': 'VALENTIN DEMARET',
          'points': '3',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '2',
          'passes': '0',
          'players': 'BENOIT COTON',
          'points': '2',
          'rank': '54',
          'teams': 'Bethune'
        },
        {
          'box': '2 \' 00',
          'games': '4',
          'goals': '2',
          'passes': '0',
          'players': 'MATHIEU TARDIVEL',
          'points': '2',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '6 \' 00',
          'games': '6',
          'goals': '2',
          'passes': '0',
          'players': 'BERTRAND BRASSART',
          'points': '2',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '9',
          'goals': '2',
          'passes': '0',
          'players': 'JULIEN LEROY',
          'points': '2',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '8 \' 00',
          'games': '6',
          'goals': '1',
          'passes': '1',
          'players': 'SYLVAIN RENOUF',
          'points': '2',
          'rank': '55',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '1',
          'passes': '1',
          'players': 'BRUNO DARE',
          'points': '2',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '6 \' 00',
          'games': '11',
          'goals': '1',
          'passes': '1',
          'players': 'PASCAL MINY',
          'points': '2',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '1',
          'players': 'THOMAS JORON',
          'points': '2',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '1',
          'players': 'THOMAS POMMIER',
          'points': '2',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '7 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '1',
          'players': 'CLEMENT LAIGNIER',
          'points': '2',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '12',
          'goals': '1',
          'passes': '1',
          'players': 'VALENTIN LANOY',
          'points': '2',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '11',
          'goals': '0',
          'passes': '2',
          'players': 'FAUSTIN FACOMPREZ',
          'points': '2',
          'rank': '56',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '1',
          'passes': '0',
          'players': 'PHILIPPE POUSSART',
          'points': '1',
          'rank': '57',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '1',
          'passes': '0',
          'players': 'ADRIEN GOSSET',
          'points': '1',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '4 \' 00',
          'games': '7',
          'goals': '1',
          'passes': '0',
          'players': 'VALENTIN DHORNE',
          'points': '1',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '1',
          'passes': '0',
          'players': 'BENOIT LEMIUS',
          'points': '1',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '0',
          'players': 'ALEXIS PRANGERE',
          'points': '1',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '0',
          'players': 'LAURENT BLOIS',
          'points': '1',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '1',
          'players': 'MARGAUX DECHERF',
          'points': '1',
          'rank': '58',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '0',
          'passes': '1',
          'players': 'NICOLAS MAIRE',
          'points': '1',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '1',
          'players': 'MAXENCE GILLION',
          'points': '1',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '0',
          'passes': '1',
          'players': 'NICOLAS COUSIN',
          'points': '1',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '1',
          'players': 'ERIC BARTH',
          'points': '1',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '1',
          'players': 'VINCENT LALOUX',
          'points': '1',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '4 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '0',
          'players': 'NICOLAS VASSEUR',
          'points': '0',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'BASTIEN POUCET',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'TRISTAN LESNE',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '4 \' 00',
          'games': '10',
          'goals': '0',
          'passes': '0',
          'players': 'FRANCOIS QUEMENER',
          'points': '0',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'YANNICK LENGLET',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '6 \' 00',
          'games': '7',
          'goals': '0',
          'passes': '0',
          'players': 'BENOIT KAMINSKI',
          'points': '0',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '0',
          'players': 'NICOLAS BONIN',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '28 \' 00',
          'games': '9',
          'goals': '0',
          'passes': '0',
          'players': 'MATHIEU MINY',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '0',
          'players': 'NICOLAS RIDOUX',
          'points': '0',
          'rank': '',
          'teams': 'Bethune'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'LAURENT PHILIPPON',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '0',
          'players': 'NICOLAS DE JONGHE',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'DAVID JOLLY',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '6 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '0',
          'players': 'CHRISTOPHER AMIET',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '0',
          'players': 'REMI BOUCHEZ',
          'points': '0',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '0 \' 00',
          'games': '14',
          'goals': '0',
          'passes': '0',
          'players': 'THOMAS LEFEBVRE',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'ANTOINE DEMARET',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'FRANCK BEAUVOIS',
          'points': '0',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '10',
          'goals': '0',
          'passes': '0',
          'players': 'GUILLAUME COPIN',
          'points': '0',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '0',
          'players': 'LAURENT BLONDE',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '10 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'STEPHANE BERNARD',
          'points': '0',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '0',
          'players': 'TEDDY LECOMTE',
          'points': '0',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '0',
          'players': 'JIM BINET',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '13',
          'goals': '0',
          'passes': '0',
          'players': 'BASTIEN FACOMPREZ',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'ALEXIS JASPART',
          'points': '0',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '10',
          'goals': '0',
          'passes': '0',
          'players': 'FREDERIC TALMANT',
          'points': '0',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'HUGO CARON',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '4 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'PIERRE-ANTOINE PICARD',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'LAURENT DALLERY',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'MARTIN DECHERF',
          'points': '0',
          'rank': '',
          'teams': 'Arras-Vyruce'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'SYLVAIN DUMONT',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '30 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'SEBASTIEN FRONTY',
          'points': '0',
          'rank': '',
          'teams': 'Valenciennes'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '0',
          'players': 'BENOIT FACOMPREZ',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '9',
          'goals': '0',
          'passes': '0',
          'players': 'DOMINIQUE DECAGNY',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '11',
          'goals': '0',
          'passes': '0',
          'players': 'ANTHONY BUTIN',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '2 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'JEREMY CHEVALIER',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '2 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'JEREMY MARCEL',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '12',
          'goals': '0',
          'passes': '0',
          'players': 'CHRISTOPHE BOUILLEZ',
          'points': '0',
          'rank': '',
          'teams': 'Bethune'
        }
      ],
      results: [
        {
          'ascore': '1',
          'ateam': 'ARRAS-VYRUCE',
          'bscore': '19',
          'bteam': 'CAMON',
          'date': '29-10-2017',
          'day': '1',
          'place': 'St Catherine les Arras',
          'schedule': '10h15'
        },
        {
          'ascore': '7',
          'ateam': 'VALENCIENNES',
          'bscore': '5',
          'bteam': 'BOULOGNE SUR MER',
          'date': '29-10-2017',
          'day': '1',
          'place': 'St Catherine les Arras',
          'schedule': '12h00'
        },
        {
          'ascore': '7',
          'ateam': 'BETHUNE',
          'bscore': '2',
          'bteam': 'DUNKERQUE',
          'date': '29-10-2017',
          'day': '1',
          'place': 'St Catherine les Arras',
          'schedule': '14h00'
        },
        {
          'ascore': '10',
          'ateam': 'PONT DE METZ',
          'bscore': '7',
          'bteam': 'AMIENS',
          'date': '11-11-2017',
          'day': '1',
          'place': 'PONT DE METZ',
          'schedule': '20h30'
        },
        {
          'ascore': '2',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '10',
          'bteam': 'CAMON',
          'date': '05-11-2017',
          'day': '2',
          'place': 'BOULOGNE',
          'schedule': '09h00'
        },
        {
          'ascore': '3',
          'ateam': 'ARRAS-VYRUCE',
          'bscore': '12',
          'bteam': 'BETHUNE',
          'date': '05-11-2017',
          'day': '2',
          'place': 'St Catherine les Arras',
          'schedule': '09h00'
        },
        {
          'ascore': '7',
          'ateam': 'VALENCIENNES',
          'bscore': '9',
          'bteam': 'AMIENS',
          'date': '05-11-2017',
          'day': '2',
          'place': 'St Catherine les Arras',
          'schedule': '11h00'
        },
        {
          'ascore': '10',
          'ateam': 'DUNKERQUE',
          'bscore': '7',
          'bteam': 'PONT DE METZ',
          'date': '05-11-2017',
          'day': '2',
          'place': 'BOULOGNE',
          'schedule': '12h00'
        },
        {
          'ascore': '11',
          'ateam': 'PONT DE METZ',
          'bscore': '8',
          'bteam': 'VALENCIENNES',
          'date': '18-11-2017',
          'day': '3',
          'place': 'PONT DE METZ',
          'schedule': '20h00'
        },
        {
          'ascore': '3',
          'ateam': 'ARRAS-VYRUCE',
          'bscore': '8',
          'bteam': 'AMIENS',
          'date': '19-11-2017',
          'day': '3',
          'place': 'St Catherine les Arras',
          'schedule': '10h00'
        },
        {
          'ascore': '2',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '10',
          'bteam': 'DUNKERQUE',
          'date': '19-11-2017',
          'day': '3',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '7',
          'ateam': 'BETHUNE',
          'bscore': '4',
          'bteam': 'CAMON',
          'date': '19-11-2017',
          'day': '3',
          'place': 'BOULOGNE',
          'schedule': '12h00'
        },
        {
          'ascore': '16',
          'ateam': 'DUNKERQUE',
          'bscore': '3',
          'bteam': 'ARRAS-VYRUCE',
          'date': '26-11-2017',
          'day': '4',
          'place': 'BOULOGNE',
          'schedule': '09h00'
        },
        {
          'ascore': '14',
          'ateam': 'CAMON',
          'bscore': '3',
          'bteam': 'VALENCIENNES',
          'date': '26-11-2017',
          'day': '4',
          'place': 'AMIENS',
          'schedule': '10h00'
        },
        {
          'ascore': '1',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '20',
          'bteam': 'PONT DE METZ',
          'date': '26-11-2017',
          'day': '4',
          'place': 'BOULOGNE',
          'schedule': '11h00'
        },
        {
          'ascore': '9',
          'ateam': 'BETHUNE',
          'bscore': '2',
          'bteam': 'AMIENS',
          'date': '26-11-2017',
          'day': '4',
          'place': 'BOULOGNE',
          'schedule': '13h00'
        },
        {
          'ascore': '2',
          'ateam': 'AMIENS',
          'bscore': '10',
          'bteam': 'CAMON',
          'date': '03-12-2017',
          'day': '5',
          'place': 'AMIENS',
          'schedule': '09h00'
        },
        {
          'ascore': '1',
          'ateam': 'ARRAS-VYRUCE',
          'bscore': '6',
          'bteam': 'BOULOGNE SUR MER',
          'date': '03-12-2017',
          'day': '5',
          'place': 'St Catherine les Arras',
          'schedule': '10h00'
        },
        {
          'ascore': '9',
          'ateam': 'VALENCIENNES',
          'bscore': '9',
          'bteam': 'DUNKERQUE',
          'date': '03-12-2017',
          'day': '5',
          'place': 'St Catherine les Arras',
          'schedule': '12h10'
        },
        {
          'ascore': '1',
          'ateam': 'BETHUNE',
          'bscore': '2',
          'bteam': 'PONT DE METZ',
          'date': '03-12-2017',
          'day': '5',
          'place': 'St Catherine les Arras',
          'schedule': '14h00'
        },
        {
          'ascore': '3',
          'ateam': 'PONT DE METZ',
          'bscore': '6',
          'bteam': 'CAMON',
          'date': '06-01-2018',
          'day': '6',
          'place': 'PONT DE METZ',
          'schedule': '20h00'
        },
        {
          'ascore': '10',
          'ateam': 'DUNKERQUE',
          'bscore': '6',
          'bteam': 'AMIENS',
          'date': '08-04-2018',
          'day': '6',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '2',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '15',
          'bteam': 'BETHUNE',
          'date': '08-04-2018',
          'day': '6',
          'place': 'BOULOGNE',
          'schedule': '12h30'
        },
        {
          'ascore': '1',
          'ateam': 'ARRAS-VYRUCE',
          'bscore': '10',
          'bteam': 'PONT DE METZ',
          'date': '14-01-2018',
          'day': '7',
          'place': 'SAINTE CATHERINE LES ARRAS',
          'schedule': '10h00'
        },
        {
          'ascore': '5',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '0',
          'bteam': 'AMIENS',
          'date': '14-01-2018',
          'day': '7',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '6',
          'ateam': 'DUNKERQUE',
          'bscore': '6',
          'bteam': 'CAMON',
          'date': '14-01-2018',
          'day': '7',
          'place': 'BOULOGNE',
          'schedule': '12h00'
        },
        {
          'ascore': '9',
          'ateam': 'BETHUNE',
          'bscore': '4',
          'bteam': 'VALENCIENNES',
          'date': '14-01-2018',
          'day': '7',
          'place': 'SAINTE CATHERINE LES ARRAS',
          'schedule': '12h00'
        },
        {
          'ascore': '7',
          'ateam': 'DUNKERQUE',
          'bscore': '3',
          'bteam': 'BETHUNE',
          'date': '28-01-2018',
          'day': '8',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '19',
          'ateam': 'CAMON',
          'bscore': '1',
          'bteam': 'ARRAS-VYRUCE',
          'date': '28-01-2018',
          'day': '8',
          'place': 'AMIENS',
          'schedule': '11h00'
        },
        {
          'ascore': '5',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '3',
          'bteam': 'VALENCIENNES',
          'date': '28-01-2018',
          'day': '8',
          'place': 'BOULOGNE',
          'schedule': '12h00'
        },
        {
          'ascore': '6',
          'ateam': 'AMIENS',
          'bscore': '3',
          'bteam': 'PONT DE METZ',
          'date': '11-03-2018',
          'day': '8',
          'place': 'AMIENS',
          'schedule': '10h00'
        },
        {
          'ascore': '14',
          'ateam': 'CAMON',
          'bscore': '0',
          'bteam': 'BOULOGNE SUR MER',
          'date': '10-02-2018',
          'day': '9',
          'place': 'AMIENS',
          'schedule': '20h30'
        },
        {
          'ascore': '12',
          'ateam': 'PONT DE METZ',
          'bscore': '4',
          'bteam': 'DUNKERQUE',
          'date': '10-02-2018',
          'day': '9',
          'place': 'PONT DE METZ',
          'schedule': '20h30'
        },
        {
          'ascore': '9',
          'ateam': 'AMIENS',
          'bscore': '7',
          'bteam': 'VALENCIENNES',
          'date': '11-02-2018',
          'day': '9',
          'place': 'AMIENS',
          'schedule': '12h25'
        },
        {
          'ascore': '5',
          'ateam': 'BETHUNE',
          'bscore': '0',
          'bteam': 'ARRAS-VYRUCE',
          'date': '11-02-2018',
          'day': '9',
          'place': 'LAMBERSART',
          'schedule': '13h00'
        },
        {
          'ascore': '0',
          'ateam': 'VALENCIENNES',
          'bscore': '5',
          'bteam': 'PONT DE METZ',
          'date': '17-02-2018',
          'day': '10',
          'place': 'TOURCOING',
          'schedule': '18h30'
        },
        {
          'ascore': '13',
          'ateam': 'DUNKERQUE',
          'bscore': '7',
          'bteam': 'BOULOGNE SUR MER',
          'date': '25-02-2018',
          'day': '10',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '8',
          'ateam': 'CAMON',
          'bscore': '8',
          'bteam': 'BETHUNE',
          'date': '25-02-2018',
          'day': '10',
          'place': 'AMIENS',
          'schedule': '12h00'
        },
        {
          'ascore': '20',
          'ateam': 'PONT DE METZ',
          'bscore': '1',
          'bteam': 'BOULOGNE SUR MER',
          'date': '03-03-2018',
          'day': '11',
          'place': 'PONT DE METZ',
          'schedule': '20h30'
        },
        {
          'ascore': '2',
          'ateam': 'ARRAS-VYRUCE',
          'bscore': '24',
          'bteam': 'DUNKERQUE',
          'date': '04-03-2018',
          'day': '11',
          'place': 'SAINTE CATHERINE LES ARRAS',
          'schedule': '09h00'
        },
        {
          'ascore': '3',
          'ateam': 'AMIENS',
          'bscore': '7',
          'bteam': 'BETHUNE',
          'date': '04-03-2018',
          'day': '11',
          'place': 'AMIENS',
          'schedule': '10h00'
        },
        {
          'ascore': '3',
          'ateam': 'VALENCIENNES',
          'bscore': '12',
          'bteam': 'CAMON',
          'date': '04-03-2018',
          'day': '11',
          'place': 'SAINTE CATHERINE LES ARRAS',
          'schedule': '11h00'
        },
        {
          'ascore': '8',
          'ateam': 'CAMON',
          'bscore': '2',
          'bteam': 'AMIENS',
          'date': '17-03-2018',
          'day': '12',
          'place': 'AMIENS',
          'schedule': '18h10'
        },
        {
          'ascore': '5',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '0',
          'bteam': 'ARRAS-VYRUCE',
          'date': '18-03-2018',
          'day': '12',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '4',
          'ateam': 'PONT DE METZ',
          'bscore': '5',
          'bteam': 'BETHUNE',
          'date': '18-03-2018',
          'day': '12',
          'place': 'PONT DE METZ',
          'schedule': '11h00'
        },
        {
          'ascore': '5',
          'ateam': 'DUNKERQUE',
          'bscore': '0',
          'bteam': 'VALENCIENNES',
          'date': '18-03-2018',
          'day': '12',
          'place': 'BOULOGNE',
          'schedule': '12h00'
        },
        {
          'ascore': '6',
          'ateam': 'CAMON',
          'bscore': '1',
          'bteam': 'PONT DE METZ',
          'date': '25-03-2018',
          'day': '13',
          'place': 'AMIENS',
          'schedule': '09h00'
        },
        {
          'ascore': '3',
          'ateam': 'ARRAS-VYRUCE',
          'bscore': '18',
          'bteam': 'VALENCIENNES',
          'date': '25-03-2018',
          'day': '13',
          'place': 'SAINTE CATHERINE LES ARRAS',
          'schedule': '10h00'
        },
        {
          'ascore': '11',
          'ateam': 'BETHUNE',
          'bscore': '3',
          'bteam': 'BOULOGNE SUR MER',
          'date': '25-03-2018',
          'day': '13',
          'place': 'SAINTE CATHERINE LES ARRAS',
          'schedule': '12h00'
        },
        {
          'ascore': '5',
          'ateam': 'CAMON',
          'bscore': '0',
          'bteam': 'DUNKERQUE',
          'date': '01-04-2018',
          'day': '14',
          'place': 'PONT DE METZ',
          'schedule': '14h00'
        }
      ]
    },
    {
      year: '2016-2017',
      rankings: [
        {
          'draws': 'E.',
          'forfaited': 'F.',
          'goals': 'buts',
          'goalsAllowed': 'BE.',
          'goalsDiff': 'diff.',
          'loses': 'P.',
          'played': 'J.',
          'points': 'Pts',
          'rank': 'Pl',
          'teams': 'Equipe',
          'wins': 'V.'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '101',
          'goalsAllowed': '33',
          'goalsDiff': '68',
          'loses': '0',
          'played': '10',
          'points': '30',
          'rank': '1',
          'teams': 'Tourcoing',
          'wins': '10'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '46',
          'goalsAllowed': '36',
          'goalsDiff': '10',
          'loses': '3',
          'played': '7',
          'points': '12',
          'rank': '2',
          'teams': 'Camon',
          'wins': '4'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '54',
          'goalsAllowed': '53',
          'goalsDiff': '1',
          'loses': '4',
          'played': '8',
          'points': '12',
          'rank': '3',
          'teams': 'Pont de Metz',
          'wins': '4'
        },
        {
          'draws': '0',
          'forfaited': '0',
          'goals': '18',
          'goalsAllowed': '37',
          'goalsDiff': '-19',
          'loses': '3',
          'played': '5',
          'points': '6',
          'rank': '4',
          'teams': 'Amiens',
          'wins': '2'
        },
        {
          'draws': '1',
          'forfaited': '1',
          'goals': '46',
          'goalsAllowed': '50',
          'goalsDiff': '-4',
          'loses': '4',
          'played': '8',
          'points': '5',
          'rank': '5',
          'teams': 'Dunkerque',
          'wins': '2'
        },
        {
          'draws': '1',
          'forfaited': '0',
          'goals': '21',
          'goalsAllowed': '77',
          'goalsDiff': '-56',
          'loses': '7',
          'played': '8',
          'points': '1',
          'rank': '6',
          'teams': 'Boulogne sur Mer',
          'wins': '0'
        }
      ],
      players: [
        {
          'box': 'Pénalités',
          'games': 'Matchs',
          'goals': 'Buts',
          'passes': 'Passes',
          'player': 'Joueur',
          'points': 'Points',
          'rank': 'Pl',
          'team': 'Equipe'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '27',
          'passes': '7',
          'players': 'KEVIN LOYEUX',
          'points': '34',
          'rank': '1',
          'teams': 'Tourcoing'
        },
        {
          'box': '2 \' 00',
          'games': '9',
          'goals': '7',
          'passes': '15',
          'players': 'SIMON DELHUILLE',
          'points': '22',
          'rank': '2',
          'teams': 'Tourcoing'
        },
        {
          'box': '36 \' 00',
          'games': '7',
          'goals': '12',
          'passes': '9',
          'players': 'PIERRE LEMAY',
          'points': '21',
          'rank': '3',
          'teams': 'Tourcoing'
        },
        {
          'box': '10 \' 00',
          'games': '6',
          'goals': '9',
          'passes': '7',
          'players': 'MIGUEL HOUZE',
          'points': '16',
          'rank': '4',
          'teams': 'Dunkerque'
        },
        {
          'box': '16 \' 00',
          'games': '7',
          'goals': '8',
          'passes': '8',
          'players': 'BENJAMIN CAVILLON',
          'points': '16',
          'rank': '5',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '13',
          'passes': '1',
          'players': 'THOMAS BEVILACQUA',
          'points': '14',
          'rank': '6',
          'teams': 'Tourcoing'
        },
        {
          'box': '16 \' 00',
          'games': '9',
          'goals': '8',
          'passes': '6',
          'players': 'THIBAULT LALOUETTE',
          'points': '14',
          'rank': '7',
          'teams': 'Tourcoing'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '3',
          'passes': '11',
          'players': 'JEROME MORTYR',
          'points': '14',
          'rank': '8',
          'teams': 'Camon'
        },
        {
          'box': '6 \' 00',
          'games': '6',
          'goals': '10',
          'passes': '3',
          'players': 'SIMON DESCHEYER',
          'points': '13',
          'rank': '9',
          'teams': 'Dunkerque'
        },
        {
          'box': '16 \' 00',
          'games': '5',
          'goals': '9',
          'passes': '4',
          'players': 'JULIEN BRIDOUX',
          'points': '13',
          'rank': '10',
          'teams': 'Tourcoing'
        },
        {
          'box': '6 \' 00',
          'games': '6',
          'goals': '8',
          'passes': '4',
          'players': 'JEROME ARCELIN',
          'points': '12',
          'rank': '11',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '6',
          'passes': '6',
          'players': 'NICOLAS BRUXELLE',
          'points': '12',
          'rank': '12',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '8',
          'passes': '3',
          'players': 'MAXIME BROUCKE',
          'points': '11',
          'rank': '13',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '9',
          'goals': '6',
          'passes': '5',
          'players': 'LOIC JACQUOT',
          'points': '11',
          'rank': '14',
          'teams': 'Tourcoing'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '8',
          'passes': '2',
          'players': 'VALENTIN DEMARET',
          'points': '10',
          'rank': '15',
          'teams': 'Pont de Metz'
        },
        {
          'box': '6 \' 00',
          'games': '7',
          'goals': '7',
          'passes': '3',
          'players': 'DAVID BELLARD',
          'points': '10',
          'rank': '16',
          'teams': 'Camon'
        },
        {
          'box': '4 \' 00',
          'games': '8',
          'goals': '4',
          'passes': '6',
          'players': 'JULIEN CLIPET',
          'points': '10',
          'rank': '17',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '4',
          'passes': '6',
          'players': 'GUILLAUME DANTEN',
          'points': '10',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '2 \' 00',
          'games': '6',
          'goals': '8',
          'passes': '1',
          'players': 'JULIEN LANGLACE',
          'points': '9',
          'rank': '18',
          'teams': 'Camon'
        },
        {
          'box': '2 \' 00',
          'games': '5',
          'goals': '6',
          'passes': '3',
          'players': 'SEBASTIEN LUGAN JAMES',
          'points': '9',
          'rank': '19',
          'teams': 'Pont de Metz'
        },
        {
          'box': '8 \' 00',
          'games': '7',
          'goals': '6',
          'passes': '3',
          'players': 'VICTOR DECAGNY',
          'points': '9',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '6',
          'passes': '2',
          'players': 'JOHAN BIAUSQUE',
          'points': '8',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '5',
          'goals': '3',
          'passes': '5',
          'players': 'PHILIPPE TANGHE',
          'points': '8',
          'rank': '20',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '5',
          'passes': '2',
          'players': 'CYRIL LUGUET',
          'points': '7',
          'rank': '21',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '4',
          'passes': '3',
          'players': 'QUENTIN GERARD',
          'points': '7',
          'rank': '22',
          'teams': 'Tourcoing'
        },
        {
          'box': '26 \' 00',
          'games': '7',
          'goals': '3',
          'passes': '4',
          'players': 'MARTIN RICHIR',
          'points': '7',
          'rank': '23',
          'teams': 'Camon'
        },
        {
          'box': '6 \' 00',
          'games': '7',
          'goals': '5',
          'passes': '1',
          'players': 'DAVID BINET',
          'points': '6',
          'rank': '24',
          'teams': 'Camon'
        },
        {
          'box': '6 \' 00',
          'games': '7',
          'goals': '5',
          'passes': '1',
          'players': 'MICKAEL LUGAN JAMES',
          'points': '6',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '4 \' 00',
          'games': '4',
          'goals': '5',
          'passes': '1',
          'players': 'CHRISTOPHE CARPENTIER',
          'points': '6',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '2 \' 00',
          'games': '4',
          'goals': '3',
          'passes': '3',
          'players': 'ARNAUD PEZE',
          'points': '6',
          'rank': '25',
          'teams': 'Amiens'
        },
        {
          'box': '6 \' 00',
          'games': '3',
          'goals': '3',
          'passes': '3',
          'players': 'CLEMENT DEREPPER',
          'points': '6',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '4',
          'passes': '1',
          'players': 'MAXIME LAFRANCE',
          'points': '5',
          'rank': '26',
          'teams': 'Tourcoing'
        },
        {
          'box': '2 \' 00',
          'games': '7',
          'goals': '4',
          'passes': '1',
          'players': 'RAPHAEL POULAIN',
          'points': '5',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '6 \' 00',
          'games': '6',
          'goals': '2',
          'passes': '3',
          'players': 'TANGUY JARDIN',
          'points': '5',
          'rank': '27',
          'teams': 'Tourcoing'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '2',
          'passes': '3',
          'players': 'BENOIT ANDRE',
          'points': '5',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '2',
          'passes': '3',
          'players': 'OLIVIER DUPONT',
          'points': '5',
          'rank': '',
          'teams': 'Tourcoing'
        },
        {
          'box': '2 \' 00',
          'games': '5',
          'goals': '1',
          'passes': '4',
          'players': 'CEDRIC FOUQUET',
          'points': '5',
          'rank': '28',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '3',
          'passes': '1',
          'players': 'MAXIME DUPONT',
          'points': '4',
          'rank': '29',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '2',
          'passes': '2',
          'players': 'ALBAN MENGUELTI',
          'points': '4',
          'rank': '30',
          'teams': 'Tourcoing'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '3',
          'players': 'LUCAS DUMERLIE',
          'points': '4',
          'rank': '31',
          'teams': 'Dunkerque'
        },
        {
          'box': '14 \' 00',
          'games': '1',
          'goals': '3',
          'passes': '0',
          'players': 'ANTOINE VANWORMHOUDT',
          'points': '3',
          'rank': '32',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '2',
          'passes': '1',
          'players': 'VALENTIN LANOY',
          'points': '3',
          'rank': '33',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '2',
          'passes': '1',
          'players': 'HENRI VAILLANT',
          'points': '3',
          'rank': '',
          'teams': 'Tourcoing'
        },
        {
          'box': '2 \' 00',
          'games': '6',
          'goals': '2',
          'passes': '1',
          'players': 'MATHIEU BOISSENOT',
          'points': '3',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '2',
          'passes': '1',
          'players': 'NICOLAS EYROLLES',
          'points': '3',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '7',
          'goals': '1',
          'passes': '2',
          'players': 'THIBAUT WILLAME',
          'points': '3',
          'rank': '34',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '1',
          'passes': '2',
          'players': 'FRANCOIS MARTEEL',
          'points': '3',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '3',
          'players': 'ARNAUD DANEL',
          'points': '3',
          'rank': '35',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '6 \' 00',
          'games': '4',
          'goals': '2',
          'passes': '0',
          'players': 'YANNICK MAILLET',
          'points': '2',
          'rank': '36',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '2 \' 00',
          'games': '4',
          'goals': '2',
          'passes': '0',
          'players': 'FLORENT DELAPLACE',
          'points': '2',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '10 \' 00',
          'games': '5',
          'goals': '2',
          'passes': '0',
          'players': 'LUDOVIC PANHELEUX',
          'points': '2',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '4 \' 00',
          'games': '3',
          'goals': '2',
          'passes': '0',
          'players': 'JONATHAN BODEL',
          'points': '2',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '2',
          'passes': '0',
          'players': 'ROMAIN GRAVELINES',
          'points': '2',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '1',
          'passes': '1',
          'players': 'SIMON NGUYEN',
          'points': '2',
          'rank': '37',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '1',
          'passes': '1',
          'players': 'CHRISTOPHE BOIS',
          'points': '2',
          'rank': '',
          'teams': 'Tourcoing'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '1',
          'players': 'STEEVE VERSTRAETEN',
          'points': '2',
          'rank': '',
          'teams': 'Tourcoing'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '1',
          'passes': '1',
          'players': 'MAXENCE HAUCHECORNE',
          'points': '2',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '1',
          'passes': '1',
          'players': 'VINCENT LUGAN JAMES',
          'points': '2',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '7 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '1',
          'players': 'BERANGER JAUZE',
          'points': '2',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '4 \' 00',
          'games': '7',
          'goals': '0',
          'passes': '2',
          'players': 'OLIVIER JOURDAN',
          'points': '2',
          'rank': '38',
          'teams': 'Tourcoing'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '0',
          'players': 'THIBAULT DERYCKX',
          'points': '1',
          'rank': '39',
          'teams': 'Tourcoing'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '1',
          'passes': '0',
          'players': 'CYRIL LOUCHET',
          'points': '1',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '0',
          'players': 'REMY VERPILLAT',
          'points': '1',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '18 \' 00',
          'games': '7',
          'goals': '1',
          'passes': '0',
          'players': 'SULLIVAN DANTEN',
          'points': '1',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '2 \' 00',
          'games': '2',
          'goals': '1',
          'passes': '0',
          'players': 'SIMON LECUELLE',
          'points': '1',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '5',
          'goals': '1',
          'passes': '0',
          'players': 'NICOLAS BONIN',
          'points': '1',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '0',
          'players': 'CYRILLE LEJEUNE',
          'points': '1',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '7 \' 00',
          'games': '3',
          'goals': '1',
          'passes': '0',
          'players': 'TANGUY PEPONAS',
          'points': '1',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '16 \' 00',
          'games': '5',
          'goals': '1',
          'passes': '0',
          'players': 'CLEMENT LAIGNIER',
          'points': '1',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '1',
          'passes': '0',
          'players': 'SOPHIE MINY',
          'points': '1',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '0',
          'players': 'JEROME BOULENGER',
          'points': '1',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '1',
          'passes': '0',
          'players': 'MATTHIEU NISON',
          'points': '1',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '2 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '1',
          'players': 'FLORENT MARTIN',
          'points': '1',
          'rank': '40',
          'teams': 'Tourcoing'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '1',
          'players': 'STEPHANE JOURDAN',
          'points': '1',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '1',
          'players': 'VINCENT BOQUET',
          'points': '1',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'ETIENNE CHASSIN',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '2 \' 00',
          'games': '3',
          'goals': '0',
          'passes': '0',
          'players': 'YANNICK LENGLET',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '0',
          'passes': '0',
          'players': 'DAVID RENAUX',
          'points': '0',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'NICOLAS LEFEVRE',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '4',
          'goals': '0',
          'passes': '0',
          'players': 'SYLVAIN DUMONT',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '2 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'PASCAL MINY',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'BASTIEN FACOMPREZ',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '4 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'FAUSTIN FACOMPREZ',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'JOANNES SAUVAGE',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '7',
          'goals': '0',
          'passes': '0',
          'players': 'DAVID JOLLY',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'JULIEN MORTYR',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '2 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'PIERRE-ANTOINE PICARD',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '2 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'BENJAMIN DUCLOS',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'KENNY GERVOIS',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '0',
          'players': 'STEPHANE FIN',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'WILLIAM GROS',
          'points': '0',
          'rank': '',
          'teams': 'Dunkerque'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'THOMAS LEFEBVRE',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '2 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'DAVID BILLET',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'FABRICE BRUXELLE',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'ANTHONY BUTIN',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'ANTOINE DEMARET',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'DOMINIQUE DECAGNY',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '6 \' 00',
          'games': '6',
          'goals': '0',
          'passes': '0',
          'players': 'MATHIEU MINY',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'LEO MINOT',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '5',
          'goals': '0',
          'passes': '0',
          'players': 'BENOIT FACOMPREZ',
          'points': '0',
          'rank': '',
          'teams': 'Boulogne sur Mer'
        },
        {
          'box': '0 \' 00',
          'games': '2',
          'goals': '0',
          'passes': '0',
          'players': 'JULIEN HARCHIN',
          'points': '0',
          'rank': '',
          'teams': 'Amiens'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'GUILLAUME ROSSO',
          'points': '0',
          'rank': '',
          'teams': 'Camon'
        },
        {
          'box': '0 \' 00',
          'games': '8',
          'goals': '0',
          'passes': '0',
          'players': 'PHILIPPE DUPONT',
          'points': '0',
          'rank': '',
          'teams': 'Pont de Metz'
        },
        {
          'box': '0 \' 00',
          'games': '1',
          'goals': '0',
          'passes': '0',
          'players': 'CLEMENT BRUNET',
          'points': '0',
          'rank': '',
          'teams': 'Dunkerque'
        }
      ],
      results: [
        {
          'ascore': '4',
          'ateam': 'DUNKERQUE',
          'bscore': '5',
          'bteam': 'TOURCOING',
          'date': '06-11-2016',
          'day': '1',
          'place': 'TOURCOING',
          'schedule': '12h00'
        },
        {
          'ascore': '4',
          'ateam': 'AMIENS',
          'bscore': '7',
          'bteam': 'CAMON',
          'date': '06-11-2016',
          'day': '1',
          'place': 'AMIENS',
          'schedule': '15h00'
        },
        {
          'ascore': '13',
          'ateam': 'TOURCOING',
          'bscore': '3',
          'bteam': 'AMIENS',
          'date': '19-11-2016',
          'day': '2',
          'place': 'TOURCOING',
          'schedule': '18h30'
        },
        {
          'ascore': '13',
          'ateam': 'PONT DE METZ',
          'bscore': '3',
          'bteam': 'BOULOGNE SUR MER',
          'date': '20-11-2016',
          'day': '2',
          'place': 'PONT DE METZ',
          'schedule': '10h00'
        },
        {
          'ascore': '7',
          'ateam': 'PONT DE METZ',
          'bscore': '8',
          'bteam': 'TOURCOING',
          'date': '26-11-2016',
          'day': '3',
          'place': 'PONT DE METZ',
          'schedule': '18h00'
        },
        {
          'ascore': '7',
          'ateam': 'PONT DE METZ',
          'bscore': '5',
          'bteam': 'DUNKERQUE',
          'date': '03-12-2016',
          'day': '4',
          'place': 'PONT DE METZ',
          'schedule': '15h30'
        },
        {
          'ascore': '9',
          'ateam': 'CAMON',
          'bscore': '2',
          'bteam': 'BOULOGNE SUR MER',
          'date': '03-12-2016',
          'day': '4',
          'place': 'AMIENS',
          'schedule': '21h50'
        },
        {
          'ascore': '8',
          'ateam': 'TOURCOING',
          'bscore': '3',
          'bteam': 'CAMON',
          'date': '10-12-2016',
          'day': '5',
          'place': 'TOURCOING',
          'schedule': '20h00'
        },
        {
          'ascore': '0',
          'ateam': 'DUNKERQUE',
          'bscore': '5',
          'bteam': 'AMIENS',
          'date': '18-12-2016',
          'day': '5',
          'place': 'AMIENS',
          'schedule': '14h00'
        },
        {
          'ascore': '9',
          'ateam': 'PONT DE METZ',
          'bscore': '5',
          'bteam': 'CAMON',
          'date': '08-01-2017',
          'day': '6',
          'place': 'PONT DE METZ',
          'schedule': '10h00'
        },
        {
          'ascore': '16',
          'ateam': 'DUNKERQUE',
          'bscore': '4',
          'bteam': 'BOULOGNE SUR MER',
          'date': '08-01-2017',
          'day': '6',
          'place': 'TOURCOING',
          'schedule': '12h00'
        },
        {
          'ascore': '14',
          'ateam': 'TOURCOING',
          'bscore': '0',
          'bteam': 'BOULOGNE SUR MER',
          'date': '11-03-2017',
          'day': '7',
          'place': 'LILLE',
          'schedule': '20h30'
        },
        {
          'ascore': '10',
          'ateam': 'TOURCOING',
          'bscore': '6',
          'bteam': 'DUNKERQUE',
          'date': '21-01-2017',
          'day': '8',
          'place': 'TOURCOING',
          'schedule': '20h00'
        },
        {
          'ascore': '3',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '9',
          'bteam': 'PONT DE METZ',
          'date': '29-01-2017',
          'day': '9',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '2',
          'ateam': 'AMIENS',
          'bscore': '14',
          'bteam': 'TOURCOING',
          'date': '29-01-2017',
          'day': '9',
          'place': 'AMIENS',
          'schedule': '15h00'
        },
        {
          'ascore': '3',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '4',
          'bteam': 'AMIENS',
          'date': '05-02-2017',
          'day': '10',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '15',
          'ateam': 'TOURCOING',
          'bscore': '4',
          'bteam': 'PONT DE METZ',
          'date': '05-02-2017',
          'day': '10',
          'place': 'TOURCOING',
          'schedule': '12h00'
        },
        {
          'ascore': '13',
          'ateam': 'CAMON',
          'bscore': '4',
          'bteam': 'DUNKERQUE',
          'date': '05-02-2017',
          'day': '10',
          'place': 'AMIENS',
          'schedule': '14h00'
        },
        {
          'ascore': '7',
          'ateam': 'DUNKERQUE',
          'bscore': '2',
          'bteam': 'PONT DE METZ',
          'date': '02-04-2017',
          'day': '11',
          'place': 'BOULOGNE',
          'schedule': '12h00'
        },
        {
          'ascore': '2',
          'ateam': 'CAMON',
          'bscore': '6',
          'bteam': 'TOURCOING',
          'date': '12-03-2017',
          'day': '12',
          'place': 'AMIENS',
          'schedule': '14h00'
        },
        {
          'ascore': '4',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '4',
          'bteam': 'DUNKERQUE',
          'date': '19-03-2017',
          'day': '13',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        },
        {
          'ascore': '7',
          'ateam': 'CAMON',
          'bscore': '3',
          'bteam': 'PONT DE METZ',
          'date': '19-03-2017',
          'day': '13',
          'place': 'AMIENS',
          'schedule': '14h00'
        },
        {
          'ascore': '2',
          'ateam': 'BOULOGNE SUR MER',
          'bscore': '8',
          'bteam': 'TOURCOING',
          'date': '26-03-2017',
          'day': '14',
          'place': 'BOULOGNE',
          'schedule': '10h00'
        }
      ]
    }
  ]
});