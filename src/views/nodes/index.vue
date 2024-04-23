<template>
  <div>
    <div class="search-box" style="margin-left: 1%;width: 98%">
      <a>节点名称:</a>
      <el-input v-model="searchText" placeholder="请输入搜索内容" style="margin-left: 10px;width: 200px;box-shadow: 0 0 5px rgba(0,0,0,0.2); ">
        <el-button slot="append" icon="el-icon-search" @click=" handleNodeSearch" />
      </el-input>
      <el-button style="margin-left: 10px" @click="resetSearch">重置</el-button>
    </div>

    <div style="display: flex; flex-direction: column; align-items: center;">
      <el-table :key="change" :data="tableData" border style="margin-left: 16px;width: 100%" :header-cell-style="{fontSize: '20px', color: 'black'}">
        <el-table-column prop="name" label="节点名称">

          <template v-slot="scope">
            <a class="table-link" @click="showDetails(scope.row)">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="mac" label="MAC地址" />
        <el-table-column prop="state" label="设备状态" />
        <el-table-column prop="sub" label="所属子网" />
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalItems"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      /></div>

    <el-dialog :visible.sync="dialogVisible" width="80%" custom-class="my-dialog">
      <template slot="title">
        <div style="font-size: 24px;text-align: center;">节点详细信息</div>
      </template>
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="font-size: 20px;">
          <span>节点名称:{{ detailRow.name }}</span>
        </div>

        <div class="myDiv">
          <div>节点类型: {{ detailRow.type }}</div>
          <div>节点MAC地址: {{ detailRow.mac }}</div>
          <div>节点状态: {{ detailRow.state }}</div>
          <div>节点所属子网: {{ detailRow.sub }}</div>
        </div>

      </el-card>
    </el-dialog>
  </div>
</template>

<script>

import { get_node_info_table, get_node_info_search } from '@/api/prototype.js'
export default {
  name: 'Nodes',
  data() {
    return {
      totalItems: 1500,
      currentPage: 1,
      pageSize: 30,
      change: true,
      // tableData: [],
      tableData: [
      ],
      // Array.from({ length: 1500 }, (v, k) => ({ name: k, type: k, mac: k, state: k, sub: k })),
      searchText: '',
      searchState: '',
      dialogVisible: false, // 控制对话框显示隐藏
      detailRow: {} // 存储当前选中的行的数据
    }
  },
  computed: {

  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var tmp = {
        page: this.currentPage
      }
      get_node_info_table(tmp).then((response) => {
        this.tableData = response.data
        this.change = !this.change
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleNodeSearch() {
      var tmp = {
        name: this.searchText
      }
      get_node_info_search(tmp).then((response) => {
        this.tableData = response.data
        this.totalItems = this.tableData.length
      })
    },
    showDetails(row) {
      this.detailRow = row // 设置当前行的数据
      this.dialogVisible = true // 打开对话框
    },
    resetSearch() {
      this.searchText = ''
      this.totalItems = 1500
      this.currentPage = 1
      this.fetchData()
    }

  }
}
</script>

<style lang="scss">
.search-box {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  box-shadow: 0 0 5px rgba(0,0,0,0.2); /* 添加阴影效果 */
}
.table-link {
  cursor: pointer;
  color: #42b983;
}
.table-link:hover {
  text-decoration: underline;
}
.my-dialog .el-dialog__body {
  min-height: 500px;
}
.myDiv {
  line-height: 5;  /* 调整行间距 */
  font-size: 20px;   /* 调整字体大小 */
}
</style>
<style scoped>
.el-pagination {

  margin-top: 24px;
}

/deep/ .el-pager li,
/deep/ .el-pagination__total,
/deep/ .el-pagination span,
/deep/ .el-pagination input{
  font-size:16px;
}
</style>
