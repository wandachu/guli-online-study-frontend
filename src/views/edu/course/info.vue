<template>
  <div class="app-container">
    <h2 style="text-align: center;">Create New Course</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="Input basic info"/>
      <el-step title="Create chapters"/>
      <el-step title="Publish"/>
    </el-steps>

    <el-form label-width="150px">
        <el-form-item label="Title">
          <el-input v-model="courseInfo.title" 
            placeholder=" Example: Machine Learning - Build a project from zero. Please use proper case in subjects"/>
        </el-form-item>

        <!-- 课程分类 -->
        <el-form-item label="Subject">
          <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="Major Subject" @change="subjectLevelOneChanged">
            <el-option
              v-for="subject in subjectOneList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>

          <!-- 二级分类 -->
          <el-select
            v-model="courseInfo.subjectId" 
            placeholder="Secondary Subject">
            <el-option
              v-for="subject in subjectTwoList"
              :key="subject.value"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
        </el-form-item>

        <!-- 课程讲师 -->
        <el-form-item label="Teacher">
          <el-select
            v-model="courseInfo.teacherId"
            placeholder="Please choose">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="Number of Lessons">
          <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" 
            placeholder="Please input the number of total lessons"/>
        </el-form-item>

        <el-form-item label="Description">
          <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>

        <!-- 课程封面 -->
        <el-form-item label="Cover Image">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API + '/eduoss/fileoss'"
            class="avatar-uploader">
            <img :src="courseInfo.cover" style="width: 280px; height: 200px">
          </el-upload>
        </el-form-item>

        <el-form-item label="Course Price">
          $<el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="0 for free courses"/>
        </el-form-item>
      
        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">Save and Next</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce' // import it

export default {
  // declare Tinymce component
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
          subjectId: '', //二级分类id
          subjectParentId:'', //一级分类id
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
      },
      courseId: '',
      BASE_API: process.env.BASE_API,
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: []
    };
  },
  created() {
    this.init()
  },
  watch: {  //监听
    $route(to, from) { //路由变化方式，路由发生变化，方法就会执行
      this.init()
    }
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) { // update
      this.courseId = this.$route.params.id
      this.getInfo() // will populate subjectOneList, subjectTwoList, teacherList
    } else { // initial save
      this.courseInfo = {
          title: '',
          subjectId: '', //二级分类id
          subjectParentId:'', //一级分类id
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
      }
      this.getListTeacher() // initialize teacher list
      this.getOneSubject() // initialize OneSubject
    }
    },
    getInfo() {
      course.getCourseInfoId(this.courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfoVo
          subject.getSubjectList() // Get all subjects
            .then(response => {
              this.subjectOneList = response.data.list // get all OneSubject
              for (var i = 0; i < this.subjectOneList.length; i++) { // get matching TwoSubject
                var oneSubject = this.subjectOneList[i]
                if (this.courseInfo.subjectParentId === oneSubject.id) {
                  this.subjectTwoList = oneSubject.children
                }
              }
            })
            this.getListTeacher()
        })
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
      this.$message.error('File must be a JPG!')
      }
      if (!isLt2M) {
      this.$message.error('File size cannot be over 2MB!')
      }
      return isJPG && isLt2M
    },
    getListTeacher() {
      course.getListTeacher()
        .then(response => {
         this.teacherList = response.data.items
        })
    },
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
              type: 'success',
              message: 'Successfully added!'
          })
          this.$router.push({ path: '/course/chapter/' + response.data.courseId })
        })
    },
    saveOrUpdate() {
      if (this.courseInfo.id) { // update
        course.updateCourseInfo(this.courseInfo)
          .then(response => {
            this.$message({
              type: 'success',
              message: 'Successfully modified!'
            })
            this.$router.push({ path: '/course/chapter/' + this.courseId }) // updateCourseInfo won't return an id
          })
      } else { // insert
        this.addCourse()
      }
      
    },
    getOneSubject() {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.list
        })
    },
    subjectLevelOneChanged(parentId) {
      for (var i = 0; i < this.subjectOneList.length; i++) {
        var oneSubject = this.subjectOneList[i];
        if (parentId === oneSubject.id) {
          this.subjectTwoList = oneSubject.children
          this.courseInfo.subjectId = '' // clear subjectTwo's id. Otherwise it may show in this box if you change subjectOne
        }
      }
    }
  }
}
</script>
<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>