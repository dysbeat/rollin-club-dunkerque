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
