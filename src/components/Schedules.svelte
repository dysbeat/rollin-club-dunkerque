<script>
  import Schedule from "./Schedule.svelte";
  export let schedules;
</script>

<ul class="columns">
  {#each schedules as schedule}
    <li>
      <Schedule {schedule} />
    </li>
  {/each}
</ul>
