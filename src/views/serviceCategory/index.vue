<template>
<div class="custom-tree-container">
  <div class="block">
    <!--<el-switch-->
      <!--v-model="expand"-->
      <!--active-text="展开分类"-->
      <!--@change="changeSwitch()">-->
    <!--</el-switch>-->
    <h2>服务分类列表</h2>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <br />
    <br />

     <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm"  :model="dataTemp" autocomplete="new" label-position="left" label-width="80px" style="width:400px;margin-left: 50px;">
        <el-form-item label="服务分类名" prop="label">
          <el-input  v-model="dataTemp.label" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
         <el-button type="primary" @click="dialogStatus==='添加服务分类'?createData():updateData()">确认</el-button>
      </span>
     </el-dialog>
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      node-key="id"
      :default-expand-all=false
      :filter-node-method="filterNode"
      :expand-on-click-node="true"
      :highlight-current="true"
      ref="tree2">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="node.level < 3"
            type="text"
            size="mini"
            @click="() => handleCreate(data)">
            添加子分类
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() =>handleEdit(data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => handleRemove(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <div style="float: left;height: 40px">
    <el-input placeholder="添加服务分类" style="width:200px"  v-model="category" @keyup.enter.native="handleInsert()"></el-input>
    <el-button type="primary" @click="handleInsert()">确定</el-button>
    </div>
  </div>
</div>
</template>
<script>
  import { ListSeviceCategory } from "../../api/serviceCategory";
  import { update,create,remove,insert} from "../../api/serviceCategory";

  export default {
     watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {
        dataTemp:{
          id:undefined,
          label:'',
          level:undefined
        },
        dialogStatus:'',
        filterText: '',
        data:'',
        expand:true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogFormVisible:false,
        category:''
      }
    },
    created() {
      this.fecthServiceCategory()
    },
    methods: {
       handleEdit(row) {
         this.dialogStatus = '编辑服务分类'
         this.dataTemp.id = row.id
         this.dataTemp.label = row.label
         this.dialogFormVisible = true
       },
      updateData() {
         update(this.dataTemp).then(response =>{
           // 插入失败
           if(response.status!=10000){
             this.dialogFormVisible=false
             this.$message({
                type: 'error',
                message: '更新失败'
              })
           }else{
             ListSeviceCategory().then((response) => {
               this.data =response.data
             })
             this.dialogFormVisible=false
             this.$message({
                type: 'success',
                message: '更新成功'
              })
           }
           }
         )
      },
      handleInsert() {
         insert(this.category).then(response => {
           if(response.status!=10000){
             this.$message({
               type: 'error',
               message: '创建大类失败'
             })
           }else{
             ListSeviceCategory().then((response) => {
               this.data =response.data
             })
             this.category=''
             this.$message({
               type: 'success',
               message: '添加成功'
             })
           }
         })
      },
      handleCreate(row) {
         this.dialogStatus = '添加服务分类'
         this.dataTemp.id = row.id
         this.dataTemp.label = ''
         this.dataTemp.level = row.level+1
         this.dialogFormVisible = true
      },
      createData() {
         create(this.dataTemp).then(response => {
          if(response.status!=10000) {
            this.dialogFormVisible=false
             this.$message({
                type: 'error',
                message: '添加失败'
              })
          } else{
             ListSeviceCategory().then((response) => {
               this.data =response.data
             })
             this.dialogFormVisible=false
             this.$message({
                type: 'success',
                message: '添加成功'
              })
           }
         })
      },
      handleRemove(row) {
         this.$confirm('是否将 ' + row.label + ' 分类删除？', '提示', {
          type: "warning"
        }).then(() => {
          remove(row.id).then(response => {
            if (response.status===10000) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              ListSeviceCategory().then((response) => {
               this.data =response.data
             })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      fecthServiceCategory(){
        ListSeviceCategory().then((response) => {
          this.data =response.data
        })
      },
      // changeSwitch(){
      //   console.log('expand的值是'+this.expand)
      // },
       filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
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
</style>
