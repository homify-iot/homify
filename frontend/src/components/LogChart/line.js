import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: [ 'datasets', 'options' ],
  mounted () {
    const ctx = document.getElementById('line-chart');
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
    gradient.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 231, 255, 0)');
    const color = {
      borderColor: '#05CBE1',
      pointBackgroundColor: 'white',
      backgroundColor: gradient
    }
    this.datasets.datasets[ 0 ] = Object.assign({}, this.datasets.datasets[ 0 ], color);
    this.renderChart(this.datasets, this.options)
  }
}
