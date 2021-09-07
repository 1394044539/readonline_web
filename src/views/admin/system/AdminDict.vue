<template>
    <div>
        <h2>字典管理界面</h2>
        <el-divider></el-divider>
        <div class="tableBtnDiv">
            <el-button class="tableBtnDelChose" icon="el-icon-delete" type="danger" @click="deleteUser(1)">删除选中</el-button>
        </div>
        <div class="tableDiv">
            <el-table
                    :data="tableData"
                    style="width: 96%;"
                    min-height="200"
                    max-heigth="400"
                    border
                    size="small"
                    tooltip-effect="light"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        fixed
                        type="selection"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="novel.novelTitle"
                        label="小说名"
                        :show-overflow-tooltip='true'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createBy"
                        label="收藏用户"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="collectChannel"
                        label="是否是自己小说"
                        :show-overflow-tooltip='true'
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="收藏时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        prop="opr"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button @click="deleteUser(2,scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tablePageDiv">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[10, 20, 50, 80]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminDict",
        data(){
            return{
                tableData:[],
                pageNum:1,
                pageSize:10,
                total:0,
                multipleSelection: []
            }
        },
        methods:{
            getDictList(){
                let param = {
                    pageNum : this.pageNum,
                    pageSize : this.pageSize,
                }
                // this.$apiMethods.novelApi.getAllList(param).then(res=>{
                //     if(res.code===200){
                //         this.pageNum=res.data.current
                //         this.total=res.data.total
                //         this.tableData=res.data.records
                //     }
                // })
            }
        },
    }
</script>

<style scoped>
    .tableBtnDiv{
        height: 40px;
        line-height: 40px;
        padding: 0 2%;
        margin-bottom: 10px;
    }

    .tableBtnDelChose{
        float: right;
    }

    .tableBtnUpload{
        float: left;
    }
    .tableDiv{
        width: 100%;
        padding: 0 2%;
    }

    .tablePageDiv{
        margin-top: 5px;
    }
</style>