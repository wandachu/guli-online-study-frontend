<template>
  <div class="app-container">
    <h2 style="text-align: center;">Publish New Course</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom:40px;">
      <el-step title="Input basic info"/>
      <el-step title="Create chapters"/>
      <el-step title="Publish"/>
    </el-steps>

    <el-button type="text" @click="openChapterDiaglog()">Add Chapter</el-button>
    <!-- 章节 -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <!-- <el-button type="text">Add Lesson</el-button> -->
            <el-button style="" type="text"  @click="openVideo(chapter.id)">Add Video</el-button>
            <el-button style="" type="text" @click="openEditChapter(chapter.id)">Modify</el-button>
            <el-button style="" type="text"  @click="removeChapter(chapter.id)">Delete</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)">Modify</el-button>
                <el-button type="text" @click="removeVideo(video.id)">Delete</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">Previus</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">Save and Next</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="Add Chapter">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="Chapter Name">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="Chapter Sort">
          <el-input-number v-model="chapter.sort" :min="0" controlsPosition="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveOrUpdate">Confirm</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="Add video">
      <el-form :model="video" label-width="120px">
        <el-form-item label="Video Title">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="Sort">
          <el-input-number v-model="video.sort" :min="0" controlsPosition="right"/>
        </el-form-item>
        <el-form-item label="Free or Default">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">Free</el-radio>
            <el-radio :label="0">Default</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Upload video">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduvod/video/uploadAliyunVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">Upload</el-button>
            <el-tooltip placement="right-end">
                <div slot="content">Supports maximum size of 1G,<br>
                    formats including: 3GP, ASF, AVI, DAT, DV, <br>
                    FLV, F4V, GIF, M2T, M4V, MJ2, MJPEG, MKV, <br>
                    MOV, MP4, MPE, MPG, MPEG, MTS, OGG, QT, <br>
                    RM, RMVB, SWF, TS, VOB, WMV, WEBM</div>
                <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">Cancel</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
  export default {
    data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        chapterVideoList: [],
        courseId: '', // courseId
        dialogChapterFormVisible: false,
        dialogVideoFormVisible: false,
        saveVideoBtnDisabled: false,
        BASE_API: process.env.BASE_API,
        fileList: [],
        chapter: { // Chapter info
          title:'',
          sort: 0,
          courseId: ''
        },
        video: {
          title: '',
          sort: 0,
          isFree: 0, // default to be not chosen. 0 is not free. 1 is free
          videoSourceId: '',
          videoOriginalName: ''
        }
      }
    },
    created() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getChapterVideo()
      }      
    },
    methods: {
      //===========================================Video=========================================
      handleVodUploadSuccess(response, file, fileList) {
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName = file.name
      },
      handleVodRemove() { // called when click yes in the pop-up window. actually remove the video
        video.removeAliyunVideo(this.video.videoSourceId)
          .then(response => {
            this.$message({
              type: 'success',
              message: 'Delete completed'
            })
            this.fileList = []
            this.video.videoSourceId = ''
            this.video.videoOriginalName = ''
          })
      },
      beforeVodRemove(file, fileList) { // called when the x is clicked. used to pop up a confirming window
        return this.$confirm(`Are you sure you want to delete '${file.name}'?`)
      },
      handleUploadExceed() {
        this.$message.warning('Please remove the uploaded video before uploading new videos')
      },
      openEditVideo(id) {
        this.dialogVideoFormVisible = true
        video.getVideo(id)
          .then(response => {
            this.video = response.data.video
          })
      },
      removeVideo(id) {
        this.$confirm('This will permanently delete the video. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
          .then(() => {
            video.deleteVideo(id)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: 'Delete completed'
                })
                this.getChapterVideo()
              })
              .catch(error => {
                console.log(error)
              })
        })
      },
      openVideo(chapterId) {
        this.dialogVideoFormVisible = true
        this.fileList = []
        this.video.chapterId = chapterId
        this.video.courseId = this.courseId
        // Reset pop up window
        this.video.title = '',
        this.video.sort = 0,
        this.video.isFree = 0,
        this.video.videoSourceId = ''
      },
      saveOrUpdateVideo() {
        if (!this.video.id) {
          this.addVideo()
        } else {
          this.updateVideo()
        }
      },
      updateVideo() {
        video.updateVideo(this.video)
          .then(response => {
            this.dialogVideoFormVisible = false // close the pop-up window
            this.$message({ // display a message
              type: 'success',
              message: 'Successfully modified!'
            })
            this.getChapterVideo() // refresh chapter list
          })
      },
      addVideo() {
        video.addVideo(this.video)
          .then(response => {
            this.dialogVideoFormVisible = false // close the pop-up window
            this.$message({ // display a message
              type: 'success',
              message: 'Successfully added!'
            })
            this.getChapterVideo() // refresh chapter list
          })
      },

      //===========================================Chapter=========================================
      removeChapter(chapterId) {
        this.$confirm('This will permanently delete the chapter. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
          .then(() => {
            chapter.deleteChapter(chapterId)
              .then(response => {
                this.$message({
                    type: 'success',
                    message: 'Delete completed'
                })
                this.getChapterVideo()
              })
              .catch(error => {
                console.log(error)
              })
        })
      },
      openEditChapter(chapterId) {
        this.dialogChapterFormVisible = true
        chapter.getChapter(chapterId)
          .then(response => {
            this.chapter = response.data.chapter
          })
      },
      openChapterDiaglog() {
        this.dialogChapterFormVisible = true
        this.chapter.title = '',
        this.chapter.sort = 0
      },
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
      },
      addChapter() {
        this.chapter.courseId = this.courseId // set courseId in chapter
        chapter.addChapter(this.chapter)
          .then(response => {
            this.dialogChapterFormVisible = false // close the pop-up window
            this.$message({ // display a message
              type: 'success',
              message: 'Successfully added!'
            })
            this.getChapterVideo() // refresh chapter list
          })
      },
      updateChapter() {
        chapter.updateChapter(this.chapter)
          .then(response => {
            this.dialogChapterFormVisible = false // close the pop-up window
            this.$message({ // display a message
              type: 'success',
              message: 'Successfully modified!'
            })
            this.getChapterVideo() // refresh chapter list
          })
      },
      saveOrUpdate() {
        if (!this.chapter.id) {
          this.addChapter()
        } else {
          this.updateChapter()
        }
        
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