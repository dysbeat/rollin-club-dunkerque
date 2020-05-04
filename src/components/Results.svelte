<script>
  import Result from "./Result.svelte";
  import { onMount } from "svelte";

  export let results;
</script>

{#each results as result}
  <Result {result} />
{/each}
