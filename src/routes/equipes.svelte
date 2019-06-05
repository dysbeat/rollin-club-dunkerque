<script>
  import Team from "../components/Team.svelte";
  import { teams } from "../stores/teams.js";
</script>

<style>
  .teams {
    justify-content: center;
  }

  li {
    width: 300px;
  }
</style>

<svelte:head>
  <title>Roll'in Club Dunkerque - Equipes</title>
  <meta
    name="Description"
    content="Présentation des horaires et de l'équipement de hockey des équipes" />
</svelte:head>

<ul class="rows wrap teams">
  {#each $teams as team}
    <li>
      <Team {team} />
    </li>
  {/each}
</ul>
