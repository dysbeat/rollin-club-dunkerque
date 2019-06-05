import {readable, writable} from 'svelte/store';

export const pages = readable([
  {name: 'Accueil', link: '.'},                //
  {name: 'Equipes', link: 'equipes'},          //
  {name: 'Competition', link: 'competition'},  //
  {name: 'Contact', link: 'contact'}
]);
