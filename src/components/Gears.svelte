<script>
  import Gear from "./Gear.svelte";
  export let gears;
</script>

<style>
  li {
    padding-bottom: 20px;
  }
</style>

<ul class="columns">
  {#each gears as gear}
    <li>
      <Gear {gear} />
    </li>
  {/each}
</ul>
