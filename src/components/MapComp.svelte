<script>
  import {
    Chart,
    Card,
    A,
    Button,
    Dropdown,
    DropdownItem,
    Popover,
    Tooltip,
  } from "flowbite-svelte";
  import {
    InfoCircleSolid,
    ArrowDownToBracketOutline,
    ChevronDownOutline,
    ChevronRightOutline,
    PenSolid,
    DownloadSolid,
    ShareNodesSolid,
  } from "flowbite-svelte-icons";

  let { landpads } = $props();
  let newMap = landpads?.map(
    (pad) =>
      pad.attempted_landings > 0 &&
      Math.floor((pad.successful_landings / pad.attempted_landings) * 100)
  );

  let fullLevelname = landpads?.map((pad) => pad.full_name);

  const options = {
    series: newMap,
    colors: [
      "#1C64F2",
      "#16BDCA",
      "#FDBA8C",
      "#E74694",
      "#1C64F2",
      "#16BDNA",
      "#FDBA5C",
    ],
    chart: {
      height: 200,
      width: "100%",
      type: "donut",
    },
    stroke: {
      colors: ["transparent"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
            },
            total: {
              showAlways: true,
              show: true,
              label: "Landing Pads",
              fontFamily: "Inter, sans-serif",
              formatter: function (w) {
                // console.log("w", w);
                const sum = w.globals.seriesTotals.length;
                return `${sum}`;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              formatter: function (value) {
                return value;
              },
            },
          },
          size: "80%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels: fullLevelname,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: "bottom",
      fontFamily: "Inter, sans-serif",
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value;
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return value;
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
  };
</script>

<Card>
  <div class="flex justify-between items-start w-full">
    <div class="flex-col items-center"></div>
  </div>

  <Chart {options} class="py-6" />
</Card>
