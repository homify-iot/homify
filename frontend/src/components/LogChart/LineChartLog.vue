<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import LineChart from "./line";
import moment from "moment";

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
    const startDay = moment().startOf("day");
    const labels = [];
    const data = [];
    this.log.forEach(set => {
      const state = JSON.parse(set.details);
      if (moment(state.last_update).isAfter(startDay)) {
        labels.push(moment(state.last_update));
        data.push(state.state.value);
      }
    });
    labels.unshift(startDay);
    data.unshift(data[0]);

    labels.push(moment());
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