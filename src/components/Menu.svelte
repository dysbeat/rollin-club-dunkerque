<script>
  import { pages } from "../stores/pages.js";

  let visible = false;
  export let segment;
</script>

<style>
  .container {
    width: 100%;
    margin-left: 5px;
  }

  .bar {
    display: none;
  }

  .menu {
    justify-content: center;
  }

  @media screen and (max-width: 768px) {
    .bar {
      display: flex;

      width: 35px;
      height: 5px;
      margin-top: 6px;
      transition: 0.4s;
      background-color: hsl(220, 37%, 35%);
    }

    .third {
      margin-bottom: 6px;
    }

    .menu {
      -webkit-flex-direction: column;
      -moz-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;

      display: none;
    }

    .first.change {
      -webkit-transform: translateY(10px);
      transform: translateY(10px);
      visibility: hidden;
    }
    .third.change {
      -webkit-transform: translateY(-10px);
      transform: translateY(-10px);
      visibility: hidden;
    }

    .menu.change {
      display: flex;
      height: auto;
    }
  }
</style>

<nav role="navigation">
  <div class="container" on:click={() => (visible = !visible)}>
    <div class=" bar first {visible ? 'change' : ''}" />
    <div class="bar second {visible ? 'change' : ''}" />
    <div class="bar third {visible ? 'change' : ''}" />

    <ul class="rows menu {visible ? 'change' : ''}">
      {#each $pages as page}
        <li>
          <a href={page.link}>
            <p class="choice {segment == page.link ? 'selected' : ''}">
               {page.name}
            </p>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
