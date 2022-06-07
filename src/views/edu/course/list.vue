<template>
  <div class="app-container">
    Course List

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="Course"/>
      </el-form-item>

      <el-form-item>
          <el-select v-model="courseQuery.status" clearable placeholder="Status">
          <el-option value="Draft" label="Draft"/>
          <el-option value="Normal" label="Published"/>
          </el-select>
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

      <el-table-column prop="title" label="Course" width="300" />

      <el-table-column label="Status" width="90">
        <template slot-scope="scope">
        {{ scope.row.status==='Normal' ? 'Published' : 'Draft' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="Total Lessons" width="130"/>

      <el-table-column prop="gmtCreate" label="Created Time" width="160"/>

      <el-table-column prop="viewCount" label="Total Views" width="130" />

      <el-table-column label="Action" width="170" align="center">
        <template slot-scope="scope">
        <router-link :to="'/course/info/' + this.courseId"> <!-- use router to go back to edit page -->
            <el-button type="primary" size="mini" icon="el-icon-edit">Modify Basic Info</el-button>
        </router-link>

        <router-link :to="'/course/chapter/' + this.courseId"> <!-- use router to go back to edit page -->
            <el-button type="primary" size="mini" icon="el-icon-edit">Modify Chapters</el-button>
        </router-link>

        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

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
import course from "@/api/edu/course"
export default {
  data() {
    return {
      list: null, // returning collection after query
      page: 1, // current page
      limit: 10,
      total: 0,
      courseQuery: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(page = 1) {
      this.page = page
      console.log(this.courseQuery)
      course.getListCourse(this.page, this.limit, this.courseQuery)
          .then(response => {
            this.list = response.data.list
            this.total = response.data.total
          })
          .catch(error => {
            console.log(error)
          })
    },
    resetData() {
      this.courseQuery = {}
      this.getList()
    }
  }
}
</script>