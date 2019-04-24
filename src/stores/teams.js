import {readable} from 'svelte/store';

export const teams = readable([
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
      {name: 'Coquille', description: ''},
      {name: 'Pantalon', description: 'recouvrant l’ensemble des protections'},
      {name: 'culotte ou gaine', description: 'facultatif'},
      {name: 'gilet rembourré', description: 'facultatif'},
      {name: 'épaulettes rigides interdit', description: ''}
    ]
  }
]);