<template>
  <div class="custom-tree-container">
    <div class="block">
      <h2>服务申请审核</h2>
      <br/>
      <br/>

      <div class="container">
        <div class="handle-box">
          <el-input v-model="query.name" placeholder="应用名称" class="handle-input mr10"
                    @keyup.enter.native="handleSearch"></el-input>
          <el-select v-model="query.state" placeholder="审核状态" class="handle-select mr10">
            <el-option key="0" label="待审核" value="0"></el-option>
            <el-option key="1" label="通过" value="1"></el-option>
            <el-option key="2" label="未通过" value="2"></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
        >
          <el-table-column type="index" label="ID" width="55" align="center"></el-table-column>
          <el-table-column prop="name" label="应用名称" align="center"></el-table-column>
          <el-table-column prop="serviceIdentification" label="应用标识" align="center"></el-table-column>
          <el-table-column prop="description" label="描述" align="center"></el-table-column>
          <el-table-column label="审核状态" width="220" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state=='0'"
                      :type="'error'"
              >待审核
              </el-tag>
              <el-tag v-else-if="scope.row.state=='1'"
                      :type="'success'"
              >通过
              </el-tag>
              <el-tag v-else
                      :type="'danger'"
              >未通过
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="gmtCreate" label="申请时间" width="220" align="center"></el-table-column>
          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.state==0||scope.row.state==2"
                type="text"
                icon="el-icon-edit"
                @click="handleAccept(scope.$index, scope.row)"
              >通过
              </el-button>
              <el-button
                v-if="scope.row.state==0||scope.row.state==1"
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleRefuse(scope.$index, scope.row)"
              >拒绝
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.currentPage"
            :page-size="query.size"
            :total="pageTotal"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>


    </div>
  </div>
</template>
<script>
  import {examineList, updateService} from '../../api/serviceExamine';
  import qs from '../../common/qs';

  export default {
    name: 'serviceExamine',
    data() {
      return {
        query: {
          name: '',
          currentPage: 1,
          size: 10
        },
        tableData: [],
        pageTotal: 0,
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        let para = JSON.stringify(this.query);
        examineList(this.query).then((res) => {
          this.tableData = res.data.records;
          this.pageTotal = res.data.total;
        });
      },
      // 触发搜索按钮
      handleSearch() {
        this.$set(this.query, 'currentPage', 1);
        this.getData();
      },
      // 分页导航
      handlePageChange(val) {
        this.$set(this.query, 'currentPage', val);
        this.getData();
      },
      // 通过审核
      // 通过审核
      handleAccept(index, row) {
        let para = {
          id: row.id,
          state: 1
        };
        para = JSON.stringify(para);
        updateService(para).then((res) => {
          if(res.code == 100) {
            this.$message.success(res.msg);
            this.getData();
          } else {
            this.$message.error(res.data);
            this.getData();
          }
        });
      },
      // 拒绝审核
      handleRefuse(index, row) {
        let para = {
          id: row.id,
          state: 2
        };
        para = JSON.stringify(para);
        updateService(para).then((res) => {
          if(res.code == 100) {
            this.$message.success(res.msg);
            this.getData();
          } else {
            this.$message.error(res.data);
            this.getData();
          }
        });
      }
    }
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 9px;
  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
</style>
