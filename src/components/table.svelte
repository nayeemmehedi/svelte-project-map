<script>
  import { onMount } from "svelte";
  import { Map, View } from "ol";
  import { Tile as TileLayer } from "ol/layer";
  import { OSM } from "ol/source";
  import { fromLonLat } from "ol/proj";
  import VectorLayer from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import Feature from "ol/Feature";
  import { Point } from "ol/geom";
  import { Style, Circle, Fill, Stroke } from "ol/style";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import {
    AdjustmentsHorizontalSolid,
    GridSolid,
    CodePullRequestSolid,
    LinkOutline
  } from "flowbite-svelte-icons";
  import { FireOutline } from "flowbite-svelte-icons";
  import MapComp from "./MapComp.svelte";
  import { Button, Modal } from 'flowbite-svelte';
  let defaultModal = $state(false);
  let defaultModal1 = $state(false);


  let { landpads } = $props();

  let landingPads = $state([]);
  let filteredPads = $state([]);
  let selectedStatus = $state("all");
  let map, vectorLayer;
  let isGridView = $state(false); // Toggle between List View and Grid View

  console.log("landpads",landpads)

  // Fetch landing pad data from SpaceX API
  async function fetchLandingPads() {
    const response = await fetch("https://api.spacexdata.com/v3/landpads");
    const data = await response.json();
    landingPads = data;
    filteredPads = data; // Initialize filteredPads with all data
    updateMap();
  }

  // Filter landing pads based on status
  function filterLandingPads(status) {
    selectedStatus = status;
    filteredPads =
      status === "all"
        ? landingPads
        : landingPads.filter((pad) => pad.status === status);
    updateMap();
  }

  // Update the map with filtered locations
  function updateMap() {
    if (vectorLayer) map.removeLayer(vectorLayer);

    const features = filteredPads.map((pad) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([pad.location.longitude, pad.location.latitude])
        ),
        name: pad.full_name,
        status: pad.status,
      });
      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({
              color:
                pad.status === "active"
                  ? "green"
                  : pad.status === "retired"
                    ? "red"
                    : "orange",
            }),
            stroke: new Stroke({
              color: "#fff",
              width: 2,
            }),
          }),
        })
      );
      return feature;
    });

    const vectorSource = new VectorSource({
      features,
    });

    vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);
  }

  onMount(() => {
    map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-80.544444, 28.485833]), // Default center (Cape Canaveral)
        zoom: 5,
      }),
    });

    fetchLandingPads();
  });



  function getStatusClasses(status) {
    if (status === "active") return " rounded bg-green-300 text-green-800";
    if (status === "retired") return "rounded bg-gray-300 text-gray-800";
    if (status === "under construction") return " rounded bg-yellow-300 text-yellow-800";
    return "";
  }
</script>

<main class="w-[95%] mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-4">
      <!-- Left Section -->
      <div class="lg:col-span-4">
        <!-- Controls -->
        <div class="flex justify-between items-center mb-4 w-full">
          <!-- View Toggle -->
          <div class="flex">
            <button
              class="py-2 px-4 rounded hover:bg-gray-100 border {isGridView ? 'bg-white border-gray-200' : 'bg-gray-100'}"
              onclick={() => (isGridView = false)}
            >
              <AdjustmentsHorizontalSolid />
            </button>
            <button
              class="py-2 px-4 rounded hover:bg-gray-100 border {isGridView ? 'bg-gray-100' : 'bg-white border-gray-200'}"
              onclick={() => (isGridView = true)}
            >
              <GridSolid />
            </button>
          </div>
  
          <!-- Filter Dropdown -->
          <div>
            <select
              id="status-filter"
              bind:value={selectedStatus}
              onchange={() => filterLandingPads(selectedStatus)}
              class="border border-gray-300 py-2 px-3 rounded"
            >
              <option value="all">Filter by Status:</option>
              <option value="active">Active</option>
              <option value="retired">Retired</option>
              <option value="under construction">Under Construction</option>
            </select>
          </div>
        </div>
  
        <!-- List and Grid Views -->
        <div>
          {#if !isGridView}
            <!-- List View -->
            <div class="overflow-x-auto">
              <Table hoverable={true}>
                <TableHead>
                  <TableHeadCell>Full Name</TableHeadCell>
                  <TableHeadCell>Location Name</TableHeadCell>
                  <TableHeadCell>Region</TableHeadCell>
                  <TableHeadCell>Details</TableHeadCell>
                  <TableHeadCell>Success Rate</TableHeadCell>
                  <TableHeadCell>WikiPedia Link</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                </TableHead>
                <TableBody tableBodyClass="divide-y">
                  {#each filteredPads as pad}
                    <TableBodyRow>
                      <TableBodyCell>{pad.full_name}</TableBodyCell>
                      <TableBodyCell>{pad.location.name}</TableBodyCell>
                      <TableBodyCell>{pad.location.region}</TableBodyCell>
                      <TableBodyCell>
                        <button onclick={() => (defaultModal = true)} class="bg-slate-300 p-2 rounded-lg font-thin text-xs">
                          View Details
                        </button>
                        <Modal title="View Details" bind:open={defaultModal} autoclose>
                          <p class="h-24 w-full">{pad.details}</p>
                          <svelte:fragment slot="footer">
                            <Button color="alternative">Close</Button>
                          </svelte:fragment>
                        </Modal>
                      </TableBodyCell>
                      <TableBodyCell>{pad.success_rate_pct}</TableBodyCell>
                      <TableBodyCell>
                        <a href={pad.wikipedia} target="_blank" class="text-blue-600">
                          <LinkOutline />
                        </a>
                      </TableBodyCell>
                      <TableBodyCell class={"status " + getStatusClasses(pad.status)}>{pad.status}</TableBodyCell>
                    </TableBodyRow>
                  {/each}
                </TableBody>
              </Table>
            </div>
          {:else}
            <!-- Grid View -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each filteredPads as pad}
                <div class="border border-gray-300 p-4 rounded shadow">
                  <h3 class="text-lg font-bold mb-2">Full Name: {pad.full_name}</h3>
                  <p><strong>Region:</strong> {pad.location.region}</p>
                  <p><strong>Location Name:</strong> {pad.location.name}</p>
                  <div><strong>Status:</strong> <span class={getStatusClasses(pad.status)}>{pad.status}</span></div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
  
      <!-- Right Section -->
      <div class="lg:col-span-2 space-y-4">
        <div>
          <h4 class="font-bold">Map View</h4>
          <div id="map" class="map-container"></div>
        </div>
        <div>
          <h4 class="font-bold">Success Rate Chart</h4>
          <MapComp landpads={landpads} />
        </div>
      </div>
    </div>
  </main>
  
  <style>
    .map-container {
      height: 400px;
      width: 100%;
      border: 1px solid #ddd;
      margin-bottom: 1rem;
    }
  
    @media (max-width: 768px) {
      .map-container {
        height: 300px;
      }
    }
  </style>
  