<script>
  import Season from "../../components/Season.svelte";
  import { seasons } from "../../stores/seasons.js";

  export let segment;
</script>

<style>
  .menu {
    align-self: center;
    justify-content: center;
    padding: 5px;
  }
</style>

<ul class="rows menu">
  {#each $seasons as season}
    <li>
      <a
        href={'competition' + (season.year == '2019-2020' ? '' : '/' + season.year)}>
        <p
          class="choice {segment == season.year || (segment == undefined && season.year == '2019-2020') ? 'selected' : ''}">
          {season.year}
        </p>
      </a>
    </li>
  {/each}
</ul>

<main>
  <slot />
</main>
