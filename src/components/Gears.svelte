<ul class="columns">
	{#each gears as gear}
	<li>
		<Gear gear={gear} />
	</li>
	{/each}
</ul>
<style>
  li {
    padding-bottom: 20px;
  }
</style>

<script>
  import Gear from "./Gear.svelte";

  export default {
    components: {
      Gear
    }
  };
</script>