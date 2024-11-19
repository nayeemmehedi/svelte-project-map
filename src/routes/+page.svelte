<script>
  import spacex from "$lib/img/spacex.svg";
  import MapComp from "../components/MapComp.svelte";
  import Table from "../components/table.svelte";
  let {data} = $props();


</script>

<main>
  <section>
    <div class="flex justify-center">
      <img src={spacex} alt="aaa" />
    </div>
    <hr class="border-[1.3px] border-gray-200 mt-4 mb-8" />
  </section>

  <section>
    <Table landpads={data.landpads}></Table>
  </section>

  <section>
    <!-- <MapComp landpads={data.landpads}></MapComp> -->
  </section>
</main>
