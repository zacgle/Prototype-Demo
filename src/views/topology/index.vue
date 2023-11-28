<template>
  <div style="margin-top: 12px;">
    <el-button type="primary" @click="sendPkg">发包</el-button>

    <div id="networkContainer" ref="networkContainer" />
    <el-button type="info" @click="getDrlPath">增加边</el-button>
  </div>
</template>

<script>
import { getTopology, sendPkg, getDrlPath, netOnOff } from '@/api/prototype'
import G6 from '@antv/g6'
import { mapState } from 'vuex'
const switch_normal = require('@/assets/network_icons/switch.svg')
const server_normal = require('@/assets/network_icons/server.svg')
const vr_normal = require('@/assets/network_icons/vr_goggles.svg')
const end_equip_normal = require('@/assets/network_icons/end_equip.svg')
export default {
  name: 'Topology',
  data() {
    return {
      topology_interval: null,
      path_interval: null,
      nodes: [],
      edges: [],
      networkInstance: null,
      isFetching: false,
      preNodes: [],
      imgTranslation: { 0: server_normal, 1: switch_normal, 2: end_equip_normal, 3: vr_normal } // 图标配对情况
    }
  },
  computed: {
    netStat() {
      return this.$store.state.settings.netStatus
    },
    ...mapState({
      sidebar: state => state.app.sidebar.opened
    })
  },
  watch: {
    netStat(newVal, oldVal) {
      if (newVal === true) {
        this.topology_interval = setInterval(() => {
          this.getTopology()
        }, 3000)
      } else if (newVal === false) {
        clearInterval(this.topology_interval)
        clearInterval(this.path_interval)
        this.nodes = []
        this.edges = []
        if (this.networkInstance) {
          this.networkInstance.clear()
        }
      }
    },
    sidebar(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.adjustGraphSize()
      }
    }
  },
  mounted() {
    netOnOff().then((res) => {
      console.log(res)
      if (res.data.status) {
        this.topology_interval = setInterval(() => {
          this.getTopology()
        }, 3000)
      }
    })
    const { getLabelPosition, transform } = G6.Util
    G6.registerEdge(
      'arrow-running',
      {
        afterDraw(cfg, group) {
          // get the first shape in the group, it is the edge's path here=
          const shape = group.get('children')[0]

          const arrow = group.addShape('marker', {
            attrs: {
              x: 16,
              y: 0,
              r: 8,
              lineWidth: 2,
              stroke: '#3370ff',
              fill: '#fff',
              symbol: (x, y, r) => {
                return [
                  ['M', x - 18, y - 8],
                  ['L', x - 12, y],
                  ['L', x - 18, y + 8]
                ]
              }
            }
          })

          // animation for the red circle
          arrow.animate(
            (ratio) => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              // get the position on the edge according to the ratio
              const tmpPoint = shape.getPoint(ratio)
              const pos = getLabelPosition(shape, ratio)
              let matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
              matrix = transform(matrix, [
                ['t', -tmpPoint.x, -tmpPoint.y],
                ['r', pos.angle],
                ['t', tmpPoint.x, tmpPoint.y]
              ])

              // returns the modified configurations here, x and y here
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
                matrix
              }
            },
            {
              // repeat: true, // Whether executes the animation repeatly
              duration: 2000 // the duration for executing once
            }
          )
        }
      },
      'cubic' // extend the built-in edge 'cubic'
    )
    this.constructGraph()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.networkInstance) {
      this.networkInstance.destroy() // 销毁图
    }
    clearInterval(this.topology_interval) // 销毁定时器
    clearInterval(this.path_interval)
    this.nodes = []
    this.edges = []
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    sendPkg() { // 发包
      sendPkg().then((res) => {
        this.$message({
          message: res.msg,
          type: res.msg === 'test1.pcap数据包正在发送' ? 'success' : 'error'
        })
        if (this.path_interval) {
          clearInterval(this.path_interval)
        }
        this.path_interval = setInterval(() => {
          this.getDrlPath()
        }, 3000)
      })
    },
    getDrlPath() { // 获取路径
      getDrlPath().then((res) => {
        if (res.msg === '发包未开启，无路径信息') {
          this.$message({
            message: res.msg,
            type: 'error'
          })
          return
        }

        if (this.isFetching) {
          return
        }
        this.isFetching = true

        const path = res.data.output[ 'node-list' ]
        this.preNodes.forEach((edge) => {
          this.networkInstance.updateItem(edge, {
            type: 'quadratic',
            style: {
              stroke: '#333',
              lineWidth: 2
            }
          })
        })
        this.preNodes = []
        path.forEach((element) => {
          const source = element.srcNodeConnector.slice(0, element.srcNodeConnector.indexOf(':') + 2)
          const target = element.dstnodeConnector.slice(0, element.dstnodeConnector.indexOf(':') + 2)
          const edge_id = source + target
          this.preNodes.push(edge_id)
          if (this.networkInstance.findById(edge_id)) {
            var edge = this.networkInstance.findById(edge_id)
            this.networkInstance.updateItem(edge, {
              type: 'arrow-running',
              style: {
                stroke: 'blue',
                lineWidth: 5
              }
            })
          }
        })
        this.isFetching = false
      })
    },
    constructGraph() { // 构建图
      const container = this.$refs.networkContainer

      this.networkInstance = new G6.Graph({
        container: container,
        layout: {
          animate: true,
          type: 'force2',
          preventOverlap: true,
          nodeSize: 30,
          nodeSpacing: 10,
          linkDistance: 300,
          linkStrength: 0.5
        },
        defaultNode: {
          type: 'image',
          size: 30,
          style: {
            lineWidth: 2,
            fill: '#DEE9FF',
            stroke: '#5B8FF9'
          },
          labelCfg: {
            style: {
              fill: '#000',
              fontSize: 12

            },
            position: 'bottom'
          }
        },
        defaultEdge: { // 边的默认配置
          type: 'quadratic',
          style: {
            lineWidth: 2,
            stroke: '#333',
            opacity: 0.6,
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              opacity: 1.0
            },
            labelCfg: {
              autoRotate: true,
              style: {
                fill: 'red',
                fontSize: 16
              },
              position: 'bottom',
              offset: 5
            }
          },

          curveOffset: 20
        },
        modes: { // 允许的交互模式
          default: ['drag-canvas', 'drag-node', 'zoom-canvas']
        }
      })

      this.networkInstance.on('node:drag', (event) => {
        const model = event.item.get('model')
        model.fx = event.x
        model.fy = event.y
      })
    },
    async getTopology() { // 获取拓扑
      if (this.isFetching) {
        return
      }
      this.isFetching = true
      await getTopology().then((res) => {
        console.log(res.data[ 'network-topology' ][ 'topology' ][ 1 ])
        const django_nodes = res.data[ 'network-topology' ][ 'topology' ][ 1 ][ 'node' ]
        const django_edges = res.data[ 'network-topology' ][ 'topology' ][ 1 ][ 'link' ]

        if (this.nodes.length === 0) {
          django_nodes.forEach((element) => {
            if (!this.nodes.some(e => e.id === element[ 'node-id' ])) {
              this.nodes.push({
                id: element[ 'node-id' ],
                label: element[ 'node-id' ],
                x: Math.random() * 800,
                y: Math.random() * 600,
                img: this.imgTranslation[ element[ 'image' ] ]

              })
            }
          })
          django_edges.forEach((element) => {
            if (!this.edges.some(e => e.id === element[ 'source' ][ 'source-node' ] + element[ 'destination' ][ 'dest-node' ])) {
              this.edges.push({
                target: element[ 'destination' ][ 'dest-node' ],
                source: element[ 'source' ][ 'source-node' ],
                id: element[ 'source' ][ 'source-node' ] + element[ 'destination' ][ 'dest-node' ]
              })
            }
          })

          this.networkInstance.data({
            nodes: this.nodes,
            edges: this.edges
          })
          this.networkInstance.render()
        } else {
          django_nodes.forEach((element) => {
            if (!this.nodes.some(e => e.id === element[ 'node-id' ])) {
              this.networkInstance.addItem('node', {
                id: element[ 'node-id' ],
                label: element[ 'node-id' ],
                x: Math.random() * 800,
                y: Math.random() * 600,
                img: this.imgTranslation[ element[ 'image' ] ]
              })
              this.nodes.push({
                id: element[ 'node-id' ],
                label: element[ 'node-id' ]
              })
              this.networkInstance.refresh()
            }
          })

          django_edges.forEach((element) => {
            if (!this.edges.some(e => e.id === element[ 'source' ][ 'source-node' ] + element[ 'destination' ][ 'dest-node' ])) {
              console.log('没有这个边： ' + element[ 'source' ][ 'source-node' ] + element[ 'destination' ][ 'dest-node' ])
              this.networkInstance.addItem('edge', {
                target: element[ 'destination' ][ 'dest-node' ],
                source: element[ 'source' ][ 'source-node' ],
                id: element[ 'source' ][ 'source-node' ] + element[ 'destination' ][ 'dest-node' ]
              })
              this.edges.push({
                target: element[ 'destination' ][ 'dest-node' ],
                source: element[ 'source' ][ 'source-node' ],
                id: element[ 'source' ][ 'source-node' ] + element[ 'destination' ][ 'dest-node' ]
              })
              this.networkInstance.refresh()
            }
          })
        }
      })
      this.isFetching = false
    },
    handleResize() {
      const newSize = this.getGraphSize()
      if (this.networkInstance) {
        this.networkInstance.changeSize(newSize.width, newSize.height)
      }
    },
    getGraphSize() {
      const container = document.getElementById('networkContainer')
      return {
        width: container.offsetWidth * 0.99,
        height: container.offsetHeight * 0.99
      }
    },
    adjustGraphSize() {
      this.$nextTick(() => {
        setTimeout(() => {
          const newSize = this.getGraphSize()
          this.networkInstance.changeSize(newSize.width, newSize.height)
        }, 300) // 根据侧边栏动画时长可能需要调整这个延迟
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.canvas {
  width: 100%;
  height: 100%;
}

#networkContainer {
  width: 99%;
  height: 80vh;
  border: 3px solid black;
  margin: 10px 10px 10px;
}
.el-button{
  margin-left:5px;
}
</style>
