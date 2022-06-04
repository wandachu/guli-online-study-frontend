<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="Description">
        <el-tag type="info">Excel Template Description</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/static/template.xlsx'">Download template</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="Choose Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduservice/subject/addSubject'"
          name="file"
          accept=".xls, .xlsx">
          <el-button slot="trigger" size="small" type="primary">Select File</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">Import</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  data() {
      return {
        BASE_API: process.env.BASE_API,
        importBtnDisabled: false, // 按钮是否禁用,
        loading: false
      }
  },
  created() {

  },
  methods: {
    submitUpload() {
      this.importBtnDisabled = true
      this.loading = true
      // js: document.getElementById("upload").submit()
      this.$refs.upload.submit()
    },
    fileUploadSuccess(response) {
      this.loading = false
      this.$message({
        type: 'success',
        message: 'Successfully imported!'
      })
      this.$router.push({path:'/subject/list'})
    },
    fileUploadError() {
      this.loading = false
      this.$message({
        type: 'error',
        message: 'Error when importing.'
      })
    }
  }
}
</script>
