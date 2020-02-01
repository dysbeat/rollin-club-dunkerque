<script>
  import Season from "../../components/Season.svelte";

  import { seasons } from "../../stores/seasons.js";
</script>

<style>
  .competition {
    text-align: center;
  }
</style>

<svelte:head>
  <title>
    Roll'in Club Dunkerque - Compétition Pré-nationale 4 - Région Haut-De-France
    - Saison 2016-2017
  </title>
  <meta
    name="Description"
    content="Résultat de la compétition pré-nationale 4 dans la région Haut de
    France, saison 2016-2017" />
</svelte:head>

<div class="competition">
  <Season season={$seasons[0]} />
</div>
