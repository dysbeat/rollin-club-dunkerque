<script>
  import { onMount } from "svelte";
  import ResultDay from "./ResultDay.svelte";

  export let results;

  let days = [];

  onMount(() => {
    for (let d = 1; d < 15; d++) {
      days.push(results.filter(result => result.day == d));
    }
    console.log("days:", days);
    days = days;
  });
</script>

{#each days as day}
  {#if Array.isArray && Array.isArray(day) && day.length > 0}
    <ResultDay {day} day_number={day[0].day} />
  {/if}
{/each}
