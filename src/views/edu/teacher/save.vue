<template>
  <div class="app-container">
    Add Teacher
        <el-form label-width="120px">
            <el-form-item label="Name">
                <el-input v-model="teacher.name"/>
            </el-form-item>
            <el-form-item label="Sort">
                <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
            </el-form-item>
            <el-form-item label="Level">
                <el-select v-model="teacher.level" clearable placeholder="Please choose">
                    <el-option :value="1" label="Senior"/>
                    <el-option :value="2" label="Principal"/>
                </el-select>
            </el-form-item>
            <el-form-item label="Expereience">
                <el-input v-model="teacher.career"/>
            </el-form-item>
            <el-form-item label="Introduction">
                <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
            </el-form-item>

            <!-- Teacher Avatar -->
            <el-form-item label="Avatar">
                <!-- 头衔缩略图 -->
                <pan-thumb :image="teacher.avatar"/>
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">Change Avatar
                </el-button>

                <!--
                v-show：是否显示上传组件
                :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                :url：后台上传的url地址
                @close：关闭上传组件
                @crop-upload-success：上传成功后的回调 
                    <input type="file" name="file"/> this "file" must align with backend MultipartImage's variable name
                -->
                <image-cropper
                                v-show="imagecropperShow"
                                :width="300"
                                :height="300"
                                :key="imagecropperKey"
                                :url="BASE_API+'/eduoss/fileoss'"
                                field="file"
                                @close="close"
                                @crop-upload-success="cropSuccess"/>
            </el-form-item>

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">Save</el-button>
            </el-form-item>
        </el-form>
  </div>
</template>
<script>

import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components: { ImageCropper, PanThumb },
    data() {
        return {
            teacher: { // can omit
            name: '',
            sort: 0,
            level: 1,   
            career: '',
            intro: '',
            avatar: ''
            },
            imagecropperShow:false, // default not show the upload pop-up
            imagecropperKey: 0, // key value
            BASE_API: process.env.BASE_API,
            saveBtnDisabled:false  // 保存按钮是否禁用,
        }
    },
    created() { // this only executed once, thus must have the watch rout change to re-init
        this.init()
    },
    watch: {
        $route(to, from) { // 路由变化方式，路由发生变化，方法就会执行
            this.init()
        }
    },
    methods:{
        close() { // close upload
            this.imagecropperShow=false
            this.imagecropperKey=this.imagecropperKey + 1
        },
        cropSuccess(data) {
            this.teacher.avatar = data.url
            this.close()
        },
        init() {
            if(this.$route.params && this.$route.params.id) { // has id, update
                const id = this.$route.params.id
                this.getInfo(id)
            } else { // no id, save
                this.teacher = { // has a default avatar
                    avatar: 'https://guliedu-chu.oss-us-west-1.aliyuncs.com/2022/06/02/805d4532cd4f498dbedf716818acadb0file.png'
                }
            }
        },
        getInfo(id) {
            teacherApi.getTeacherInfo(id)
                .then(response => {
                    this.teacher = response.data.teacher
                })
        },
        saveOrUpdate() {
            if (!this.teacher.id) { // new teacher, add it
                this.saveTeacher()
            } else {
                this.updateTeacher()
            }
        },
        updateTeacher() {
            teacherApi.updateTeacherInfo(this.teacher)
                .then(response => {
                    this.$message({
                        type: 'success',
                        message: 'Successfully modified!'
                    })
                    this.$router.push({path:'/teacher/table'}) // get back to teacher list
                })
        },
        saveTeacher() {
            teacherApi.addTeacher(this.teacher)
                .then(response => {
                    this.$message({
                        type: 'success',
                        message: 'Successfully added!'
                    });
                    this.$router.push({path:'/teacher/table'}) 
                })
        }
    }
}
</script>
