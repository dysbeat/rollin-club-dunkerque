<ul class="columns">
	{#each results as result}
	<li>
		<Result result={result} />
	</li>
	{/each}
</ul>


<style>
  li {
    width: 100%;
    padding-bottom: 20px;
  }
</style>

<script>
  import Result from "./Result.svelte";
  export let results;
</script>