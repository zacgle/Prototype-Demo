<template>
  <div style="margin-left: 15px; margin-top:10px">
    <el-row :gutter="10">
      <el-col
        :span="21"
      ><el-input
        v-model="textarea_search"
        type="textarea0"
        :autosize="{ minRows: 1, maxRows: 4 }"
        placeholder="请输入搜索内容"
        @input="onSearchChange"
      />
      </el-col>
      <el-col
        :span="1"
      ><el-button
        type="primary"
        @click="searchEntity"
      >搜索</el-button></el-col>
      <el-col
        :span="1"
      ><el-button
        type="info"
        plain
        @click="wipeInput"
      >清除</el-button></el-col>
    </el-row>
    <transition name="fade">
      <div v-if="showSearchTable">
        <el-table
          :data="searchResult"
          height="250"
          stripe
          style="100%"
        ><el-table-column
          prop="order"
          label="序号"
          width="180"
        /><el-table-column
          prop="category"
          label="类型"
          width="360"
        /><el-table-column
          prop="content"
          label="内容"
          width="600"
        /><el-table-column
          prop="comment"
          label="备注"
          width="500"
        /></el-table>
      </div>
    </transition>
    <transition name="kgGraph_transition">
      <div id="knowledge_graph" :style="kgStyle" />
    </transition>
    <div ref="rightChartPanel" :class="{show:show}" class="rightPanel-container">
      <div class="rightChartPanel-background" />
      <div class="rightChartPanel">
        <div class="handle-charts-button" :style="{'bottom':buttonBtm+'px','background-color':theme}" @click="doom()"><i class="el-icon-s-marketing" /></div>
        <div style="padding: 3px;">    <el-table
          :data="tableData"
          border
          style="width: 100%; font-size: 20px;
          margin-top: 8px;"
        >
          <el-table-column
            prop="type"
            label="知识类型"
            width="321"
          />
          <el-table-column
            prop="quantity"
            label="数量"
            width="321"
          />
        </el-table><!--侧边栏-->
        </div>
      </div>

      <div id="overlay" />
    </div>
  </div></template>

<script>
import Vis from 'vis'
// create an array with edges
import { kgSearch, kgDetail, kgAdd, kgDelete, getKnowledgeStatic } from '@/api/prototype.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      textarea_search: '',
      searchResult: [
        // {
        //   order: 1,
        //   category: '设备',
        //   content: '内容1',
        //   comment: '备注1'
        // },
        // {
        //   order: 2,
        //   content: '内容2',
        //   comment: '备注2'
        // },
        // {
        //   order: 3,
        //   content: '内容3',
        //   comment: '备注3'
        // },
        // {
        //   order: 4,
        //   content: '内容2',
        //   comment: '备注2'
        // },
        // {
        //   order: 5,
        //   content: '内容2',
        //   comment: '备注2'
        // },
        // {
        //   order: 6,
        //   content: '内容2',
        //   comment: '备注2'
        // },
        // {
        //   order: 7,
        //   content: '内容2',
        //   comment: '备注2'
        // },
        // {
        //   order: 8,
        //   content: '内容2',
        //   comment: '备注2'
        // },
        // {
        //   order: 9,
        //   content: '内容2',
        //   comment: '备注2'
        // },
        // {
        //   order: 10,
        //   content: '内容2',
        //   comment: '备注2'
        // }
      ],
      vis_option: {
        nodes: {
          shape: 'dot',
          size: 16,
          font: {
            size: 12,
            color: 'black'
          },
          borderWidth: 2
        },
        edges: {
          width: 2
        },
        physics: {
          enabled: true,
          stabilization: false,
          barnesHut: {
            // gravitationalConstant: -2000,
            // springConstant: 0.9,
            springLength: 80
            // avoidOverlap: 1,
            // damping: 0
          }
        }
      },
      nodes: [
        // { id: 1, label: 'Node 1', color: '#40513B' },
        // { id: 2, label: 'Node 2', color: '#609966' },
        // { id: 3, label: 'Node 3', color: '#9DC08B' },
        // { id: 4, label: 'Node 4', color: '#C7D9A9' },
        // { id: 5, label: 'Node 5', color: '#E8EBCA' },
        // { id: 6, label: 'Node 6', color: '#FFFFFF' }
      ],
      edges: [
        // { from: 1, to: 3 },
        // { from: 1, to: 2 },
        // { from: 2, to: 4 },
        // { from: 2, to: 5 },
        // { from: 3, to: 3 },
        // { from: 4, to: 1 },
        // { from: 5, to: 2 },
        // { from: 6, to: 1 }
      ],
      container: null,
      showSearchTable: false,
      kgStyle: {
        height: '90vh'
      },
      buttonBtm: 0,
      show: false,
      tableData: [{
        type: '设备',
        quantity: 0
      }, {
        type: '故障',
        quantity: 0
      }, {
        type: '维修',
        quantity: 0
      }, {
        type: '保养',
        quantity: 0
      }, {
        type: '其他',
        quantity: 0
      }]
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    show(value) {
      if (value) {
        this.addEventClick()
      }
    }
  },
  mounted() {
    // this.init()
    this.retrieveKG()
  },
  methods: {
    init() {
      var visnode = new Vis.DataSet(this.nodes)
      var visedge = new Vis.DataSet(this.edges)
      var data = {
        nodes: visnode,
        edges: visedge
      }
      this.container = document.getElementById('knowledge_graph')
      var network = new Vis.Network(this.container, data, this.vis_option)

      network.on('doubleClick', (selected) => {
        if (selected.nodes.length > 0) {
          var nodeId = selected.nodes[0]
          console.log(nodeId)
          this.$prompt(
            '删除知识点请输入“删除知识点”，添加关联知识请直接输入知识内容',
            '知识操作',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
              // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
              // inputErrorMessage: '邮箱格式不正确'
            }
          )
            .then(({ value }) => {
              // this.$message({
              //   type: 'success',
              //   message: '你的邮箱是: ' + value
              // })
              if (value === '删除知识点') {
                this.$confirm('此操作将永久删除该知识点, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                  .then(() => {
                    // 删除知识点
                    var tmp = {
                      nodeId: nodeId
                    }
                    kgDelete(tmp).then((response) => {
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      })
                      this.retrieveKG()
                    })
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    })
                  })
              } else {
                // 添加关联知识
                var tmp = {
                  nodeId: nodeId,
                  value: value
                }
                kgAdd(tmp).then((response) => {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.retrieveKG()
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              })
            })
        }
      })
    },
    onSearchChange() {
      this.showSearchTable = false
      console.log(this.showSearchTable)
    },
    searchEntity() {
      // 搜索关键词在知识图谱中对应的相关信息
      if (this.textarea_search === '') {
        this.$message({
          message: '请输入搜索内容',
          type: 'warning',
          showClose: true
        })
        return
      } else {
        var tmp = {
          content: this.textarea_search
        }
        kgSearch(tmp).then((response) => {
          this.searchResult = response.data
          console.log(this.searchResult)
          this.showSearchTable = true
          this.kgStyle = { height: '60vh' }
        })
      }

      console.log(this.textarea_search)
      if (this.searchResult === []) {
        this.showSearchTable = false
        this.kgStyle = { height: '80vh' }
      } else {
        this.showSearchTable = true
        this.kgStyle = { height: '60vh' }
      }
    },
    /*
      ? abc
    */
    retrieveKG() {
      // 获取知识图谱绘图数据
      kgDetail()
        .then((response) => {
          this.nodes = response.data.nodes.map((item) => {
            return {
              id: item.id,
              label: item.label,
              color: item.color
            }
          })
          this.edges = response.data.edges.map((item1) => {
            return {
              from: item1.from,
              to: item1.to,
              color: { color: item1.color }
            }
          })
          this.init()
        })
        .catch((error) => {
          console.log(error)
        })
      console.log('KG updated!')
    },
    wipeInput() {
      // 清除输入框内容
      this.textarea_search = ''
      this.showSearchTable = false
    },
    handleChangeChartsView() {
      const rightChartPanel = document.getElementsByClassName('rightChartPanel')[ 0 ]
      console.log('rightChartPanel')
      // const handleChartsButton = document.getElementsByClassName('handle-charts-button')[0]
      if (rightChartPanel.style.transform === 'translate(100%)') {
        rightChartPanel.style.transform = 'translate(0%)'
        getKnowledgeStatic().then((response) => {
          this.tableData = response.data.map((item) => {
            return {
              type: item.type,
              quantity: item.number
            }
          })
        })
        // handleChartsButton.style.transform = 'translate(100%)'
      } else {
        rightChartPanel.style.transform = 'translate(100%)'

        // handleChartsButton.style.transform = 'translate(0%)'
      }
    },
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    doom() {
      if (!this.show) {
        getKnowledgeStatic().then((response) => {
          this.tableData = response.data.map((item) => {
            return {
              type: item.type,
              quantity: item.number
            }
          })
        })
      }
      this.show = !this.show
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightChartPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    }
  }
}
</script>
<style lang="css" scoped>
#knowledge_graph {
  width: 100%;
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  display: none;
}
#popup {
  z-index: 2001;
  display: none;
  background-color: white;
  padding: 50px 10px 10px 10px;
  border-radius: 4px;
  border:grey 2px solid;

}
.handle-charts-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
.rightChartPanel {
  width: 100%;
  max-width: 650px;
  height: 25vh;
  position: fixed;
  bottom: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 2001;
}
.rightChartPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  z-index: -1;
}
.show {
  transition: all .3s cubic-bezier(.7, .3, .1, 1);

  .rightChartPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightChartPanel {
    transform: translate(0);
    z-index: 40001;
  }
}

</style>
<style scoped>
/deep/ .el-table .el-table__row {
  height: 60px;
}

/deep/ .el-table .el-table__row td {
  height: 60px;
  line-height: 60px;
}
</style>
