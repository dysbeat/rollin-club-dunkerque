<ul class="rows menu">
	{#each $seasons as season}
	<li on:click={()=> $selectedSeason = season.year}>
		<p class='choice {$selectedSeason == season.year ? "selected" : ""}'>{season.year}</p>
	</li>
	{/each}
</ul>
<div class="competition">
	<Season season={$selectSeason} />
</div>

<style>
  .competition {
    text-align: center;
  }

  .menu {
    align-self: center;
    justify-content: center;
    padding: 5px;
  }

  .pad {
    padding-bottom: 30px;
  }
</style>

<script>
  import Season from "./Season.svelte";
  import { selectedSeason, selectSeason, seasons } from "../stores/seasons.js";
</script>