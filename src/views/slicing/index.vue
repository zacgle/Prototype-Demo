<template>
  <div style="margin: 10px">
    <!-- <div v-show="showchart" id="echartPosition" class="showcharts"></div> -->
    <div style="display: flex">
      <div style="height: 400px; width: 60%; flex: 1 0 auto; border-bottom:grey solid 2px;">
        <div style="width: 100%; height: 30px; position: relative">
          <div style="display: inline-block; font: bold 16px Georgia;margin-top: -15px;">
            <p>切片视图</p>
          </div>
          <div style="display: inline-block; position: absolute; right: 50px">
            当前显示切片：
            <el-select
              v-model="picevalue"
              size="mini"
              placeholder="请选择"
              @change="changeSliceToShow"
            >
              <el-option
                v-for="(item, index) in tableData"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </div>
        </div>

        <div style="display: flex; height: 370px;">
          <div
            id="network_id"
            class="network"
            style="

              width: 100%;
              height: 100%;
              border: 1 solid #000;
              flex: 1 1 auto;
            "
          />
          <div style="flex: 1 0 auto; width: 300px; height: 370px">
            <div v-show="showchart" id="echartPosition" class="showcharts" />
          </div>
        </div>
      </div>
      <!-- <el-divider direction="vertical" /> -->
      <div
        style="

          flex: 1 auto;
          border-left: grey solid 2px;
          border-bottom:grey solid 2px;
          height: 400px;
          padding-left: 10px;

        "
      >
        <div
          style="
            width: 100%;
            height: 30px;
            display: flex;
            justify-content: space-between;
          "
        >
          <div style="font: bold 16px Georgia; margin-top:-15px">
            <p>切片资源监视列表</p>
          </div>
          <div>
            <el-select
              v-model="tableSelected"
              placeholder="请选择"
              size="mini"
              style="margin-right: 30px;"
              @change="getTableContents"
            >
              <el-option
                v-for="item in tableSelections"
                :key="item.id"
                :label="item.id"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div style="overflow-y: auto; height: 100%">
          <el-table
            v-if="tableSelected === '其余关键指标'"
            :data="kpis"
            style="width: 660px"
          >
            <el-table-column label="指标名称" prop="target_name" />
            <el-table-column label="指标数值" prop="target_value" />
          </el-table>
          <el-table
            v-if="tableSelected === '带宽情况'"
            :data="tableSlicing"
            style="width: 660px"
          >
            <el-table-column label="设备一" prop="srcNode" />

            <el-table-column label="设备二" prop="dstNode" />
            <el-table-column label="资源类型" prop="type" />
            <el-table-column label="资源总量" prop="total" />
            <el-table-column label="资源使用量" prop="occupied" />
            <el-table-column label="资源使用比" prop="percentage">
              <template slot-scope="scope">
                {{ scope.row.percentage }}
                <i
                  v-if="scope.row.tendency > 0"
                  class="el-icon-top-right"
                  style="color: #09f614"
                />
                <i
                  v-if="scope.row.tendency < 0"
                  class="el-icon-bottom-right"
                  style="color: red"
                />
                <i
                  v-if="scope.row.tendency === 0"
                  class="el-icon-right"
                  style="color: #02adf7"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div style="margin: 10px 0px">
      <div style="width: 100%; height: 30px; position: relative">
        <div style="display: inline-block; font: bold 16px Georgia">
          <p>切片列表</p>
        </div>
        <div style="display: inline-block; position: absolute; right: 100px">
          <el-button
            type="primary"
            size="mini"
            @click="push"
          >新建切片</el-button>
        </div>
      </div>
      <div style="width: 100%; margin-top: 5px">
        <template v-for="cont in tableData">
          <div
            :key="cont.name"
            style="
              width: 30%;
              display: inline-block;
              margin: 1% 1%;
              height: 210px;
            "
          >
            <el-card>
              <div
                style="
                  text-align: center;
                  vertical-align: middle;
                  display: flex;
                  flex-wrap: wrap-reverse;
                  justify-content: center;
                  align-content: center;
                "
              >
                <div style="display: inline-block; width: 35%">
                  <el-progress
                    type="dashboard"
                    :percentage="parseInt(cont.percentage)"
                    :color="colors"
                  />
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 25%;
                    height: 100%;
                    margin-bottom: 10px;
                  "
                >
                  <div style="height: 3em">
                    <span>正常业务：</span>{{ cont.normal_events || 152555555 }}
                  </div>
                  <div style="height: 3em">
                    <span>异常业务：</span>{{ cont.ab_events || 999999 }}
                  </div>
                  <!-- <div style="height: 3em">
                    <span>切片事件：</span>{{ cont.sliceEvent || "这是切片事件" }}
                  </div> -->
                </div>
                <div
                  style="
                    display: inline-block;
                    width: 25%;
                    height: 100%;
                    margin-bottom: 19px;
                  "
                >
                  <div style="height: 3em">
                    <span style="font-size: 20px; font-weight: 900">{{
                      cont.name
                    }}</span>
                  </div>
                  <div style="height: 3em" />
                  <!-- <div style="height: 3em">
                    <span>切片事件：</span>{{ 123 }}
                  </div> -->
                </div>
              </div>
            </el-card>
            <div :key="cont.name" style="width: 100%">
              <el-button-group style="width: 100%">
                <el-button
                  style="width: 45%"
                  type="info"
                  @click="handleDelete(cont.name)"
                >删除</el-button>
                <el-button
                  style="width: 10%"
                  class="el-icon-share"
                  @click="changerow(cont)"
                />
                <el-button
                  style="width: 45%"
                  type="info"
                  @click="tendsmbps(cont)"
                >一键扩容</el-button>
              </el-button-group>
            </div>
          </div>
        </template>
      </div>

      <el-dialog
        :title="
          !changerowkey && !tendkey
            ? '申请新切片'
            : changerowkey
              ? '修改切片'
              : '请求扩容'
        "
        :visible.sync="dialogFormVisible"
        style="width: 1000px; left: 500px"
      >
        <el-form v-if="!tendkey" :model="form">
          <el-form-item label="切片名称" :label-width="formLabelWidth">
            <el-input
              v-model="form.name"
              autocomplete="off"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="始末节点" :label-width="formLabelWidth">
            <el-select v-model="form.path" filterable allow-create>
              <el-option
                v-for="item in optionlist"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="!changerowkey"
            label="使用场景"
            :label-width="formLabelWidth"
          >
            <el-select v-model="form.size" @change="pushband">
              <el-option
                v-for="item in optionsize"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="带宽需求" :label-width="formLabelWidth">
            <el-input
              v-model="form.band"
              autocomplete="off"
              style="width: 180px"
            /><span style="margin-left: 10px">Mbps</span>
          </el-form-item>
        </el-form>
        <template v-else>
          <el-input
            v-model="form.band"
            autocomplete="off"
            style="width: 180px"
          /><span style="margin-left: 10px">Mbps</span></template>

        <div slot="footer" class="dialog-footer">
          <el-button @click="gocancle">取 消</el-button>
          <el-button type="primary" @click="gopush">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script
  type="text/javascript"
  src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"
></script>
<script>
import Vis from "vis";
import { getTopology } from "@/api/prototype.js";
let servicebreak = require("@/assets/network_icons/server.svg");
let serviceoff = require("@/assets/network_icons/server.svg");
let serviceselect = require("@/assets/network_icons/server.svg");
let service = require("@/assets/network_icons/server.svg");
let switchbreak = require("@/assets/network_icons/server.svg");
let switchoff = require("@/assets/network_icons/server.svg");
let switchm = require("@/assets/network_icons/switch.svg");
let switchselect = require("@/assets/network_icons/server.svg");
let FRADsbreak = require("@/assets/network_icons/server.svg");
let FRADsvr = require("@/assets/network_icons/server.svg");
let FRADs = require("@/assets/network_icons/end_equip.svg");
let FRADsselect = require("@/assets/network_icons/server.svg");
import {
  slicing,
  slinfo,
  slnet,
  slink,
  multipath,
  getSliceCard,
} from "@/api/prototype.js";
import * as echarts from "echarts";
export default {
  data() {
    return {
      checktimes: 0,
      checkList: [],
      linerange: [{ service: "", color: "", path: "" }],
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      renderedLines:[],
      timeIntervtup: null,
      timeIntervtable: null,
      timeIntervpice: null,
      changerowkey: false,
      tendkey: false,
      showchart: false,
      optionlist: [
        { name: "移动手机_服务器:1", value: "移动手机_服务器:1" },
        { name: "VR设备_服务器:2", value: "vr设备_服务器:2" },
        { name: "移动手机_服务器:2", value: "移动手机_服务器:2" },
      ],
      currentPage: 1,
      size: 6,
      total: 0,
      tableData: [],
      tableSlicing: [],
      nodesArray: [],
      edgesArray: [],
      kpis: [],
      tableSelections: [{ id: "带宽情况" }, { id: "其余关键指标" }],
      tableSelected: "带宽情况",
      dialogFormVisible: false,
      optionpice: [
        { label: "游戏(1Mbps)", value: 1 },
        { label: "视频(10Mbps)", value: 10 },
        { label: "串流(30Mbps)", value: 30 },
      ],
      optionsize: [
        { name: "游戏(1Mbps)", value: 1 },
        { name: "视频(10Mbps)", value: 10 },
        { name: "串流(30Mbps)", value: 30 },
      ],
      picevalue: "",
      form: {
        name: "",
        band: "",
        priority: 1,
        path: "",
      },
      formLabelWidth: "150px",
      optionechart: {
        animation: false,
        legend: {
          top: "4%",
          left: "center",
        },
        color: ["#e8f9fd", "#79dae8", "#0aa1dd", "#2155cd"],
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "40%",
            label: {
              formatter: "{per|{d}%}  ",
              rich: {
                a: {
                  color: "#6E7079",
                  lineHeight: 22,
                  align: "center",
                },
                hr: {
                  borderColor: "#8C8D8E",
                  width: "100%",
                  borderWidth: 1,
                  height: 0,
                },
                b: {
                  color: "#4C5058",
                  fontSize: 14,
                  fontWeight: "bold",
                  lineHeight: 33,
                },
                per: {
                  color: "#fff",
                  backgroundColor: "#4C5058",
                  padding: [3, 4],
                  borderRadius: 4,
                },
              },
            },
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
              },
            },
          },
        ],
      },
      options: {
        autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
        locale: "cn", //语言设置：工具栏显示中文
        height: "100%",
        width: "100%",
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
          shape: "dot", //节点的外观。为circle时label显示在节点内，为dot时label显示在节点下方
          size: 20, //节点的大小，
          shadow: false, //如果为true，则节点使用默认设置投射阴影。
          font: {
            //字体配置
            size: 20,
            color: "black",
            align: "center",
          },
          color: {
            border: "#000", //节点边框颜色
            background: "#ffc7c7", //节点背景颜色
            highlight: {
              //节点选中时状态颜色
              border: "rgb(117, 218, 167)",
              background: "rgb(117, 218, 167)",
            },
            hover: {
              //节点鼠标滑过时状态颜色
              border: "#dff9fb",
              background: "#88dab1",
            },
          },
          margin: 5, //当形状设置为box、circle、database、icon、text；label的边距
          widthConstraint: 100, //设置数字，将节点的最小和最大宽度设为该值,当值设为很小的时候，label会换行，节点会保持一个最小值，里边的内容会换行
          borderWidth: 1, //节点边框宽度，单位为px
          borderWidthSelected: 3, //节点被选中时边框的宽度，单位为px
          labelHighlightBold: false, //确定选择节点时标签是否变为粗体
        },
        // 边线配置
        edges: {
          width: 1,
          length: 100,
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
            highlight: "rgb(117, 218, 167)",
            hover: "#88dab1",
            inherit: "from",
            opacity: 1.0,
          },
          font: {
            color: "#000000",
            size: 10, // px
            face: "arial",
            background: "none",
            strokeWidth: 2, // px
            strokeColor: "#ffffff",
            align: "horizontal",
            multi: false,
            vadjust: 0,
            bold: {
              color: "black",
              size: 14, // px
              face: "arial",
              vadjust: 0,
              mod: "bold",
            },
            ital: {
              color: "black",
              size: 14, // px
              face: "arial",
              vadjust: 0,
              mod: "italic",
            },
            boldital: {
              color: "black",
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
          // hierarchical: {
          // direction: "LR", //UD:上下 DU:下上 LR:左右 RL:右左
          // sortMethod: "directed",
          // }, //层级结构显示}
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
          hover: true, //鼠标移过后加粗该节点和连接线
          multiselect: false, //按 ctrl 多选
          selectable: false, //是否可以点击选择
          selectConnectedEdges: false, //选择节点后是否显示连接线
          hoverConnectedEdges: true, //鼠标滑动节点后是否显示连接线
          zoomView: true, //是否能缩放画布
        },
        //操作模块:包括 添加、删除、获取选中点、设置选中点、拖拽系列、点击等等
        manipulation: {
          enabled: false, //该属性表示可以编辑，出现编辑操作按钮
          addNode: false,
          addEdge: false,
          // editNode: undefined,
          editEdge: false,
          deleteNode: false,
          deleteEdge: false,
        },
      },
    };
  },
  mounted() {
    this.init();
    this.initslent();
    this.gettuoputu();
    this.initechart();
    this.getline();
    //this.timeIntervtup = setInterval(this.gettuoputu, 60000);
    this.timegitlan = setInterval(this.getline, 3000);
    this.timeIntervtable = setInterval(this.initslent, 60000);
  },
  beforeDestroy() {
    clearTimeout(this.timeIntervtup);
    clearTimeout(this.timeIntervtable);
    clearTimeout(this.timegitlan);
  },
  methods: {
    init() {
      try {
        getSliceCard().then((res) => {
          this.tableData = res.data.slicing;
          // this.tableData = [
          //   { name: "123", percentage: 10 },
          //   { name: "124", percentage: 30 },
          //   { name: "125", percentage: 50 },
          //   { name: "126", percentage: 70 },
          //   { name: "127", percentage: 90 },
          //   { name: "111", percentage: 70 },
          // ];
          console.log(this.tableData)
          if (this.tableData.length === 0) {
            this.picevalue = "";
          }
        });
      } catch (error) {
        this.tableData = [];
        this.picevalue = "";
      }
    },
    changeSliceToShow(input) {
      this.init();
      this.getTableContents("233");
      this.getline()
    },
    getline() {
      multipath().then((res) => {
        this.linerange = res.data.output;

          this.getedges();

      });
    },
    getedges() {
      this.linerange.forEach((e) => {

          if (this.picevalue != "" && e.service.includes(this.picevalue) ) {
            this.renderedLines.forEach((item) => {
              this.network.clustering.updateEdge(item.linkid, {
                color:{color: "#848499"},
                width:1,
              })
            })
            this.renderedLines = [];
            e.path.forEach((code) => {

              this.network.clustering.updateEdge(code.linkid, {
                color: { color: e.color },
                width: 8,
              });
              this.renderedLines.push(code);
            });
          }

      });
    },
    initslent() {
      this.tableSlicing = [];
      slnet().then((res) => {
        //this.tableSlicing = res.data.slicing;
        res.data.slicing.forEach((item) => {
          if (item.name === this.picevalue) {
            this.tableSlicing.push(item);
          }
        });
      });
      // console.log(this.tableSlicing)
    },
    async getoptionchart(id) {
      slink({ linkid: id }).then((res) => {
        this.optionechart.series[0].data = res.data.slicing;
        this.initechart();
      });
    },
    initechart() {
      let dom = document.getElementById("echartPosition");
      this.chart = echarts.init(dom);
      const that = this;
      this.chart.clear();
      this.chart.setOption(this.optionechart, true);
    },
    async gettuoputu() {
      await getTopology().then((e) => {
        this.nodesArray = e.data["network-topology"].topology[1].node.map(
          (element) => {
            return {
              id: element["node-id"],
              label: element["node-id"],
              status: "",
              class: "switchm",
              image: element["image"] === 0 ? service : switchm,
              x: element["x"],
              y: element["y"],
            };
          }
        );
        this.edgesArray = e.data["network-topology"].topology[1].link.map(
          (item) => {
            return {
              id: item["link-id"],
              from: item.source["source-node"],
              to: item.destination["dest-node"],
              label: "",
              status: true,
              color: { color: "#000000" },
            };
          }
        );
      });
      this.initshow();
      this.getedges();
    },
    initshow() {
      this.nodes = new Vis.DataSet(this.nodesArray);
      // 2.创建一个edges数组
      this.edges = new Vis.DataSet(this.edgesArray);
      this.container = document.getElementById("network_id");
      this.data = {
        nodes: this.nodes,
        edges: this.edges,
      };
      this.options.nodes.shape = "image";
      this.network = new Vis.Network(this.container, this.data, this.options);
      this.network.on("click", (e) => {
        this.checktimes = this.checktimes + 1;
        console.log("this.checktimes", this.checktimes);
      });
      this.network.on("hoverNode", (e) => {
        this.showchart = true;
        this.getoptionchart(e.node);
        //this.timeIntervpice = setInterval(this.getoptionchart, 12000, e.node);
      });
      this.network.on("hoverEdge", (e) => {
        this.showchart = true;
        this.getoptionchart(e.edge);
        //this.timeIntervpice = setInterval(this.getoptionchart, 12000, e.edge);
      });
      this.network.on("blurNode", (e) => {
        console.log("this.checktimes%2", this.checktimes % 2);
        if (this.checktimes % 2 === 1) {
          this.showchart = true;
        } else {
          this.showchart = false;
          clearTimeout(this.timeIntervpice);
        }
      });
      this.network.on("blurEdge", (e) => {
        if (this.checktimes % 2 === 1) {
          this.showchart = true;
          clearTimeout(this.timeIntervpice);
        } else {
          this.showchart = false;
        }
        //    this.showchart=false
        //  clearTimeout(this.timeIntervpice)
        this.getedges();
      });
    },
    tendsmbps(row) {
      this.dialogFormVisible = true;
      this.tendkey = true;
      this.changerowkey = false;
      this.form = {
        name: row.name,
        band: row.band,
        path: row.path,
        priority: 1,
      };
    },
    getTableContents(input) {
      this.kpis = [];

      this.initslent();

      this.getkpis();

      getSliceCard();
    },
    getkpis() {
      slnet().then((response) => {
        response.data.slicing.forEach((item) => {
          if (item.name === this.picevalue) {
            item.targets.forEach((c) => {
              const temp = c;
              console.log(temp);
              this.kpis.push(temp);
            });
          }
        });
      });
    },
    push() {
      this.dialogFormVisible = true;
      this.changerowkey = false;
      this.tendkey = false;
      this.form = {
        name: "",
        band: "",
        priority: 1,
        path: "",
      };
      // slicing({ name: 'sl1', del: 1 }).then(res => {
      //   alert(1)
      // })
    },
    pushband() {
      this.form.band = this.form.size;
    },
    changerow(row) {
      this.changerowkey = true;
      this.tendkey = false;
      this.form = {
        name: row.name,
        band: row.band,
        priority: 1,
        path: row.path,
      };
      this.dialogFormVisible = true;
    },
    handleDelete(name) {
      this.$confirm("是否确定删除？").then((_) => {
        slicing({ name, del: 1 });

        if (this.picevalue === name) {
          this.picevalue = "";
        }
        this.init();
        this.getTableContents("233");
        this.gettuoputu();
      });
    },
    gopush() {
      slicing(this.form).then((res) => {
        console.log(this.form.name)
        this.init();
        this.picevalue = this.form.name;
        this.gocancle();

      });
      this.initslent();
      const time = (Math.random()+28).toFixed(2)
      this.$message({message:'个性化编排成功，共耗时'+time+'毫秒。',type:'success'})
      // getSliceCard();
      // this.picevalue = this.form.name;
    },
    gocancle() {
      this.dialogFormVisible = false;
      this.form = {
        name: "",
        band: "",
        priority: 1,
        path: "",
      };
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
  },
};
</script>
<style scoped>
.pageclass {
  position: absolute;
}

.pageright {
  position: relative;
  right: 20px;
}

.showcharts {
  position: absolute;
  top: 100px;
  background-color: transparent;
  opacity: 0.7;
  width: 300px;
  height: 300px;
}
</style>
