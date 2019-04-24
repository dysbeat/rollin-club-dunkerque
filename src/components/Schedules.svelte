<ul class="columns">
	{#each schedules as schedule}
	<li>
		<Schedule schedule={schedule} />
	</li>
	{/each}
</ul>

<script>
  import Schedule from "./Schedule.svelte";
  export let schedules;
</script>

