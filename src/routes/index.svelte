<script>
  import Results from "../components/Results.svelte";
  import Schedules from "../components/Schedules.svelte";
  import { teams } from "../stores/teams.js";
  import { seasons } from "../stores/seasons.js";

  const current_results = [...$seasons[3].results];
  const results = current_results
    .reverse()
    .filter(
      result => result.ateam == "Dunkerque" || result.bteam == "Dunkerque"
    )
    .slice(0, 5)
    .filter(result => result.ascore != "" && result.bscore != "");
</script>

<style>
  section {
    padding-bottom: 30px;
    width: 100%;
  }

  .info {
    justify-content: center;
    width: 100%;
  }

  p {
    text-align: center;
  }

  a {
    text-align: center;
  }

  .teams {
    width: 400px;
  }
  .results {
    width: 400px;
  }

  a {
    justify-items: center;
    align-self: center;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    padding: 10px;
    color: hsl(220, 37%, 40%);
  }

  .inscription {
    border: 1px solid hsl(220, 37%, 40%);
    width: 300px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    padding-top: 20px;
    margin-bottom: 16px;
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

<svelte:head>
  <title>Roll'in Club Dunkerque</title>
  <meta
    name="Description"
    content="Accueil du site officiel du roller hockey club de Dunkerque" />
</svelte:head>

<section>
  <p class="large blue title">Roll'in club dunkerque</p>
</section>

<section class="inscription">
  <p class="dark-gray title">La saison 2020/2021 va bientôt commencer!</p>
  <p>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://docs.google.com/forms/d/e/1FAIpQLSc7smkcSlOJ-dkldipqw1jmTAxlpD0QE-IZopoTtCqTm-n-Aw/viewform">
      Remplir mon formulaire d'inscription
    </a>
  </p>
  <p>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://docs.google.com/forms/d/e/1FAIpQLScH1IQ3L58VDbKRzSdysr-sedsiOEEUcnqdNz8z3zisxPJ5UQ/viewform">
      Remplir mon questionnaire de santé
    </a>
  </p>
</section>

<section>
  <p class="light-blue title">Adresse</p>
  <p class="dark-gray">Salle de sport du lycée de l'Europe</p>
  <p class="dark-gray">809 Rue du Banc vert</p>
  <p class="dark-gray">59640 Dunkerque</p>
  <p>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.google.com/maps/place/Gymnase+du+Lyc%C3%A9e+de+l'Europe/@51.0204252,2.3519417,17z/data=!4m5!3m4!1s0x47dc8b64b6f18c5d:0x23103bd5b7fc888!8m2!3d51.0195402!4d2.3544176">
      Ouvrir dans google maps
    </a>
  </p>
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
    <Results {results} />
  </section>
</div>
