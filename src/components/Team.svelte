<script>
  import Gears from "./Gears.svelte";
  import Schedules from "./Schedules.svelte";
  export let team;
</script>

<style>
  * {
    text-align: center;
  }
  .container {
    padding-bottom: 72px;
  }

  .pad {
    padding-bottom: 10px;
  }

  .description {
    font-size: 14px;
    font-weight: 400;
    height: 96px;
  }

  .schedules {
    height: 72px;
  }
</style>

<div class="container">
  <p class="blue title pad">{team.name}</p>
  <div class="description">
    <p class="gray">{team.description}</p>
    {#if team.name == 'Enfants loisir'}
      <p class="light-gray">Pret de materiel possible.</p>
    {/if}
  </div>
  <div class="schedules">
    <p class="light-blue title">Horaires</p>
    <Schedules schedules={team.schedules} />
  </div>
  <p class="light-blue title">Equipement</p>
  <Gears gears={team.gears} />
</div>
