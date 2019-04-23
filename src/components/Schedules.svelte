<ul class="columns">
	{#each schedules as schedule}
	<li>
		<Schedule schedule={schedule} />
	</li>
	{/each}
</ul>

<script>
  import Schedule from "./Schedule.svelte";

  export default {
    components: {
      Schedule
    }
  };
</script>

