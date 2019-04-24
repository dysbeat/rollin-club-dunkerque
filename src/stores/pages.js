import {readable, writable} from 'svelte/store';

export const pages = readable([
  {name: 'Accueil', link: 'home'},             //
  {name: 'Equipes', link: 'teams'},            //
  {name: 'Competition', link: 'competition'},  //
  {name: 'Contact', link: 'contact'}
]);

export const selectedPage = writable('home');