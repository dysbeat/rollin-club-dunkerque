<script>
  export let rankings;
</script>

<style>
  .rank:first-child {
    font-size: 14px;
    font-weight: 600;
  }

  .list {
    justify-content: center;
    font-size: inherit;
    font-weight: inherit;
  }

  .item:first-child {
    min-width: 24px;
  }

  .item {
    min-width: 48px;
    text-align: right;
    font-size: inherit;
    font-weight: inherit;
  }
  .item.team {
    min-width: 176px;
  }

  .header {
    display: grid;
    grid-template-columns: auto 50px 200px repeat(9, 50px) auto;
    grid-template-rows: repeat(1, 20px);
    grid-template-areas: ". info info info info info info info info info info info .";
    grid-column-gap: 0px;
  }

  .rank {
    grid-area: rank;
  }

  .team {
    grid-area: team;
  }

  .pts {
    grid-area: pts;
  }

  .gp {
    grid-area: gp;
  }

  .victory {
    grid-area: victory;
  }

  .defeat {
    grid-area: defeat;
  }

  .draw {
    grid-area: draw;
  }

  .forfait {
    grid-area: forfait;
  }

  .goals {
    grid-area: goals;
  }

  .ga {
    grid-area: ga;
  }

  .diff {
    grid-area: diff;
  }

  .results {
    display: grid;
    grid-template-columns: auto 50px 200px repeat(9, 50px) auto;
    grid-template-rows: repeat(1, 20px);
    grid-template-areas: ". rank team pts gp victory defeat draw forfait goals ga diff .";
    grid-row-gap: 0px;
  }

  @media screen and (max-width: 768px) {
    .show {
      display: none;
    }
  }
</style>

<ul>
  {#each rankings as ranking}
    <li class="gray rank">
      <ul class="rows list {ranking.teams == 'Dunkerque' ? 'blue' : ''}">
        <li class="item">{ranking.rank}</li>
        <li class="item team">{ranking.teams}</li>
        <li class="item">{ranking.points}</li>
        <li class="item show">{ranking.played}</li>
        <li class="item show">{ranking.wins}</li>
        <li class="item show">{ranking.draws}</li>
        <li class="item show">{ranking.loses}</li>
        <li class="item show">{ranking.forfaited}</li>
        <li class="item show">{ranking.goals}</li>
        <li class="item show">{ranking.goalsAllowed}</li>
        <li class="item show">{ranking.goalsDiff}</li>
      </ul>
    </li>
  {/each}
</ul>
