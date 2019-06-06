<script>
  import Season from "../../components/Season.svelte";

  import { seasons } from "../../stores/seasons.js";
</script>

<style>
  .competition {
    text-align: center;
  }
</style>

<div class="competition">
  <Season season={$seasons[2]} />
</div>
