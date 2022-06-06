<template>
  <div class="app-container">
    <h2 style="text-align: center;">Publish New Course</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom:40px;">
      <el-step title="Input basic info"/>
      <el-step title="Create chapters"/>
      <el-step title="Publish"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>Total: {{ coursePublish.lessonNum }} lessons</span></p>
        <p><span>Subject Category：{{ coursePublish.subjectLevelOne }} — {{ coursePublish.subjectLevelTwo }}</span></p>
        <p>Teacher：{{ coursePublish.teacherName }}</p>
        <h3 class="red">${{ coursePublish.price }}</h3>
      </div>
    </div>
    <div>
      <el-button @click="previous">Return to modify</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">Publish</el-button>
    </div>
  </div>
</template>
<script>
import course from '@/api/edu/course'
export default {
  data() {
    return {
      courseId: '', 
      coursePublish: {},
      saveBtnDisabled: false // 保存按钮是否禁用
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCoursePublishId()
    }
  },
  methods: {
    getCoursePublishId() {
      course.getPublishCourseInfo(this.courseId)
        .then(response => {
          this.coursePublish = response.data.publishCourse
        })
    },
    previous() {
      this.$router.push({ path: '/course/chapter/' + this.courseId })
    },
    publish() {
      course.publishCourse(this.courseId)
        .then(response => {
          this.$message({
            type: 'success',
            message: 'Successfully published'
          })
        })
      this.$router.push({ path: '/course/list' })
    }
  }
}
</script>
<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}
.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}
.ccInfo .main {
  margin-left: 520px;
}
.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main h3 {
  left: 540px;
  bottom: 0px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>