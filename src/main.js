import App from './App.svelte';

const app = new App({
  target: document.body,
  data: {
    pages: [
      'home',
      'gears',
      'results',
      'teams',
    ],
    page: 'home'
  }
});


export default app;