<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { barchart } from "./chart";
import * as d3 from "d3";

@Component({
  components: {
    LogChart
  }
})
export default class LogChart extends Vue {
  @Prop() logs;

  get dataset() {
    const data = this.logs.map(set => {
      const state = JSON.parse(set.details);
      return [new Date(state.last_update), state.state ? 1 : 0];
    });
    return [
      {
        interval_s: 0,
        data: [...data]
      }
    ];
  }

  mounted() {
    var chart3 = barchart().width(500);
    d3
      .select("#chart")
      .datum(this.dataset)
      .call(chart3);
  }
}
</script>

<template>
  <div id="chart"/>
</template>

<style lang="scss">
/* style for visavail.js */
.rect_has_data {
  /* blocks that have data */
  fill: #5cb85c;
}

.rect_has_data:hover {
  fill: #449d44;
}

.rect_has_no_data {
  /* blocks without data */
  fill: #d9534d;
}

.rect_has_no_data:hover {
  fill: #c9302c;
}

.tooltip_has_data {
  /* color of symbol in tooltip if there is data */
  color: #449d44;
}

.tooltip_has_no_data {
  /* color of symbol in tooltip if there is no data */
  color: #c9302c;
}

div.tooltip {
  position: absolute;
  text-align: left;
  font-family: "Muli", "Helvetica", Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  font-size: 10px;
  padding-left: 0;
  width: auto;
  border: 0;
  border-left: thin solid #000000;
  pointer-events: none;
  line-height: 12px;
  padding-top: 0;
  display: block;
  z-index: 9000;
}

.x_tick_emph {
  font-weight: bold;
}

.ytitle {
  /* y axis labels */
  dominant-baseline: middle;
  font-family: "Muli", "Helvetica", Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
}

.ytitle.link {
  /* y axis label with link */
  cursor: pointer;
  fill: #07c;
}

.axis path,
.axis line {
  display: none;
}

.axis text {
  font-size: 12px;
  font-family: "Muli", "Helvetica", Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  fill: #777;
}

.vert_grid {
  fill: none;
  stroke: #dddddd;
  stroke-width: 1px;
}

.vert_grid_emph {
  fill: none;
  stroke: #dddddd;
  stroke-width: 2px;
}

.horz_grid {
  fill: none;
  stroke: #dddddd;
  stroke-width: 1px;
}

.heading {
  font-size: 16px;
  font-family: "Muli", "Helvetica", Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  font-weight: bold;
}

.subheading {
  font-size: 12px;
  font-family: "Muli", "Helvetica", Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  fill: #777;
}

.legend {
  dominant-baseline: middle;
  font-size: 12px;
  font-family: "Muli", "Helvetica", Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  fill: #777;
}
</style>