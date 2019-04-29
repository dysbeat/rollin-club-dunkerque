<div class="ranking">
	<p class="large blue title pad">Classement</p>
	<Rankings rankings={season.rankings} />
</div>
<div>
	<p class="large blue title pad">Resultats</p>
	<Results results={season.results} />
</div>

<style>
  .ranking {
    margin-bottom: 50px;
  }
</style>

<script>
  import Rankings from "./Rankings.svelte";
  import Results from "./Results.svelte";

  export let season;
</script>