<template>

  <div style="padding: 5px;">
    <div style="display: flex; flex-direction: column; align-items: center;">
      <el-table
        ref="filterTable"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="date"
          label="Date"
          sortable
          width="180"
          column-key="date"
          :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
          :filter-method="filterHandler"
        />
        <el-table-column
          prop="name"
          label="Name"
          width="180"
        />
        <el-table-column
          prop="address"
          label="Address"
          :formatter="formatter"
        />
        <el-table-column
          prop="tag"
          label="Tag"
          width="100"
          :filters="[{ text: 'Home', value: 'Home' }, { text: 'Office', value: 'Office' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.tag === 'Home' ? 'primary' : 'success'"
              disable-transitions
            >{{ scope.row.tag }}</el-tag>
          </template>
        </el-table-column>
      </el-table><el-pagination
        background
        :page-size="50"
        layout="prev, pager, next"
        :total="1500"
        style="margin-top: 24px;display: flex; justify-content: center;"
      /></div>
  </div>

</template>
<script>
export default {
  name: 'Nodes',
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: 'Home'
      }, {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: 'Office'
      }, {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: 'Home'
      }, {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        tag: 'Office'
      }],
      filter_type: [{ text: '交换机', value: 'switch' }]
    }
  }
}

</script>
