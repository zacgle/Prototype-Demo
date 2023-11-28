<template>
  <div style="margin-top: 12px;">
    <el-button type="primary" class="buttons" :disabled="isButtonsDisabled" @click="sendPkg">发包</el-button><el-dropdown @command="handleCommand">
      <el-button type="primary" class="buttons" :disabled="isButtonsDisabled">
        新增<i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="node">模拟节点</el-dropdown-item>
        <el-dropdown-item command="edge">模拟链路</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div id="networkContainer" ref="networkContainer" />
    <el-button type="info" @click="testClearCanvas">增加边</el-button>
    <div class="rightChartPanel">
      <div class="handle-charts-button" :style="{'bottom':buttonBtm+'px','background-color':theme}"><i class="el-icon-s-marketing" @click="handleChangeChartsView" /></div>
      <div><ChartView style="padding: 5px;" /></div>
    </div>
    <div style="position:fixed; left:43vw; top:28vh; z-index: 2001;" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"><PopUp id="popup" :items="testArr" :nodes="nodes" :edges="edges" :style="childStyle" @close="handlePopUpClose" /></div>

    <div id="nodeContextMenu" style="display: none; position: absolute; z-index: 80;">
      <!-- 菜单项 -->
      <div v-for="item in menuListItems" :key="item.key" class="menulist" @click="handleIconClick(item.key,item.id)">{{ item.value }}</div>
      <!-- 更多菜单项 -->
    </div>

    <div id="overlay" />
  </div>
</template>

<script>
import { getTopology, sendPkg, getDrlPath, netOnOff, getGlobalDelay, fault, deleteItem } from '@/api/prototype'
import G6 from '@antv/g6'
import { mapState } from 'vuex'
import PopUp from './components/PopUp.vue'
import ChartView from './components/ChartView.vue'
const switch_normal = require('@/assets/network_icons/switch.svg')
const server_normal = require('@/assets/network_icons/server.svg')
const vr_normal = require('@/assets/network_icons/vr_goggles.svg')
const end_equip_normal = require('@/assets/network_icons/end_equip.svg')
export default {
  name: 'Topology',
  components: { PopUp, ChartView },
  data() {
    return {
      isButtonsDisabled: true,
      topology_interval: null,
      path_interval: null,
      nodes: [],
      edges: [],
      networkInstance: null,
      isFetching: false,
      prevNodes: [],
      isMenuShow: false,
      prevCoordinates: null,
      menuListItems: [], // 菜单列表
      imgTranslation: { 0: server_normal, 1: switch_normal, 2: end_equip_normal, 3: vr_normal }, // 图标配对情况4ipad 5苹果
      testArr: [],
      addOptions: [{ type: 'node', options: [{ key: 'name', label: '名称', category: 'input', modelName: 'name' }, { key: 'type', label: '类型', category: 'select', modelName: 'type', options: ['交换机', '服务器', '手机', 'VR头盔'] }] }, { type: 'edge', options: [{ key: 'name', label: '名称', category: 'input', modelName: 'name' }, { key: 'node1', label: '源节点', category: 'select', modelName: 'node1' }, { key: 'node2', label: '目的节点', category: 'select', modelName: 'node2' }, { key: 'bandwidth', label: '最大带宽', category: 'input', modelName: 'bandwidth' }] }],
      isDragging: false,
      childStyle: {
        position: 'absolute',
        left: '0px',
        top: '0px'
      },
      dragStartX: 0,
      dragStartY: 0,
      buttonBtm: 0
    }
  },
  computed: {
    netStat() {
      return this.$store.state.settings.netStatus
    },
    theme() {
      return this.$store.state.settings.theme
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
        this.isButtonsDisabled = false
      } else {
        clearInterval(this.topology_interval)
        clearInterval(this.path_interval)
        this.topology_interval = null
        this.path_interval = null
        this.nodes = []
        this.edges = []
        if (this.networkInstance) {
          this.networkInstance.clear()
        }
        this.isButtonsDisabled = true
      }
    },
    sidebar(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.adjustGraphSize()
      }
    }
  },
  mounted() {
    this.netOnOff()
    this.constructGraph()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.networkInstance) {
      this.networkInstance.destroy() // 销毁图
    }
    clearInterval(this.topology_interval) // 销毁定时器
    clearInterval(this.path_interval)
    this.topology_interval = null
    this.pad_interval = null
    this.nodes = []
    this.edges = []
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    netOnOff() {
      netOnOff().then((res) => {
        console.log(res)
        this.$store.state.settings.netStatus = res.data.status
        this.isButtonsDisabled = !res.data.status
        if (res.data.status && !this.topology_interval) {
          this.topology_interval = setInterval(() => {
            this.getTopology()
          }, 3000)
        }
      })
    },
    sendPkg() { // 发包
      sendPkg().then((res) => {
        this.$message({
          message: res.msg,
          type: res.msg === 'test1.pcap数据包正在发送' ? 'success' : 'error'
        })
        if (this.path_interval) {
          clearInterval(this.path_interval)
          this.path_interval = null
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
        this.prevNodes.forEach((edge) => {
          this.networkInstance.updateItem(edge, {
            type: 'quadratic',
            style: {
              stroke: '#333',
              lineWidth: 2
            }
          })
        })
        this.prevNodes = []
        path.forEach((element) => {
          const source = element.srcNodeConnector.slice(0, element.srcNodeConnector.indexOf(':') + 2)
          const target = element.dstnodeConnector.slice(0, element.dstnodeConnector.indexOf(':') + 2)
          const edge_id = source + target
          this.prevNodes.push(edge_id)
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
        this.networkInstance.refresh()
        this.isFetching = false
      })
    },
    constructGraph() { // 构建图
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
      const container = this.$refs.networkContainer

      this.networkInstance = new G6.Graph({
        container: container,
        fitView: true,
        fitViewPadding: [20, 40, 50, 20],
        layout: {
          animate: true,
          type: 'force2',
          preventOverlap: true,
          nodeSize: 150,
          nodeSpacing: 80,
          linkDistance: 1000,
          linkStrength: 0.5
        },
        defaultNode: {
          type: 'image',
          size: 50,

          labelCfg: {
            style: {
              fill: '#000',
              fontSize: 12,
              fontWeight: 800,
              background: {
                fill: '#DEE9FF',
                stroke: '#5B8FF9',
                padding: [4, 4, 4, 4],
                radius: 3
              }

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
            }

          },
          labelCfg: {
            refY: 10,

            style: {
              fontWeight: 800,
              fontSize: 20

            },

            position: 'bottom',
            offset: 5
          },
          curveOffset: 100
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
      this.networkInstance.on('node:click', (event) => {
        this.toggleMenu(event, 'node')
      })
      this.networkInstance.on('wheelzoom', (event) => {
        const menu = document.getElementById('nodeContextMenu')
        menu.style.display = 'none'
        this.isMenuShow = false
        this.networkInstance.refreshPositions()
      })
      this.networkInstance.on('edge:click', (event) => {
        this.toggleMenu(event, 'edge')
      })
      this.networkInstance.on('canvas:click', (event) => {
        const menu = document.getElementById('nodeContextMenu')
        menu.style.display = 'none'
        this.isMenuShow = false
      })
      this.networkInstance.on('afterlayout', () => {
        this.networkInstance.getNodes().forEach(node => {
          const model = node.getModel()
          const { x, y } = model

          // 画布的尺寸
          const width = this.networkInstance.getWidth()
          const height = this.networkInstance.getHeight()

          // 计算边界，这里假设节点大小约为 40x40
          const radius = 25

          // 确保节点在画布内
          model.x = Math.min(Math.max(radius, x), width - radius)
          model.y = Math.min(Math.max(radius, y), height - radius)
        })

        // 更新节点位置
        this.networkInstance.refreshPositions()
      })
    },
    async getTopology() { // 获取拓扑
      if (this.isFetching) {
        return
      }
      this.isFetching = true
      await getTopology().then((res) => {
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
            if (!this.edges.some(e => e.id === element['linkid' ])) {
              this.edges.push({
                target: element[ 'destination' ][ 'dest-node' ],
                source: element[ 'source' ][ 'source-node' ],
                id: element['linkid' ]
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
            if (!this.edges.some(e => e.id === element['linkid' ])) {
              this.networkInstance.addItem('edge', {
                target: element[ 'destination' ][ 'dest-node' ],
                source: element[ 'source' ][ 'source-node' ],
                id: element['linkid' ]
              })
              this.edges.push({
                target: element[ 'destination' ][ 'dest-node' ],
                source: element[ 'source' ][ 'source-node' ],
                id: element['linkid' ]
              })
              this.networkInstance.refresh()
            }
          })
        }
      })
      this.getGlobalDelay()
      this.isFetching = false
    },
    handleIconClick(key, id) {
      let itemName
      let paras
      if (id.includes('服务器')) {
        this.isMenuShow = false
        const menu = document.getElementById('nodeContextMenu')
        menu.style.display = 'none'
        this.$message({
          message: '服务器无法模拟故障',
          type: 'info'
        })
        return
      }
      switch (key) {
        case '6':
          itemName = id
          console.log(itemName)
          paras = { node: itemName, status: 'down' }
          fault(paras).then((res) => {
            console.log(res)
            this.$message({
              message: res.msg.includes('down') ? '节点已处于模拟故障状态' : '节点' + itemName + '故障模拟成功',
              type: res.msg.includes('down') ? 'error' : 'success'
            })
            this.isMenuShow = false
            const menu = document.getElementById('nodeContextMenu')
            menu.style.display = 'none'
          })
          break
        case '5':
          itemName = id
          console.log(itemName)
          paras = { node: itemName, status: 'up' }
          fault(paras).then((res) => {
            console.log(res)
            this.$message({
              message: res.msg.includes('up') ? '节点未处于模拟故障状态' : '节点' + itemName + '解除模拟故障成功',
              type: res.msg.includes('up') ? 'error' : 'success'
            })
            this.isMenuShow = false
            const menu = document.getElementById('nodeContextMenu')
            menu.style.display = 'none'
          })
          break
        case '4':
          itemName = id
          paras = { operation: 'del_node', name1: itemName }
          deleteItem(paras).then((res) => {
            console.log(res)
            // this.$message({
            //   message: res.msg.includes('up') ? '节点未处于模拟故障状态' : '节点' + itemName + '解除模拟故障成功',
            //   type: res.msg.includes('up') ? 'error' : 'success'
            // })
            if (res.msg.includes('已被删除')) {
              this.networkInstance.removeItem(itemName)
              this.prevNodes.filter((item) => {
                return item !== itemName
              })
              this.nodes.filter((item) => {
                return item !== itemName
              })
              this.networkInstance.refresh()
            }
            this.isMenuShow = false
            const menu = document.getElementById('nodeContextMenu')
            menu.style.display = 'none'
          })
          break
        case '7':
          itemName = id
          paras = { operation: 'del_link', name1: itemName }
          deleteItem(paras).then((res) => {
            console.log(res)

            if (res.msg.includes('已被成功删除')) {
              this.networkInstance.removeItem(itemName)
              this.edges.filter((item) => {
                return item !== itemName
              })
              this.networkInstance.refresh()
            }
            this.isMenuShow = false
            const menu = document.getElementById('nodeContextMenu')
            menu.style.display = 'none'
          }).catch((err) => {
            console.log(err)
          })
          break
        default:
          console.log('没有此选项')
          break
      }
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
    },
    toggleMenu(event, type) {
      if (this.isMenuShow) {
        this.isMenuShow = false
        const menu = document.getElementById('nodeContextMenu')
        menu.style.display = 'none'
        // this.prevCoordinates = null
        this.toggleMenu(event, type)
      } else {
        const { clientX, clientY } = event// 获取鼠标点击的位置
        const biasX = this.$store.state.app.sidebar.opened ? -220 : -60
        const biasY = -96
        // 显示菜单并设置位置
        const menu = document.getElementById('nodeContextMenu')
        const matrix = this.networkInstance.get('group').getMatrix() ? this.networkInstance.get('group').getMatrix() : [1, 0, 0, 0, 1, 0, 0, 0, 1]
        const scale = matrix[ 0 ]
        const target = 30 / scale
        if (this.prevCoordinates) {
          if (Math.abs(this.prevCoordinates.x - clientX - biasX) <= target && Math.abs(this.prevCoordinates.y - clientY - biasY) <= target) {
            menu.style.display = 'none'
            this.prevCoordinates = null
            return
          }
        }
        this.menuListItems = type === 'node' ? [
          { key: '1', value: '查看节点信息', id: event.item.getID() },
          { key: '2', value: '查看节点流表', id: event.item.getID() },
          { key: '3', value: '查看节点端口', id: event.item.getID() },
          { key: '4', value: '移除模拟节点', id: event.item.getID() },
          { key: '5', value: '解除模拟故障', id: event.item.getID() },
          { key: '6', value: '模拟节点故障', id: event.item.getID() }
        ] : [
          { key: '7', value: '移除模拟链路', id: event.item.getID() },
          { key: '8', value: '查看链路流表', id: event.item.getID() },
          { key: '9', value: '查看链路端口', id: event.item.getID() },
          { key: '10', value: '查看链路链路', id: event.item.getID() },
          { key: '11', value: '查看链路流表', id: event.item.getID() },
          { key: '12', value: '查看链路流表', id: event.item.getID() }
        ]
        menu.style.display = 'block'
        menu.style.left = `${clientX + biasX}px`
        menu.style.top = `${clientY + biasY}px`
        this.isMenuShow = true
        this.prevCoordinates = { x: clientX + biasX, y: clientY + biasY }
      }
    },
    getGlobalDelay() {
      getGlobalDelay().then((res) => {
        res.data.output[ 'delay-status-list' ].forEach((element) => {
          if (!element[ 'nodeConnector' ].includes('openflow')) {
            // const str1 = element[ 'nodeConnector' ].slice(0, element[ 'nodeConnector' ].indexOf('_') + 1).slice(0, element[ 'nodeConnector' ].slice(0, element[ 'nodeConnector' ].indexOf('_') + 1).indexOf(':') + 2)
            // const str2 = element[ 'nodeConnector' ].slice(element[ 'nodeConnector' ].indexOf('_') + 1, element[ 'nodeConnector' ].length).slice(0, element[ 'nodeConnector' ].slice(element[ 'nodeConnector' ].indexOf('_') + 1, element[ 'nodeConnector' ].length).indexOf(':') + 2)

            // const combineStr = str1 + str2
            this.networkInstance.updateItem(element['nodeConnector'], {
              label: element[ 'delay' ] + 'ms'
            })
          }
        })
        this.networkInstance.refresh()
      })
    },
    handleCommand(type) {
      const popup = document.getElementById('popup')
      popup.style.display = 'block'
      const overlay = document.getElementById('overlay')
      overlay.style.display = 'block'
      switch (type) {
        case 'node':
          this.testArr = this.addOptions[ 0 ].options
          console.log(this.testArr)
          break
        case 'edge':
          this.testArr = this.addOptions[ 1 ].options
          console.log(this.testArr)
          break
        default:
          console.log('没有此选项')
          break
      }
    },
    handlePopUpClose() {
      const popup = document.getElementById('popup')
      popup.style.display = 'none'
      const overlay = document.getElementById('overlay')
      overlay.style.display = 'none'
    },
    startDrag(e) { // 实现拖拽监听
      this.isDragging = true
      this.dragStartX = e.clientX - parseInt(this.childStyle.left, 10)
      this.dragStartY = e.clientY - parseInt(this.childStyle.top, 10)
    },
    onDrag(e) { // 改变窗口位置
      if (!this.isDragging) return
      this.childStyle.left = `${e.clientX - this.dragStartX}px`
      this.childStyle.top = `${e.clientY - this.dragStartY}px`
    },
    stopDrag() {
      this.isDragging = false
    },
    testClearCanvas() {
      this.networkInstance.clear()
    },
    handleChangeChartsView() {
      const rightChartPanel = document.getElementsByClassName('rightChartPanel')[0]
      // const handleChartsButton = document.getElementsByClassName('handle-charts-button')[0]
      if (rightChartPanel.style.transform === 'translate(100%)') {
        rightChartPanel.style.transform = 'translate(0%)'
        // handleChartsButton.style.transform = 'translate(100%)'
      } else {
        rightChartPanel.style.transform = 'translate(100%)'
        // handleChartsButton.style.transform = 'translate(0%)'
      }
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
#nodeContextMenu {
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

.menulist {
  padding: 5px 0;
  cursor: pointer;
}
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
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
  border-radius: 6px 6px 0 0 !important;
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
.rightChartPanel { //右侧体表边栏样式
  width: 100%;
  max-width: 320px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

</style>
