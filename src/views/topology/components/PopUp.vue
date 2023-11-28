<template>
  <div id="mainDiv" :style="customizedStyle">
    <el-form ref="ruleForm" :model="inputFields" label-position="top" label-width="100px" :rules="rules">

      <el-form-item v-for="item in items" :key="item.key" :label="item.label" :prop="item.modelName">
        <el-input v-if="item.category === 'input' &&item.modelName !== 'bandwidth'" v-model="inputFields[item.modelName]" />
        <el-select v-else-if="item.category === 'select'" v-model="inputFields[item.modelName]" placeholder="请选择" clearable>
          <div v-if="item.modelName === 'node1' || item.modelName === 'node2'"><el-option
            v-for="node in nodes"
            :key="node.id"
            :label="node.id"
            :value="node.id"
          /></div>
          <div v-else><el-option
            v-for="kind in item.options"
            :key="kind"
            :label="kind"
            :value="kind"
          /></div>
        </el-select>
        <el-input-number v-else-if="item.category === 'input' && item.modelName === 'bandwidth'" v-model="inputFields[item.modelName]" />
      </el-form-item>
      <el-form-item style="padding-top:15px;">
        <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
        <el-button @click="resetForm('ruleForm')">Reset</el-button>
        <el-button @click="close">Close</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addItem } from '@/api/prototype'
export default {
  name: 'PopUp',
  props:

  {
    customizedStyle: { // 实现父组件拖动
      type: Object,
      default: () => ({})
    },
    nodes: {
      type: Array,
      default: () => [],
      required: true
    },
    edges: {
      type: Array,
      default: () => [],
      required: true
    },
    items: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    var validateNode1 = (rule, value, callback) => {
      console.log(value)
      if (value === this.inputFields.node2) {
        callback(new Error('不能选择同一节点'))
      } else {
        callback()
      }
    }
    var validateNode2 = (rule, value, callback) => {
      console.log(value)
      if (value === this.inputFields.node1) {
        callback(new Error('不能选择同一节点'))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      const { nodes, edges } = this
      console.log(nodes, edges)
      if (nodes.findIndex(node => node.id === value) !== -1 || edges.findIndex(edge => edge.id === value) !== -1) {
        callback(new Error('该名称已被使用'))
      } else {
        callback()
      }
    }
    return {
      nodeInfo: {},
      inputFields: {},
      rules: {
        name: [
          { required: true, message: '请名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        node1: [
          { required: true, message: '请选择一个节点', trigger: 'blur' },
          { validator: validateNode1, trigger: 'blur' }
        ],
        node2: [
          { required: true, message: '请选择一个节点', trigger: 'blur' },
          { validator: validateNode2, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择一个类型', trigger: 'blur' }
        ],
        bandwidth: [{
          type: 'number',
          message: '请输入数字', required: true, trigger: 'blur'
        }]
      }
    }
  },
  watch: {

  },
  mounted() {
    this.items.forEach(item => {
      this.$set(this.inputFields, item.modelName, '')
    })
  },
  methods: {
    close() {
      this.$emit('close')
    },
    resetForm(formName) {
      this.$refs[ formName ].resetFields()
    },
    submitForm(formName) {
      this.$refs[ formName ].validate((valid) => {
        if (valid) {
          var params
          if (this.inputFields.type) {
            switch (this.inputFields.type) {
              case '交换机':
                params = { operation: 'add_switch', name1: this.inputFields.name }

                break
              case '手机':
                params = { operation: 'add_host', name1: this.inputFields.name }

                break
              case 'VR头盔':
                params = { operation: 'add_host', name1: this.inputFields.name }

                break
              case '服务器':
                params = { operation: 'add_service', name1: this.inputFields.name }

                break
              default:
                this.error('未知类型')
                break
            }
          } else {
            params = { operation: 'add_link', name1: this.inputFields.node1, name2: this.inputFields.node2 }
          }
        } else {
          console.log('error submit!!')
          return false
        }
        addItem(params).then(res => {
          this.$message({
            message: '添加成功' + ' ' + res.msg,
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
        })
        this.close()
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.el-form-item {
  width: 20vw;
}
.el-select {
  width: 100%;
}
.el-input-number {
  width: 100%;
}
#mainDiv{
  background-color: white;
  border-radius: 4px;
  border: #ccc 2px solid;
  transform: translate(-50%, -50%);
  padding:30px 10px 10px 10px;
}
</style>
