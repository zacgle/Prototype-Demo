<template>
  <div style="padding:3px">
    <h3 style="font-family: YaHei; font-size: 16px;">请选择即将模拟的问题策略类型</h3>
    <el-switch
      v-model="option"
      style="display: block"
      active-color="grey"
      inactive-color="white"
      active-text="循环故障"
      inactive-text="黑洞故障"
    />

    <div style="margin-top: 20px;margin-right: 5px;">    <el-table
      v-if="option !== '' && option !== null"
      :data="tableData"
      style="width: 98%"
    >
      <el-table-column
        prop="attribute"
        label="属性"
        width="100"
      />
      <el-table-column
        prop="content"
        label="内容"
        width="220"
      />
    </el-table></div>
    <div style="margin-top: 20px;"><el-button type="primary" @click="storeOption">注入策略</el-button></div>
  </div>

</template>
<script>
export default {
  name: 'Choice',
  data() {
    return {
      problemOptions: [{ value: 'blackhole', label: '黑洞攻击' }, { value: 'loop', label: '环路故障' }],
      option: true,
      problems: { loop: [{ attribute: '形式', content: '交换机：1->交换机：3->交换机：4->交换机：1' }, { attribute: '端口', content: 'inf2' }, { attribute: '影响的协议', content: 'FW' }, { attribute: '影响的网段', content: '11.0.0.0/8' }, { attribute: '影响的设备', content: '交换机：4' }], blackhole: [{ attribute: '形式', content: '交换机：3' }, { attribute: '端口', content: 'default' }, { attribute: '影响的协议', content: 'FW' }, { attribute: '影响的网段', content: '11.0.0.0/8' }, { attribute: '影响的设备', content: '交换机：3' }] },
      tableData: []
    }
  },
  watch: {
    option() {
      if (this.option === '' || this.option === null) return
      this.tableData = this.option ? this.problems.loop : this.problems.blackhole
    }
  },
  mounted() {
    this.tableData = this.option ? this.problems.loop : this.problems.blackhole
  },
  methods: {
    storeOption() {
      if (this.option === '' || this.option === null) return
      const option = this.option ? 'loop' : 'blackhole'
      sessionStorage.setItem('option', option)
      this.$emit('option', option)
    }
  }
}

</script>
