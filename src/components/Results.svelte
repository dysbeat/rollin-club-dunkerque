<script>
  import Result from "./Result.svelte";
  export let results;
</script>

<style>
  li {
    width: 100%;
    padding-bottom: 20px;
  }
</style>

<ul class="columns">
  {#each results as result}
    <li>
      <Result {result} />
    </li>
  {/each}
</ul>
