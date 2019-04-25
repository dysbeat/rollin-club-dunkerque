<section>
	<p class="large blue title">Roll'in club dunkerque</p>
</section>

<section>
	<p class="light-blue title">Adresse</p>
	<p class="dark-gray">Salle de sport du lycée de l'Europe</p>
	<p class="dark-gray">809 Rue du Banc vert</p>
	<p class="dark-gray">59640 Dunkerque</p>

	<div class="map-container">
		<iframe class="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.847016389118!2d2.353084015917681!3d51.01897505411693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x23103bd5b7fc888!2sGymnase+du+Lyc%C3%A9e+de+l&#39;Europe!5e0!3m2!1sen!2sfr!4v1551816962334"
		 title="map" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>
	</div>
</section>
<div class="rows wrap info">

	<div class="columns teams">
		{#each $teams as team}
		<section>
			<p class="light-blue title">{team.name}</p>
			<p class="dark-gray">{team.description}</p>
			<Schedules schedules={team.schedules} />
		</section>
		{/each}
	</div>

	<section class="results">
		<p class="light-blue title">Derniers résultats</p>
		<Results results={results} />
	</section>
</div>

<style>
  .map-container {
    display: inline-flex;
    justify-content: center;
    width: 100%;
  }

  section {
    padding-bottom: 30px;
    width: 100%;
  }

  .info {
    justify-content: center;
    width: 100%;
  }

  .team-description {
    font-weight: 400;
    margin-bottom: 4px;
  }

  p {
    text-align: center;
  }

  .teams {
    width: 400px;
  }
  .results {
    width: 400px;
  }

  @media screen and (max-width: 768px) {
    .teams {
      width: 100%;
      padding-bottom: 50px;
    }
    .results {
      width: 100%;
    }
  }
</style>

<script>
  import Results from "./Results.svelte";
  import Schedules from "./Schedules.svelte";
  import { teams } from "../stores/teams.js";
  import { seasons } from "../stores/seasons.js";

  const results = $seasons[0].results
    .reverse()
    .filter(result => result.ateam == "DUNKERQUE" || result.bteam == "DUNKERQUE")
    .slice(0, 5);
</script>