<template>
  <div class="app-container">
    <h2 style="text-align: center;">Publish New Course</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom:40px;">
      <el-step title="Input basic info"/>
      <el-step title="Create chapters"/>
      <el-step title="Publish"/>
    </el-steps>
    
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">Previous</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">Publish</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        courseId: '', // courseId
        saveBtnDisabled: false // 保存按钮是否禁用
      }
    },
    created() {
      this.courseId = this.$route.params.id
    },
    methods: {
      previous() {
        this.$router.push({ path: '/course/chapter/' + this.courseId })
      },
      publish() {
        console.log('publish')
        this.$router.push({ path: '/course/list' })
      }
    }
  }
</script>