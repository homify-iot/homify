<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import LineChart from "./line";
import startOfToday from "date-fns/start_of_today";
import isAfter from "date-fns/is_after";

@Component({
  components: {
    LineChart
  }
})
export default class LineChartLog extends Vue {
  @Prop({ default: () => ({}) })
  log;

  options = {
    maintainAspectRatio: false,
    legend: { display: false },
    scales: {
      xAxes: [
        {
          type: "time",
          unit: "hour",
          time: {
            displayFormats: {
              hour: "HH:mm"
            }
          }
        }
      ]
    }
  };

  get dataset() {
    const startDay = startOfToday();
    const labels = [];
    const data = [];
    this.log.forEach(set => {
      const state = JSON.parse(set.details);
      if (isAfter(new Date(state.last_update), startDay)) {
        labels.push(new Date(state.last_update));
        data.push(state.state.value);
      }
    });
    labels.unshift(startDay);
    data.unshift(data[0]);

    labels.push(new Date());
    data.push(data.slice(-1)[0]);
    return {
      labels,
      datasets: [
        {
          data
        }
      ]
    };
  }
}
</script>

<template>
  <line-chart :datasets="dataset" :options="options" />
</template>