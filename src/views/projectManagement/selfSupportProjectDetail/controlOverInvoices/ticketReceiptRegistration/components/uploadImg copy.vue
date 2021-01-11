<template>
	<el-upload
        class="upload-demo"
        action="#"
        :http-request="httpRequest"
        :show-file-list="false"
        :multiple="true"
        :before-upload="beforeAvatarUpload"
        accept="image/png,image/gif,image/jpg,image/jpeg,application/pdf"
        >
            <!-- <el-button type="success" size="mini" class="ORC_identification_button"></el-button> -->
            本地上传
    </el-upload>
</template>

<script>
import { fileUpload} from '@/api/system/file/file'
export default {
	data() {
		return {
            action:'#',
            fileList:[],
		};
    },
    methods: {
        beforeAvatarUpload(file) {
            let form = new FormData();
            form.append('file', file);
            
            fileUpload (form).then((result) => {
                this.fileList.push(result)
                console.log(this.fileList)
                // this.$emit('uploadOk',result)
            }).catch((err) => {
                
            });
        },
        httpRequest (data) {
            // console.log(data)
        }
    },
};
</script>

<style lang="scss" scoped>
.upload-demo{
    display: inline-block;
    // margin: 0 10px;
}
</style>
