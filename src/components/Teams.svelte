<ul class="rows wrap teams">
	{#each teams as team}
	<li>
		<Team team={team} />
	</li>
	{/each}
</ul>
<script>
  import Team from "./Team.svelte";
  import { data } from "../store.js";

  export let teams = $data.teams;
</script>

<style>
  .teams {
    justify-content: center;
  }

  li {
    width: 300px;
  }
</style>