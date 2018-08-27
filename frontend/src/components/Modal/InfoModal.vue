<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import DeviceSwitch from "@/components/DeviceSwitch/DeviceSwitch.vue";
import Modal from "@/components/Modal/Modal.vue";
import LogChart from "@/components/LogChart/LogChart.vue";
import moment from "moment";
@Component({
  components: {
    Modal,
    DeviceSwitch,
    LogChart
  }
})
export default class InfoModal extends Vue {
  @Prop() statePool;

  @Prop() onlinePool;

  entity = {};

  datacollection = {};

  options = {
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              millisecond: "MMM DD",
              second: "MMM DD",
              minute: "MMM DD",
              hour: "MMM DD",
              day: "MMM DD",
              week: "MMM DD",
              month: "MMM DD",
              quarter: "MMM DD",
              year: "MMM DD"
            },
            min: moment().weekday(-7),
            max: moment().weekday(10)
          },
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  };

  open(entity) {
    this.entity = entity;
    (this.$refs.modal as any).show();
  }

  created() {
    this.fillData();
  }

  fillData() {
    this.datacollection = {
      labels: ["test"],
      datasets: [
        {
          label: "Low",
          data: [moment().weekday(-7)],
          backgroundColor: "#D6E9C6" // green
        },
        {
          label: "Moderate",
          data: [moment()],
          backgroundColor: "#1EFFFF" // yellow
        },
        {
          label: "High",
          data: [moment().weekday(10)],
          backgroundColor: "#EBCCD1" // red
        }
      ]
    };
  }
}
</script>

<template>
  <modal ref="modal">
    <div slot="header">{{ entity.name }}</div>
    <svgicon slot="right-icon" icon='settings'/>
    <device-switch 
      :entity="entity"
      :state-info="statePool[entity.entityId]"
      :online="onlinePool[entity.entityId]"/>
    <log-chart :chart-data="datacollection" :options="options"/>
  </modal>
</template>

<style lang="scss">
</style>