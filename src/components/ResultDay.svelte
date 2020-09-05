<script>
  export let day;
  export let day_number = 0;

  function MakeInfo(x) {
    return x.date + (x.place ? " " + x.place.toUpperCase() : "");
  }
</script>

<style>
  p {
    font-size: 14px;
  }

  .info {
    display: flex;
    align-items: center;
    justify-content: left;
    font-weight: 600;
    font-size: 24px;
    grid-area: info;
    border-bottom: 2px solid;
    border-color: hsl(220, 45%, 50%);
  }

  .team {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 24px;
  }

  .team.a {
    grid-area: team-a;
  }

  .team.b {
    grid-area: team-b;
  }

  .score {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 24px;
  }

  .score.a {
    grid-area: score-a;
  }

  .score.b {
    grid-area: score-b;
  }

  .score.highlight {
    /* font-size: 30px; */
    /* text-decoration: underline; */
  }

  .location {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    transform: rotate(270deg);
    border-top: 1px solid;
    border-color: hsl(203, 15%, 20%);
    grid-area: location;
  }

  .header {
    display: grid;
    grid-template-columns: auto 250px 50px 10px 50px 250px 100px auto;
    grid-template-rows: repeat(1, 40px);
    grid-template-areas: ". info . . . . . .";
    grid-column-gap: 0px;
  }

  .results {
    display: grid;
    grid-template-columns: auto 250px 50px 10px 50px 250px 100px auto;
    grid-template-rows: repeat(3, 40px);
    grid-template-areas:
      ". team-a score-a sep score-b team-b location ."
      ". team-a score-a sep score-b team-b location ."
      ". team-a score-a sep score-b team-b location .";
    grid-column-gap: 0px;
  }

  @media screen and (max-width: 768px) {
    .info {
      justify-content: center;
    }

    .team {
      justify-content: left;
    }

    .header {
      display: grid;
      grid-template-columns: auto 250px 50px auto;
      grid-template-rows: repeat(1, 40px);
      grid-template-areas: ". info info .";
      grid-column-gap: 0px;
    }

    .results {
      display: grid;
      grid-template-columns: auto 250px 50px auto;
      grid-template-rows: repeat(2, 40px);
      grid-template-areas:
        ". team-a score-a ."
        ". team-b score-b .";
      grid-row-gap: 0px;
    }

    .location {
      display: none;
    }
    .sep {
      border-bottom: 1px solid;
      border-color: hsl(203, 15%, 20%);
    }
  }
</style>

<div class="header">
  <p class="info gray">Jour {day_number}</p>
</div>
{#each day as result, idx}
  {#if idx != 0}
    <div class="sep" />
  {/if}
  <div class="results">
    <p
      class="light-gray team a {result.ateam == 'Dunkerque' ? 'light-blue' : ''}">
      {result.ateam}
    </p>
    <p
      class="gray score a {+result.ascore > +result.bscore ? '' : 'lighter-gray'}">
      {result.ascore}
    </p>
    <p
      class="gray score b {+result.bscore > +result.ascore ? '' : 'lighter-gray'}">
      {result.bscore}
    </p>
    <p
      class="light-gray team b {result.bteam == 'Dunkerque' ? 'light-blue' : ''}">
      {result.bteam}
    </p>
    <p class="lighter-gray location">{MakeInfo(result)}</p>
  </div>
{/each}

<!-- <p class="info light-gray">{MakeInfo(result)}</p> -->
<!-- <div class="rows result"> -->
<!-- </div> -->
