<div class="placement">
	<div class="header-placement">
		<Header />
	</div>
	<div class="content-placement">
		{#if $data.selectedPage == 'teams'}
		<Teams />
		{/if}
		{#if $data.selectedPage == 'competition'}
		<Competition />
		{/if}
		{#if $data.selectedPage == 'home'}
		<Home />
		{/if}
		{#if $data.selectedPage == 'contact'}
		<Contact />
		{/if}
	</div>
</div>

<script>
		import Header from "./components/Header.svelte";
		import Home from "./components/Home.svelte";
		import Teams from "./components/Teams.svelte";
		import Competition from "./components/Competition.svelte";
		import Contact from "./components/Contact.svelte";
		import { data } from "./store.js";

		let selectedPage = $data.selectedPage;
</script>
<style>
	* {
	  all: initial;
	  all: unset;
	}

	.placement {
	  width: 100%;
	  height: 100%;
	  display: grid;
	  grid-template-columns: 1fr 4fr 1fr;
	  grid-template-rows: auto;
	  grid-template-areas:
	    "header header header"
	    ". content ."
	    "footer footer footer";
	}

	@media screen and (max-width: 768px) {
	  .placement {
	    width: 100%;
	    height: 100%;
	    display: grid;
	    grid-template-columns: 1fr 2fr 1fr;
	    grid-template-rows: auto;
	    grid-template-areas:
	      "header header header"
	      "content content content"
	      "footer footer footer";
	  }
	}

	.header-placement {
	  width: 100%;
	  height: 100%;
	  grid-area: header;
	}

	.content-placement {
	  width: 100%;
	  height: 100%;
	  grid-area: content;
	}
</style>