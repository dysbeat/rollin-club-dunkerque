<div class="header-line"></div>
<div class="header">
	<div class="back"></div>
	<div class="menu">
		<Menu />
	</div>
	<img class="logo" src="logo.png" alt="logo" />
</div>

<script>
  import Menu from "./Menu.svelte";
</script>

<style>
  .header-line {
    width: 100%;
    height: 4px;
    background-color: hsl(220, 37%, 35%);
  }

  .logo {
    grid-area: logo;
    align-self: top;
    justify-self: center;
    width: 120px;
    height: 120px;
    z-index: 10;
  }

  .menu {
    grid-area: menu;
    z-index: 2;
  }

  .back {
    grid-column: 1/4;
    grid-row: 1;
    z-index: 2;
    background-color: hsl(220, 37%, 97.3%);
    border: 1px solid hsl(220, 37%, 90.6%);
  }

  .header {
    width: 100%;
    height: auto;

    transition: max-height 0.5s ease;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: min-content;
    grid-template-areas:
      "menu logo ."
      ". logo .";
  }
</style>