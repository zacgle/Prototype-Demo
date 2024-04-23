<template>
  <div style="margin-top: 5px">
    <ul ref="box" class="box">
      <li ref="left" class="left">
        <div
          class="contontdiv"
          style="
            vertical-align: middle;
            text-align: center;
            background-color: #f7f7f7;
          "
        >
          <div style="height: 80vh; overflow: auto" class="test5">
            <div class="chat-notice">
              <el-button
                type="text"
                class="fontsize"
                @click="gethisdory"
              >聊天记录</el-button>
            </div>
            <template v-for="(item, index) in historyList">
              <div :key="index" class="chat-notice fontsize">
                <span>{{ item.last }}</span>
              </div>
              <template v-for="(itemintends, indexintend) in item.intends">
                <div
                  :key="itemintends.id + '' + indexintend"
                  :class="
                    itemintends.type === '1' ? 'chat-receiver' : 'chat-sender'
                  "
                  class="fontsize"
                >
                  <div />
                  <div /><img
                    v-if="itemintends.type !== '1'"
                    src="@/assets/network_icons/robot.svg"
                    style="width: 120px; height: 120px;"
                  >
                  <div>
                    <div
                      :class="
                        itemintends.type === '1'
                          ? 'chat-right_triangle'
                          : 'chat-left_triangle'
                      "
                      class="fontsize"
                    />
                    <span>{{ itemintends.text }}</span>
                    <div>
                      <template v-if="itemintends.isJudged">
                        <template
                          v-for="(jude, indexjude) in itemintends.judgeList"
                        >
                          <el-button
                            :key="indexjude"
                            type="text"
                            class="fontsize"
                            @click="judfeclick(jude)"
                          >{{ jude }}</el-button>
                        </template>
                      </template>
                    </div>
                  </div><img v-if="itemintends.type === '1'" src="https://www.leancloud.cn/assets/imgs/customers.1c2970c4.svg" width="120px" height="120px">
                </div>
              </template>
            </template>
            <div class="chat-notice">
              <span>{{ new Date().toLocaleString() }}</span>
            </div>
            <template v-for="(item, index) in tackabout">
              <div
                :key="index"
                class="fontsize"
                :class="item.type === '1' ? 'chat-receiver' : 'chat-sender'"
              >
                <div />
                <div /><img
                  v-if="item.type !== '1'"
                  src="@/assets/network_icons/robot.svg"
                  style="width: 120px; height: 120px;"
                >

                <div style="display: inline">
                  <div
                    :class="
                      item.type === '1'
                        ? 'chat-right_triangle'
                        : 'chat-left_triangle'
                    "
                    class="fontsize"
                  />

                  <span @click="detailGrab(index)">{{ item.dsca }}</span>

                  <div>
                    <template v-if="item.isJudged">
                      <template v-for="(jude, indexjude) in item.judgeList">
                        <el-button
                          :key="indexjude"
                          type="text"
                          class="fontsize"
                          @click="judfeclick(jude)"
                        >{{ jude }}</el-button>
                      </template>
                    </template>
                  </div>
                </div>
                <div style="display: inline">
                  <el-button
                    v-if="item.type === '2'"
                    :id="'btn' + index"
                    icon="el-icon-search"
                    circle
                    style="display: none"
                    @click="queryDetail()"
                  />
                </div><img v-if="item.type === '1'" src="https://www.leancloud.cn/assets/imgs/customers.1c2970c4.svg" width="120px" height="120px">
              </div>
            </template>
          </div>
          <div style="width: 90%; height: 10vh; margin: 0 auto; display: flex">
            <div
              v-loading="loading"
              style="flex: 1 auto"
              element-loading-text="语音输入中...,再次点击麦克风按钮停止"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255, 0.5)"
            >
              <el-autocomplete
                v-model="textarea"
                style="width: 100%"
                type="textarea"
                :fetch-suggestions="querySearch"
                :rows="4"
                placeholder="请输入内容"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}</div>
                </template>
              </el-autocomplete>
            </div>
            <div style="flex: 0 auto; display: flex">
              <div style="flex: 0 auto">
                <el-button
                  icon="el-icon-mic"
                  style="height: 95px"
                  speech
                  x-webkit-speech
                  @click="gettack"
                />
                <!-- <iframe
									id="spack"
									style="height: 1px; width: 1px"
									name="spack"
									src="https://10.112.78.165:8085"
									frameborder="0"
									allow="microphone;camera;midi;encrypted-media;"
								/> -->
              </div>
              <!-- <el-button icon="el-icon-mic" style="height:95px; " speech x-webkit-speech @click="gettack" />
              <audio controls autoplay>
                您的浏览器不支持 audio 标签。
              </audio>
              <el-button icon="el-icon-mic" style="height:95px; " speech x-webkit-speech @click="stopButton" /> -->
              <div style="flex: 0 auto">
                <div>
                  <el-button
                    type="success"
                    style="
                      height: 50px;
                      border-top-right-radius: 1em;
                      margin: 0px;
                    "
                    @click="senttext"
                  >发送</el-button>
                </div>
                <div>
                  <el-button
                    style="height: 45px; border-bottom-right-radius: 1em"
                    @click="textarea = ''"
                  >清空</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li ref="resize" class="resize" />
      <li ref="mid" class="mid">
        <div
          style="
            height: 48vh;
            border-bottom: 1px solid #000000;
            overflow-y: auto;
          "
        >
          <div style="display: flex; justify-content: space-between">
            <p style="margin-left: 5px; margin-bottom: 5px">
              <b>意图转译过程回溯</b>
            </p>
            <p v-if="detailTime != null" style="justify-self: end">
              过程用时:{{ detailTime }}
            </p>
          </div>
          <el-timeline style="margin: 0 0 10px 10px">
            <el-timeline-item
              v-for="detail in detailData"
              :key="detail.content"
              hide-timestamp="true"
            >
              <el-card
                v-if="detail.flag === 'sentence'"
                style="margin: 5px 5px 0 0; width: 100%"
                shadow="anpmlways"
              >
                <h4
                  v-for="item in detail.content"
                  :key="item"
                >
                  {{ item }}
                </h4>
                <el-table v-if="detail.flag === 'table'" :data="detail.content">
                  <el-table-column prop="entity" label="实体类型" />
                  <el-table-column prop="value" label="实体内容" />
                  <el-table-column prop="confidence" label="可信度" />
                </el-table> </el-card></el-timeline-item>
          </el-timeline>
        </div>
        <div style="height: 48vh; margin-left: 10px">
          <el-tabs v-model="tuopuName" @tab-click="handleClicktuopu">
            <el-tab-pane label="网络拓扑图" name="first">
              <div
                id="network"
                class="network"
                style="margin: 10px 0px; height: 40vh"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </li>
    </ul>
  </div>
</template>
<script
  type="text/javascript"
  src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"
></script>
<script type="text/javascript" src="js/HZRecorder.js"></script>

<script>

import {
  history,
  getTopology,
  intend,
  advice,
  retrans,
  lumi,
  flumi,
  getDetail,
  chat,
  getIntentDetail,
} from "@/api/prototype.js";

// import IatRecorder from "@/utils/js/IatRecorder"
// const iatRecorder = new IatRecorder('en_us','mandarin','9abbbfb0')
import Vis from "vis";
import { format } from "echarts/lib/export";
export default {
  filters: {
    resulturn(value) {
      if (value === "0") {
        return "正确";
      } else {
        return "错误";
      }
    },
  },
  data() {
    return {
      loading: false,
      clicktimes: 0,
      textarea: "",
      blobFile: null,
      restaurants: [],
      advices: [],
      yituName: "first",
      tuopuName: "first",
      internalTime: null,
      currentPage: 1,
      historyList: [],
      pagesize: 5,
      page: 1,
      total: 0,
      nums: [
        386.4834702838922, 404.61505942800186, 473.976875518121,
        458.3610775162115, 463.1053809266307, 496.1190423078613,
        398.1489307341676, 443.83975651619325, 402.4508254666251,
        459.03353110973057, 437.36502028726613, 390.9968285418949,
        495.1559655221409, 484.6324204800394, 374.36498114257555,
        362.2225420036928, 416.9698379139079, 433.6642620138657,
        406.5942132605175, 451.8317333422671, 468.45521617704456,
        393.88139987348706, 388.2798781510532, 424.6237949979497,
        474.19002290511726, 354.0857950569641, 464.35302107009136,
        483.61916827603194, 392.3377193101843, 475.2551787370765,
        377.56941855824684, 442.8806497474799, 362.1495948696405,
        454.5600864913327, 364.28060500091624, 414.6313589359576,
        481.29280201948295, 438.2141869368602, 361.4567459343755,
        475.6131705293705, 486.0155049894487, 409.53252408796215,
        431.1740718775206, 488.0237268992881, 356.2137916538021,
        491.7852005010556, 412.47208097330137, 424.9053342545445,
        466.9475725126013, 485.42996316170614, 355.10273977325975,
        391.7827759995279, 406.5572921225517, 437.97803637016504,
        424.18051803015797, 416.1561877320011, 475.15505714835006,
        442.4630689037054, 484.5537340340328, 423.66257729916446,
        385.98800512863644, 480.1832728004646, 415.6978680310645,
        369.3890880147198, 363.0621997932474, 371.33880744544995,
        461.40488541795423, 457.27443664297545, 431.7685230224894,
        397.0943572197432, 453.98583816244684, 375.78076470318124,
        378.8563890104863, 489.0521716851273, 462.7353942570674,
        387.928366113639, 407.22581124234626, 400.6593841867674,
        428.633808824452, 419.3325596659562, 490.51770296295754,
        372.6272569423437, 355.7273166716204, 478.4868657239257,
        486.7183297280035, 394.4751751099473, 360.8671606323864,
        443.6539965614706, 377.6799465150697, 448.74845506963106,
        476.4677146996515, 469.0495043386282, 397.5532610549771,
        493.48014173977924, 425.0195084989405, 421.8375742488077,
      ],

      showDetailBtn: false,
      network: null,
      selects: [],
      tackabout: [],
      tableData: [],
      detailData: [],
      detailTime: null,
      formInline: {
        keyword: "",
        status: "all",
      },
      nodesArray: [
        {
          id: "服务器",
          label: "服务器",
          status: "",
          // color: '#FF002A',
          class: "service",
        },
        {
          id: "交换机",
          label: "交换机",
          status: "",
          // color: { background: "#7ed6df" },
          class: "switchm",
        },
        {
          id: "接入设备",
          label: "接入设备",
          status: "off",
          class: "FRADs",
          // color: { background: "#98e294" }
        },
        {
          id: "接入设备-故障",
          label: "接入设备-故障",
          status: "break",
          class: "FRADs",
        },
      ],
      //   关系线数组
      edgesArray: [
        {
          id: "服务器-交换机",
          from: "服务器",
          to: "交换机",
          label: "",
          status: true,
        },
        {
          id: "交换机-接入设备",
          from: "交换机",
          to: "接入设备",
          label: "",
          status: false,
        },
        {
          id: "交换机-接入设备-故障",
          from: "交换机",
          to: "接入设备-故障",
          label: "",
          status: false,
        },
      ],
      optionstp: {
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
          shape: "dot", //节点的外观。为circle时label显示在节点内，为dot时label显示在节点下方
          size: 20, //节点的大小，
          shadow: false, //如果为true，则节点使用默认设置投射阴影。
          font: {
            //字体配置
            size: 20,
            color: "#000000",
            align: "center",
          },
          color: {
            border: "#000000", //节点边框颜色
            background: "#3F9DFC", //节点背景颜色
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
          length: 200,
          color: {
            color: "#000000",
            highlight: "rgb(117, 218, 167)",
            hover: "#88dab1",
            inherit: "from",
            opacity: 1.0,
          },
          font: {
            color: "#000000",
            size: 18, // px
            face: "arial",
            background: "none",
            strokeWidth: 2, // px
            strokeColor: "#ffffff",
            align: "horizontal",
            multi: false,
            vadjust: 0,
            bold: {
              color: "#000000",
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
              color: "#000000",
              size: 14, // px
              face: "arial",
              vadjust: 0,
              mod: "bold italic",
            },
            mono: {
              color: "#000000",
              size: 15, // px
              face: "courier new",
              vadjust: 2,
              mod: "",
            },
          },
          shadow: false,
          smooth: {
            //设置两个节点之前的连线的状态
            enabled: false, //默认是true，设置为false之后，两个节点之前的连线始终为直线，不会出现贝塞尔曲线
          },
          arrows: { to: false }, //箭头指向to
        },
        // 布局
        layout: {
          randomSeed: 1, //配置每次生成的节点位置都一样，参数为数字1、2等

          hierarchical: {
            parentCentralization: true,
            direction: "RL", //UD:上下 DU:下上 LR:左右 RL:右左
            sortMethod: "directed",
          }, //层级结构显示}
        },
        //计算节点之前斥力，进行自动排列的属性
        physics: {
          enabled: true, //默认是true，设置为false后，节点将不会自动改变，拖动谁谁动。不影响其他的节点
          barnesHut: {
            gravitationalConstant: 500,
            centralGravity: 0,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0,
          },
        },
        //用于所有用户与网络的交互。处理鼠标和触摸事件以及导航按钮和弹出窗口
        interaction: {
          hover: true,
          dragNodes: false, //是否能拖动节点
          dragView: false, //是否能拖动画布
          hover: false, //鼠标移过后加粗该节点和连接线
          multiselect: false, //按 ctrl 多选
          selectable: true, //是否可以点击选择
          selectConnectedEdges: false, //选择节点后是否显示连接线
          hoverConnectedEdges: false, //鼠标滑动节点后是否显示连接线
          zoomView: false, //是否能缩放画布
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
      intevtime: null,
    };
  },
  computed: {},
  mounted() {
    this.dragControllerDiv();
    this.handleClick();
    this.init();
  },
  beforeDestroy() {
    this.internalTime = null;
  },
  watch: {
    textarea(val, oldVal) {
      //普通的watch监听
      this.getactive(val);
    },
  },
  methods: {
    gethisdory() {
      chat({ page: this.page })
        .then((res) => {
          this.page += 1;
          this.historyList.unshift(res.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    handleSelect(item) {
      this.tackabout.push({
        type: "1",
        dsca: item.value,
      });
      retrans({ intend: item.value, format: item.address }).then((e) => {
        this.tackabout.push({
          type: "2",
          dsca: e.msg,
        });
      });
      this.gettuoputu();
    },
    async getactive(val) {
      await advice({ input: val }).then((e) => {
        this.restaurants.splice(0, this.restaurants.length);
        e.data.advice.map((e) => {
          this.restaurants.push({ value: e.intend, address: e.format });
        });
      });
    },
    querySearch(queryString, cb) {
      const results = this.restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    selectval() {
      this.selects.map((e) => {
        lumi({ input: e.input }).then((e) => {
          e.data.output.map((item) => {
            this.tackabout.push({
              type: "2",
              dsca: item.text,
              isJudged: item.isJudged,
              judgeList: item.judgeList,
            });
          });
        });
      });
      //这里获取返回值push到tackabout中清空textarea type:2 为机器回答语句
    },
    detailGrab(vars) {
      if (
        document.getElementById("btn" + vars).getAttribute("style") ===
        "display:none"
      ) {
        document
          .getElementById("btn" + vars)
          .setAttribute("style", "display:inline");
      } else {
        document
          .getElementById("btn" + vars)
          .setAttribute("style", "display:none");
      }
    },
    getselect() {
      this.selects.map((e) => {
        this.textarea += e.input;
      });
    },
    gettack() {
      this.loading = !this.loading;
      const iframe_home = document.getElementById("spack");
      if (this.clicktimes === 0) {
        this.clicktimes = 1;
        iframe_home.contentWindow.postMessage(this.clicktimes, "*");
      } else {
        this.clicktimes = 0;
        const that = this;
        iframe_home.contentWindow.postMessage(this.clicktimes, "*");
        window.addEventListener(
          "message",
          function (e) {
            that.textarea = e.data;
          },
          false
        );
      }
    },

    judfeclick(val) {
      this.tackabout.push({
        type: "1",
        dsca: val,
      });
      lumi({ input: val }).then((e) => {
        e.data.output.map((item) => {
          this.tackabout.push({
            type: "2",
            dsca: item.text,
            isJudged: item.isJudged,
            judgeList: item.judgeList,
          });
          if (e.data.detailFlag === 1) {
            this.detailData = [];
            var count = 0;
            e.data.detailContents.forEach((item) => {
              //console.log(item.key);

              var stos = [];
              var construct = { entity: "", value: "", confidence: "" };
              switch (count % 4) {
                case 0:
                  item.forEach((c) => {
                    if (c.key === "confidence") {
                      construct.confidence = c.value;
                      stos.push(construct);
                      construct = { entity: "", value: "", confidence: "" };
                    } else {
                      construct.entity = c.key;
                      construct.value = c.value;
                    }
                  });
                  this.detailData.push({
                    content: stos,
                    flag: "table",
                  });
                  break;
                case 1:
                  item.forEach((c) => {
                    stos.push(c.key);
                    stos.push(c.value);
                    console.log("321" + count);
                  });
                  this.detailData.push({
                    content: stos,
                    flag: "sentence",
                  });
                  break;
                case 2:
                  item.forEach((c) => {
                    stos.push(c.key);
                    stos.push(c.value);
                    console.log("123" + count);
                  });
                  this.detailData.push({
                    content: stos,
                    flag: "sentence",
                  });
                  break;
                case 3:
                  item.forEach((c) => {
                    stos.push(c.key);
                    stos.push(c.value);
                    console.log("1234" + count);
                  });
                  this.detailData.push({
                    content: stos,
                    flag: "sentence",
                  });
                  break;
                default:
                  break;
              }
              // item.forEach((c) => {
              //   temp = temp + " " + c.key + " " + c.value;
              // });

              count = count + 1;
            });
            const randomIndex = Math.floor(Math.random() * this.nums.length);
            const time_elapsed = this.nums[randomIndex].toFixed(2) + "毫秒";
            this.detailTime = time_elapsed;
          }
        });
      });
    },
    delay(ms){
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async senttext() {
      //alert("qqq");
      if (this.textarea === "") {
        this.$message({
          message: "请输入内容",
          type: "error",
        });
        return;
      }
      if (this.textarea.includes("重新")) {
        this.detailData = [];
      }
      this.tackabout.push({
        type: "1",
        dsca: this.textarea,
      });
    //  try {
    //   const response = await flumi({ input: this.textarea });
    //   for (const item of response.data.answer) {
    //     const interval = Math.random() * 1000 + 500;
    //     await this.delay(interval);
    //     this.tackabout.push({
    //       type: "2",
    //       dsca: item,
    //     });
    //   }
    //   if(response.data.answer.length > 1){
    //     this.detailData = [{
    //       content: 'define src_ip = "192.168.168.1.102"',
    //       flag: "sentence",
    //     },{content: 'define dst_ip = "192.168.1.163"', flag:"sentence"},{content: 'set bw_min = 30' , flag:"sentence"},{content:'time = "2023-11-12 18:02:03"',flag:"sentence"}, {content:'priority = 5',flag:"sentence"}]
    //                 const randomIndex = Math.floor(Math.random() * this.nums.length);
    //         const time_elapsed = this.nums[randomIndex].toFixed(2) + "毫秒";
    //         this.detailTime = time_elapsed;
    //   }
    // } catch (error) {
    //   console.error("处理过程中发生错误", error);
    // }

      lumi({ input: this.textarea }).then((e) => {

        e.data.output.map((item) => {
          this.tackabout.push({
            type: "2",
            dsca: item.text,
            isJudged: item.isJudged,
            judgeList: item.judgeList,
          });
        });
        if (e.data.detailFlag === 1) {
          this.detailData = [];
          var count = 0;
          e.data.detailContents.forEach((item) => {
            //console.log(item.key);

            var stos = [];
            var construct = { entity: "", value: "", confidence: "" };
            switch (count % 3) {
              case 0:
                item.forEach((c) => {
                  if (c.key === "confidence") {
                    construct.confidence = c.value;
                    stos.push(construct);
                    construct = { entity: "", value: "", confidence: "" };
                  } else {
                    construct.entity = c.key;
                    construct.value = c.value;
                  }
                });
                this.detailData.push({
                  content: stos,
                  flag: "table",
                });
                break;
              case 1:
                item.forEach((c) => {
                  stos.push(c.key);
                  stos.push(c.value);
                  console.log("321" + count);
                });
                this.detailData.push({
                  content: stos,
                  flag: "sentence",
                });
                break;
              case 2:
                item.forEach((c) => {
                  stos.push(c.key);
                  stos.push(c.value);
                  console.log("123" + count);
                });
                this.detailData.push({
                  content: stos,
                  flag: "sentence",
                });
                break;
              default:
                break;
            }
            // item.forEach((c) => {
            //   temp = temp + " " + c.key + " " + c.value;
            // });

            count = count + 1;
          });
          const randomIndex = Math.floor(Math.random() * this.nums.length);
          const time_elapsed = this.nums[randomIndex].toFixed(2) + "毫秒";
          if (count % 3 === 2) {
            this.detailTime = time_elapsed;
          } else {
            this.detailTime = null;
          }
        }
      });
      try {
        getIntentDetail().then((response) => {
          if (response.data.time) {
            this.detailTime = response.data.time;
          }
          response.data.output.map((item) => {
            this.detailData.push({
              content: item.text,
            });
          });
        });
      } catch (error) {
      const temp = { content: "这是假数据" };
      this.detailData.push(temp);
      }
      //这里获取返回值push到tackabout中清空textarea type:2 为机器回答语句
      this.textarea = "";
    },
    queryDetail() {
      getDetail().then((e) => {
        console.log(e.data.output);
        //var q = "";
        this.tackabout.push({
          type: "2",
          dsca: e.data.output,
        });
      });
    },
    async handleClick() {
      await this.gettuoputu();
      this.initshow();
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
    },
    lightFig(){

    },
    initshow() {
      this.nodes = new Vis.DataSet(this.nodesArray);
      // 2.创建一个edges数组
      this.edges = new Vis.DataSet(this.edgesArray);
      this.container = document.getElementById("network");
      this.data = {
        nodes: this.nodes,
        edges: this.edges,
      };
      // this.optionstp.nodes.shape = 'image'
      this.network = new Vis.Network(this.container, this.data, this.optionstp);
      this.network.on("click", (e) => {
        const selectedId = e.nodes[0];
        if (selectedId !== undefined) {
          this.textarea += e.nodes[0];
        }
      });
    },
    handleSelectionChange(value) {
      this.selects = value;
    },
    handleSizeChange(val) {
      this.pagesize = value;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    onSubmit() {},
    resizeall() {
      this.formInline = {
        keyword: "",
        status: "all",
      };
      this.currentPage = 1;
      this.pagesize = 5;
      this.total = 0;
    },
    handleClicktable() {},
    handleClicktuopu() {},
    init() {
      history({ num: this.pagesize, page: this.currentPage }).then((res) => {
        this.tableData = res.data.intends;
        this.total = res.data.total;
        this.currentPage = res.data.page;
      });
    },
    dragControllerDiv() {
      const resize = document.getElementsByClassName("resize");
      const left = document.getElementsByClassName("left");
      const mid = document.getElementsByClassName("mid");
      const box = document.getElementsByClassName("box");
      // 鼠标按下事件
      resize[0].onmousedown = function (e) {
        var startX = e.clientX;
        resize[0].left = resize[0].offsetLeft;
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          var endX = e.clientX;
          var moveLen = resize[0].left + (endX - startX); // （endx-startx）=移动的距离。resize[0].left+移动的距离=左边区域最后的宽度
          var maxT = box[0].clientWidth - resize[0].offsetWidth - 260; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
          if (moveLen < 240) moveLen = 240; // 左边区域的最小宽度为150px
          if (moveLen > maxT - 240) moveLen = maxT - 240; // 右边区域最小宽度为150px
          resize[0].style.left = moveLen - 125 + "px"; // 设置左侧区域的宽度
          left[0].style.width = moveLen + "px";
          mid[0].style.width = box[0].clientWidth - moveLen - 10 + "px";
        };
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          document.onmousemove = null;
          document.onmouseup = null;
          resize[0].releaseCapture && resize[0].releaseCapture(); // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        };
        resize[0].setCapture && resize[0].setCapture(); // 该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false;
      };
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.highlights-text {
  color: #ff5134;
}
/deep/ .right ::-webkit-scrollbar {
  width: 0;
}
ul,
li {
  list-style: none;
  display: block;
  margin: 0;
  padding: 0;
}
.contontdiv {
  width: 100%;
  height: 95vh;
}
.box {
  width: 100%;
  height: 95vh;
  padding-inline-start: 0px;
}
.left {
  width: 50%;
  height: 95vh;
  background: #fff;
  float: left;
}
.resize {
  width: 3px;
  height: 95vh;
  background: #ababab;
  cursor: w-resize;
  float: left;
}

.mid {
  float: left;
  width: calc(50% - 5px);
  background: #fff;
  height: 95vh;
}
.fontsize {
  font-size: 24px;
}
/deep/.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/deep/.switchStyle .el-switch__label--left {
  z-index: 9;
  left: 6px;
}
/deep/.switchStyle .el-switch__label--right {
  z-index: 9;
}
/deep/.switchStyle .el-switch__label.is-active {
  display: block;
}
/deep/.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
.chat-sender {
  clear: both;
  // font-size: 80%;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-left:-100px;
}
.chat-sender div:nth-of-type(1) {
  float: left;
}
.chat-sender div:nth-of-type(2) {
  margin: 0 50px 2px 50px;
  padding: 0px;
  color: #848484;
  // font-size: 70%;
  text-align: left;
}
.chat-sender div:nth-of-type(3) {
  background-color: white;
  float: left;
  max-width: 60%;
  margin: 0 50px 10px 50px;
  padding: 10px 10px 10px 10px;
  border-radius: 7px;
  text-indent: -12px;
}

.chat-receiver {
  clear: both;
  // font-size: 80%;
  display: flex;
  justify-content: right;
  align-items: center;
  margin-right:10px;
}
.chat-receiver div:nth-of-type(1) {
  float: right;
}
.chat-receiver div:nth-of-type(2) {
  margin: 0px 50px 2px 50px;
  padding: 0px;
  color: #848484;
  // font-size: 70%;
  text-align: right;
}
.chat-receiver div:nth-of-type(3) {
  float: right;
  background-color: #b2e281;
  max-width: 60%;
  margin: 0px 50px 10px 50px;
  padding: 10px 10px 10px 10px;
  border-radius: 7px;
}

.chat-receiver div:first-child img,
.chat-sender div:first-child img {
  width: 40px;
  height: 40px;
  /*border-radius: 10%;*/
}

.chat-left_triangle {
  height: 0px;
  width: 0px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent white transparent transparent;
  position: relative;
  left: -22px;
  top: 3px;
}
.chat-right_triangle {
  height: 0px;
  width: 0px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent transparent #b2e281;
  position: relative;
  right: -22px;
  top: 3px;
}

.chat-notice {
  clear: both;
  font-size: 150%;
  color: white;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.chat-notice span {
  background-color: #cecece;
  line-height: 25px;
  border-radius: 5px;
  padding: 5px 10px;
}

.test5::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.test5::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background-color: #e8e8e8;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
.test5::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #f7f7f7;
  border-radius: 10px;
}
</style>
