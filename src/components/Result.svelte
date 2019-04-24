<p class="info light-gray">{ MakeInfo(result) }</p>
<div class="rows result">
	<p class='dark-gray team a { result.ateam == "DUNKERQUE" ? "blue" : ""}'>{ result.ateam }</p>
	<p class='dark-gray score a { +result.ascore > +result.bscore ? "highlight" : ""}'>{ result.ascore }</p>
	<p class="dark-gray"> | </p>
	<p class='dark-gray score b { +result.bscore > +result.ascore ? "highlight" : ""}'>{ result.bscore }</p>
	<p class='dark-gray team b { result.bteam == "DUNKERQUE" ? "blue" : ""}'>{ result.bteam }</p>
</div>

<style>
  p {
    font-size: 14px;
  }

  .info {
    text-align: center;
    font-weight: 400;
  }

  .result {
    justify-content: center;
    align-items: center;
  }

  .team {
    flex-basis: 40%;
    font-size: 14px;
  }

  .team.a {
    text-align: right;
  }

  .team.b {
    text-align: left;
  }

  .score {
    min-width: 24px;
  }

  .score.a {
    padding-right: 5px;
    text-align: right;
  }

  .score.b {
    padding-left: 5px;
    text-align: left;
  }

  .score.highlight {
    text-decoration: underline;
  }
</style>

<script>
  export let result;
  function MakeInfo(x) {
    return (
      "Le " +
      x.date +
      (x.schedule ? ", " + x.schedule : "") +
      (x.place ? ", à " + x.place.toLowerCase() : "")
    );
  }
</script>
