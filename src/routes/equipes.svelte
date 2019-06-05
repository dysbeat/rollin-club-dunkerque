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

<ul class="rows wrap teams">
  {#each $teams as team}
    <li>
      <Team {team} />
    </li>
  {/each}
</ul>
