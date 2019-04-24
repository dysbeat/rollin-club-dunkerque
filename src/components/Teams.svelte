<ul class="rows wrap teams">
	{#each $teams as team}
	<li>
		<Team team={team} />
	</li>
	{/each}
</ul>
<script>
  import Team from "./Team.svelte";
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