<template>
    <div class="app-container">
        Teacher List
        
        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="teacherQuery.name" placeholder="Name"/>
        </el-form-item>

        <el-form-item>
            <el-select v-model="teacherQuery.level" clearable placeholder="Level">
            <el-option :value="1" label="Senior"/>
            <el-option :value="2" label="Principal"/>
            </el-select>
        </el-form-item>

        <el-form-item label="Creation Time">
            <el-date-picker
            v-model="teacherQuery.begin"
            type="datetime"
            placeholder="Choose start time"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
        </el-form-item>
        <el-form-item>
            <el-date-picker
            v-model="teacherQuery.end"
            type="datetime"
            placeholder="Choose end time"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="getList()">Search</el-button>
        <el-button type="default" @click="resetData()">Reset</el-button>
        </el-form>

        <!-- 表格 -->
        <el-table
        :data="list"
        border
        fit
        highlight-current-row>

        <el-table-column
            label="Id"
            width="70"
            align="center">
            <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>

        <el-table-column prop="name" label="Name" width="80" />

        <el-table-column label="Level" width="80">
            <template slot-scope="scope">
            {{ scope.row.level===1 ? 'Senior':'Principal' }}
            </template>
        </el-table-column>

        <el-table-column prop="intro" label="Introduction" />

        <el-table-column prop="gmtCreate" label="Created Time" width="160"/>

        <el-table-column prop="sort" label="Sort" width="60" />

        <el-table-column label="Action" width="200" align="center">
            <template slot-scope="scope">
            <router-link :to="'/teacher/edit/'+scope.row.id"> <!-- use router to go back to edit page -->
                <el-button type="primary" size="mini" icon="el-icon-edit">Modify</el-button>
            </router-link>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">Delete</el-button>
            </template>
        </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            :current-page="page"
            :page-size="limit"
            :total="total"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="getList"
        />
    </div>
</template>

<script>
import teacher from "@/api/edu/teacher"
export default {
    data() {
        return {
            list: null, // returning collection after query
            page: 1, // current page
            limit: 10,
            total: 0,
            teacherQuery: {}
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList(page = 1) {
            this.page = page
            teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
                .then(response => {
                    this.list = response.data.rows
                    this.total = response.data.total
                })
                .catch(error => {
                    console.log(error)
                })
        },
        resetData() {
            this.teacherQuery = {}
            this.getList()
        },
        removeDataById(id) {
            this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                teacher.deleteTeacherId(id)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: 'Delete completed'
                        })
                        this.getList()
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
        }
    }
    
}
</script>