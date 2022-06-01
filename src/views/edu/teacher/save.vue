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

        <!-- 讲师头像：TODO -->

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">Save</el-button>
            </el-form-item>
        </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/edu/teacher'
export default {
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
        init() {
            if(this.$route.params && this.$route.params.id) { // has id, update
                const id = this.$route.params.id
                this.getInfo(id)
            } else { // no id, save
                this.teacher = {}
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
