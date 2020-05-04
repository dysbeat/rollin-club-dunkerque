<script>
  export let result;
  function MakeInfo(x) {
    return x.date + (x.place ? ", à " + x.place.toLowerCase() : "");
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
    border-color: hsl(220, 37%, 25%);
  }

  .team {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 30px;
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
    text-decoration: underline;
  }

  .grid {
    display: grid;
    grid-template-columns: auto 300px 50px 10px 50px 300px auto;
    grid-template-rows: repeat(4, 40px);
    grid-template-areas:
      ". info info info info info ."
      ". team-a score-a sep score-b team-b ."
      ". team-a score-a sep score-b team-b ."
      ". team-a score-a sep score-b team-b .";
    grid-column-gap: 0px;
  }
</style>

<div class="grid">
  <p class="info light-gray">{MakeInfo(result)}</p>
  <p
    class="dark-gray team a {result.ateam == 'Dunkerque' ? 'blue' : 'light-blue'}">
    {result.ateam}
  </p>
  <p
    class="dark-gray score a {+result.ascore > +result.bscore ? 'highlight' : ''}">
    {result.ascore}
  </p>
  <p
    class="dark-gray score b {+result.bscore > +result.ascore ? 'highlight' : ''}">
    {result.bscore}
  </p>
  <p
    class="dark-gray team b {result.bteam == 'Dunkerque' ? 'blue' : 'light-blue'}">
    {result.bteam}
  </p>
</div>

<!-- <p class="info light-gray">{MakeInfo(result)}</p> -->
<!-- <div class="rows result"> -->
<!-- </div> -->
