<ul class="rows menu">
	{#each seasons as season}
	<li on:click={()=> $data.selectedSeason = season.year}>
		<p class='choice {$data.selectedSeason == season.year ? "selected" : ""}'>{season.year}</p>
	</li>
	{/each}
</ul>
<div class="competition">
	{#each seasons as season}
	{#if season.year == $data.selectedSeason}
	<div class="ranking">
		<p class="large blue title pad">Classement</p>
		<Rankings rankings={season.rankings} />
	</div>
	<div class="results">
		<p class="large blue title pad">Resultats</p>
		<Results results={season.results.reverse()} />
	</div>
	{/if}
	{/each}
</div>

<style>
  .competition {
    text-align: center;
  }

  .ranking {
    margin-bottom: 50px;
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
  import Rankings from "./Rankings.svelte";
  import Results from "./Results.svelte";
  import { data } from "../store.js";

  const seasons = $data.seasons;
</script>