<template>
  <div style="height: 100vh; position: relative; padding:5px 3px 3px 3px">
    <div ref="rightChartPanel" :class="{show:show}" class="rightPanel-container">
      <div class="rightChartPanel-background" />
      <div class="rightChartPanel">
        <div class="handle-charts-button" :style="{'bottom':buttonBtm+'px','background-color':theme}" @click="show=!show"><i class="el-icon-s-marketing" /></div>
        <div><Choice @option="inject" /></div> <!--侧边栏-->
      </div>
    </div>
    <div class="container">
      <div style="border-right: 2px solid grey; width: 1400px; height: 80vh">
        <p class="thirdHead" style="margin-left: 8px;">验证拓扑图</p>
        <div id="network" style="height: 100%; width: 100%" class="network" />
      </div>
      <hr>
      <div class="graphs">
        <div class="network-container">
          <p class="thirdHead" style="margin-left:10px; margin-bottom:22%;">验证过程回溯</p>
          <!-- <el-card
            v-for="graph in agraphs"
            :key="graph.id"
            shadow="always"
            class="network1"
            :style="{ height: '350px' }"
          >
            <div :ref="graph.id" :key="graph.id" style="height: 100%; width: 100%;" />

          </el-card> -->
          <el-carousel height="600px" interval="3000">
            <el-carousel-item v-for="graph in agraphs" :key="graph.id">
              <div :ref="graph.id" :key="graph.id" style="height: 80%; width: 100%;box-shadow: 0 2px 4px rgba(0,0,0,0.1);border-radius: 4px; border: 1px solid #ddd;" />
              <p style="font-family: SimHei; font-size: 22px; margin-left: 40%;">回溯过程第{{ graph.id }}步</p>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <div>
      <el-tabs type="border-card">
        <el-tab-pane label="全部">
          <div
            v-for="(item, index) in verify"
            :key="index"
            class="foverc"
            @mouseenter="getitems(item)"
            @mouseleave="goseleave"
          >
            <div style="display: inline-block; width: 400px">
              {{ item.time }}毫秒
            </div>
            <template v-if="item.result === 0">
              <div style="display: inline-block">
                [ <span style="color: #95f204">正确</span> ]
              </div>
              <div>目标 {{ item.ipaddress }} 策略验证正确下发</div>
            </template>
            <template v-else>
              <div style="display: inline-block">
                [ <span style="color: red">错误</span> ]
              </div>
              <div>
                目标 {{ item.ipaddress }} 策略验证错误，发生<span
                  v-if="item.result === 2"
                >黑洞 </span><span v-else>环路 </span>。故障定位：{{ item.faultdev }}
              </div>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="策略错误">
          <div
            v-for="(item, index) in verify"
            :key="index"
            class="foverc"
            @mouseenter="getitems(item)"
            @mouseleave="goseleave"
          >
            <template v-if="item.result === 0" />
            <template v-else>
              <div style="display: inline-block; width: 400px">
                {{ item.time }}毫秒
              </div>
              <div style="display: inline-block">
                [ <span style="color: red">错误</span> ]
              </div>
              <div>
                目标 {{ item.ipaddress }} 策略验证错误，发生<span
                  v-if="item.result === 2"
                >黑洞 </span><span v-else>环路 </span>。故障定位：{{ item.faultdev }}
              </div>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="策略正确">
          <div
            v-for="(item, index) in verify"
            :key="index"
            class="foverc"
            @mouseenter="getitems(item)"
            @mouseleave="goseleave"
          >
            <template v-if="item.result === 0">
              <div style="display: inline-block; width: 400px">
                {{ item.time }}毫秒
              </div>
              <div style="display: inline-block">
                [ <span style="color: #95f204">正确</span> ]
              </div>
              <div>目标 {{ item.ipaddress }} 策略验证正确下发</div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script
  type="text/javascript"
  src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"
></script>
<script>
import Vis from "vis";
import { verify, getPolicyFG } from "@/api/prototype";
import Choice from "./components/choice.vue";
const phone_img = require("@/assets/network_icons/2d_phone.svg");
const server_img = require("@/assets/network_icons/server.svg");
const switch_img = require("@/assets/network_icons/switch.svg");
const switch_err_img = require("@/assets/network_icons/switch_error.svg");
export default {
  name: "Policy",
  components: {
    Choice,
  },
  data() {
    return {
      show: false,
      buttonBtm: 0,
      dialogVisible: false,
      valuegroup: "",
      checked: false,
      returnshow: false,
      verify: [],
      intevtimes: null,
      nodesArray: [],
      //   关系线数组
      edgesArray: [],
      inputbz: "",
      inputmc: "",
      visible: false,
      visiblekey: false,
      nodes: [],
      edges: [],
      num: 1,
      status: false,
      chosed: "",
      checknode: "",
      addnode: {},
      linklist: [],
      valueswitch: true,
      dialogVisiblelink: false,
      dialogaddnode: false,
      network: null,
      container: null,
      changedNodeStorage:[],
      //   节点数组
      smallgraphnumber: 1,
      //小图个数
      options: {
        autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
        locale: "cn", //语言设置：工具栏显示中文
        locales: {
          cn: {
            //工具栏中文翻译
            edit: "编辑",
            del: "删除当前节点或关系",
            back: "返回",
            addNode: "添加节点",
            addEdge: "添加连线",
            editNode: "编辑节点",
            editEdge: "编辑连线",
            addDescription: "点击空白处可添加节点",
            edgeDescription: "点击某个节点拖拽连线可连接另一个节点",
            editEdgeDescription: "可拖拽连线改变关系",
            createEdgeError: "无法将边连接到集群",
            deleteClusterError: "无法删除集群.",
            editClusterError: "无法编辑群集'",
          },
        },
        // 设置节点样式
        nodes: {
          //shape: "image", //节点的外观。为circle时label显示在节点内，为dot时label显示在节点下方
          size: 20, //节点的大小，
          shadow: false, //如果为true，则节点使用默认设置投射阴影。
          font: {
            //字体配置
            size: 15,
            color: "black",
            align: "center",
          },
          // color: {
          //   border: "#000001", //节点边框颜色
          //   background: "#FFFFFF", //节点背景颜色
          //   highlight: { background: "red", border: "red" },
          //   hover: { background: "red", border: "red" },
          // },
          margin: 5, //当形状设置为box、circle、database、icon、text；label的边距
          widthConstraint: 100, //设置数字，将节点的最小和最大宽度设为该值,当值设为很小的时候，label会换行，节点会保持一个最小值，里边的内容会换行
          borderWidth: 1, //节点边框宽度，单位为px
          borderWidthSelected: 3, //节点被选中时边框的宽度，单位为px
          labelHighlightBold: false, //确定选择节点时标签是否变为粗体
          chosen:{
            label:false,

          },
        },
        // 边线配置
        edges: {
          width: 1,
          length: 200,
          chosen: {
            // label:true
            label: function (values, id, selected, hovering) {
              return (values.size = 18);
            },
          },
          scaling: {
            min: 1,
            max: 15,
            label: {
              enabled: true,
              min: 0,
              max: 30,
              maxVisible: 30,
              drawThreshold: 5,
            },
            customScalingFunction: function (min, max, total, value) {
              return Math.max(0, 30);
            },
          },

          color: {
            color: "#848499",
            highlight: "red",
            hover: "#88dab1",
            inherit: "from",
            opacity: 1.0,
          },
          font: {
            color: "#343434",
            size: 7, // px
            face: "arial",
            background: "none",
            strokeWidth: 2, // px
            strokeColor: "#ffffff",
            align: "horizontal",
            multi: false,
            vadjust: 0,
            bold: {
              color: "#343434",
              size: 14, // px
              face: "arial",
              vadjust: 0,
              mod: "bold",
            },
            ital: {
              color: "#343434",
              size: 14, // px
              face: "arial",
              vadjust: 0,
              mod: "italic",
            },
            boldital: {
              color: "#343434",
              size: 14, // px
              face: "arial",
              vadjust: 0,
              mod: "bold italic",
            },
            mono: {
              color: "#343434",
              size: 15, // px
              face: "courier new",
              vadjust: 2,
              mod: "",
            },
          },
          shadow: false,
          smooth: {
            //设置两个节点之前的连线的状态
            type: "vertical",
            // forceDirection:'vertical',
            enabled: true, //默认是true，设置为false之后，两个节点之前的连线始终为直线，不会出现贝塞尔曲线
          },
          arrows: { to: true }, //箭头指向to
        },
        // 布局
        layout: {
          randomSeed: 1, //配置每次生成的节点位置都一样，参数为数字1、2等
        },
        //计算节点之前斥力，进行自动排列的属性
        physics: {
          enabled: false, //默认是true，设置为false后，节点将不会自动改变，拖动谁谁动。不影响其他的节点
          barnesHut: {
            gravitationalConstant: -4000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0,
          },
        },
        //用于所有用户与网络的交互。处理鼠标和触摸事件以及导航按钮和弹出窗口
        interaction: {
          hover: true,
          dragNodes: true, //是否能拖动节点
          dragView: true, //是否能拖动画布
          hover: false, //鼠标移过后加粗该节点和连接线
          multiselect: false, //按 ctrl 多选
          selectable: false, //是否可以点击选择
          selectConnectedEdges: false, //选择节点后是否显示连接线
          hoverConnectedEdges: false, //鼠标滑动节点后是否显示连接线
          zoomView: true, //是否能缩放画布
        },
      },
      data: {},
      selectedId: null,
      selectedlink: null,
      nodeForm: {},
      linkForm: {},
      agraphs: [],
      //小图
      // agraphs: [],
    };
  },
  computed:{
    theme(){
      return this.$store.state.settings.theme
    }
  },
  watch:{
    show(value) {
      if (value) {
        this.addEventClick()
      }
    }
  },

  mounted() {
    // await this.getrequest2();

    // await this.getPreviousProgress();
    // await this.createSmallGraphs();
  },
  beforeDestroy() {
    clearInterval(this.intevtimes);
  },
  methods: {
    getPreviousProgress() {
      getPolicyFG().then((response) => {
        var count = 0;
        this.agraphs = [];
        response.data.graphs.forEach((element) => {

          count = count + 1;

          const temp = {
            title: "",
            nodes: element["node"],
            edges: element["edge"],
            id: count,
          };
          this.agraphs.push(temp);

        });

        this.agraphs.forEach((e) => {
          var gp = e.nodes;
          for (var i = 0; i < gp.length; i++) {
            gp[i]["label"] = gp[i]["id"];
            if(gp[i]["label"].includes("交换机")){
              gp[i]["shape"] = "image"
              gp[i]["image"] = switch_img;
            }
            else if(gp[i]["label"].includes("服务器")){
              gp[i]["shape"] = "image"
              gp[i]["image"] = server_img;
            }
            else {
              gp[i]["shape"] = "image"
              gp[i]["image"] = phone_img;
            }

          }
          gp = e.edges;
          gp.forEach((item) => {
            var cons = "";
            //if(item["ecs"].length > 0){
            item["ecs"].forEach((component) => {
              cons = cons + component + ", ";
            });
            //}
            item["label"] = cons;
          });
        });

      });
    },
    getrequest2(paras) {
      verify({type:paras}).then((e) => {
        this.nodesArray = e.data.Node.map((element) => {
          return {
            id: element["nodeid"],
            label: element["nodeid"],
            status: element["status"],
            shape: "image",
            image: element["nodeid"].includes("交换机") ? switch_img : (element["nodeid"].includes("服务器") ? server_img : phone_img),
          };
        });
        this.edgesArray = e.data.Edge.map((item) => {
          return {
            id: item["edgeid"],
            from: item["sourceNode"],
            to: item["destinationNode"],
            label: "",
            status: item["status"],
            color: { color: "grey" },
          };
        });
        this.init();
        e.data.time =  e.data.time.substring(0,5)
        this.verify.push({
          time: e.data.time,
          ipaddress: e.data.verify.faultip[0],
          Node: e.data.Node,
          Edge: e.data.Edge,
          result: e.data.verify.result,
          faultdev: e.data.verify.faultdev,
        });
      });
    },

    inject(val){
      setTimeout(() => {
        this.getrequest2(val)

      }, 1000);
      setTimeout(() => {
        this.getPreviousProgress()
      }, 4000);

      setTimeout(() => {
        this.createSmallGraphs();
      }, 8000);
      this.show = !this.show
    },
    getitems(value) {
      const node = [];
      const edeg = [];
      value.Node.forEach((e) => {
        if (e.status === 1) {
          node.push(e.nodeid);
          this.nodes.update({id:e.nodeid, image:switch_err_img})
        }

      });
      this.changedNodeStorage = node
      value.Edge.forEach((e) => {
        if (e.status === 1) {
          edeg.push(e.edgeid);
        }
      });
      if (node.length > 0) {
        this.network.selectNodes(node, false);
        this.network.redraw();
      }
      if (edeg.length > 0) {
        this.network.selectEdges(edeg, true);
      }
    },
    goseleave() {
      this.network.unselectAll();
      if(this.changedNodeStorage.length > 0){
        this.changedNodeStorage.forEach((item) => {
          this.nodes.update({id:item, image:switch_img})
        })
      }
    },

    //初始化图谱参数配置
    init() {
      //1.创建一个nodes数组
      this.nodes = new Vis.DataSet(this.nodesArray);
      //2.创建一个edges数组
      this.edges = new Vis.DataSet(this.edgesArray);
      this.container = document.getElementById("network");
      this.data = {
        nodes: this.nodes,
        edges: this.edges,
      };
      //TODO: 优化
      this.network = new Vis.Network(this.container, this.data, this.options);
      this.network.on("selectNode", (params) => {
        console.log(params)
        for(item in params.nodes){

          var selectNode = this.nodesArray.get(item)
          selectNode.image = switch_err_img
          this.nodesArray.update(selectNode)
        }

      });
      this.network.on("deselectNode", (params) => {
        for(item in params.nodes){
          var selectNode = this.nodesArray.get(item)
          selectNode.image = switch_img
          this.nodesArray.update(selectNode)
        }
      });
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
    },
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightChartPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    createSmallGraphs() {

      this.agraphs.forEach((graph) => {

        const container = this.$refs[graph.id][0];
        const data = {
          nodes: new Vis.DataSet(graph.nodes),
          edges: new Vis.DataSet(graph.edges),
        };

        const options = {
          height: "350px",
          width: "100%",
          nodes: {
            shape: "image",
            size: 30,
            // label: "${j}",
            color: {border:"grey",background:"white"},
            font:{color:"black"},
            image: switch_img,
          },
          edges: {
            width: 3,
            color: { color: "black" },
            arrows: "to",
            label: "1.21",
            font: {
              color: "red",
              size: 24,
              align: "top",
              bold: "20px arial #942D09",
            },
          },
          autoResize: true,

          interaction: {
            zoomView: true,
            dragView: true,
            dragNodes: false,
          },
        };
        new Vis.Network(container, data, options);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.network {
  // border:1px solid black;
  margin: 10px;
  flex: 1;
  //border-right: 2px solid grey;
  //?
}
.foverc:hover {
  background-color: #f5f7fa;
}
.graphs {
  width: 30vw;
  height: 80vh;
  margin-bottom: 32px;
  flex-shrink: 1;
  overflow-y: scroll;
  overflow-x: hidden;
}
.container {
  display: flex;
}
.network-container {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.network1 {
  width: 100%;
  height: 100%;
  // flex: 1;
  margin: 10px 10px 0 0;
}
.title {
  text-align: center;
  font-size: 4px;
}
.thirdHead {
  font-size: 16px;
  font-family: Arial, Microsoft YaHei;
  font-weight: bold;

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
.rightChartPanel { //右侧体表边栏样式
  width: 100%;
  max-width: 350px;
  height: 100vh;
  position: fixed;
  top: 0;
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

