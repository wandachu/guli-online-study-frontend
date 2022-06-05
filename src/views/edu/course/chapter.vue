<template>
  <div class="app-container">
    <h2 style="text-align: center;">Publish New Course</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom:40px;">
      <el-step title="Input basic info"/>
      <el-step title="Create chapters"/>
      <el-step title="Publish"/>
    </el-steps>

    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{chapter.title}}
        </p>
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{video.title}} 
            </p>
          </li>
        </ul>
      </li>
    </ul>

    
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">Previous</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">Save and Next</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
  export default {
    data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        chapterVideoList: [],
        courseId: '' // courseId
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getChapterVideo()
      }      
    },
    methods: {
      getChapterVideo() {
        chapter.getAllChapterVideo(this.courseId)
          .then(response => {
            this.chapterVideoList = response.data.allChapterVideo
          })
      },
      previous() {
        this.$router.push({ path: '/course/info/' + this.courseId })
      },
      next() {
        this.$router.push({ path: '/course/publish/' + this.courseId })
      }
    }
  }
</script>
<style scoped>
.chapterList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>