import {derived, readable, writable} from 'svelte/store';

import {seasons_data} from './seasons_data';

export const selectedSeason = writable('2019-2020');

export const seasons = readable(seasons_data);

export const selectSeason = derived(
    [selectedSeason, seasons],  //
    ($stores) => {
      const [selectedSeason, seasons] = $stores;
      return seasons.filter(s => s.year == selectedSeason)[0];
    });