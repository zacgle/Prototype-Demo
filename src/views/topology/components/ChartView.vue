<template>
  <div>
    <div class="chart-container">
      <Chart height="100%" width="100%" />
    </div>
  </div>
</template>
<script>

import Chart from '@/components/Charts/LineMarker'
export default {
  name: 'ChartView',
  components: { Chart }
}

</script>
