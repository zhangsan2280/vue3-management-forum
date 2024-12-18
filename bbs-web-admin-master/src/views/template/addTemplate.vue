<!-- 添加模板 -->
<template>
    <div class="main" >
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item>添加模板</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="模板名称" :required="true" :error="error.name">
                    <el-col :span="12"><el-input v-model.trim="state.name" maxlength="100" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="模板目录" :required="true" :error="error.dirName">
                    <el-col :span="12"><el-input v-model.trim="state.dirName" maxlength="40" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="是否验证CSRF(跨站请求伪造)">
                    <el-switch v-model="state.verifyCSRF" ></el-switch>
                    <div class="form-help" >前后端一体模板必需启用CSRF(跨站请求伪造)验证，前后端分离模板可以关闭本项验证</div>
                </el-form-item>
                <el-form-item label="模板简介"  :error="error.introduction"  >
                    <el-input type="textarea" v-model="state.introduction" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>						
                </el-form-item>
                <el-form-item label="图片" :error="error.thumbnailSuffix">
                    <el-upload action="#" v-model:file-list="state.images" list-type="picture-card" :auto-upload="false" :on-change="handleChange" :on-preview="openImagePreview" :on-remove="handleImageRemove" :accept="'image/*'">
                        <el-icon><Plus /></el-icon>
                    </el-upload>
                    <!-- 图片预览 -->
                    <el-image-viewer v-if="state.isImageViewer" @close="closeImagePreview" :url-list="[state.localImageUrl]" />
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive} from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, UploadFile, UploadUserFile } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { ArrowRight } from '@element-plus/icons-vue'


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        name :'',
        dirName : '',
        introduction : '',
        verifyCSRF:true,
        images:[] as UploadUserFile[],//缩略图
        localImageUrl: '' as string | undefined,//本地图片地址 例如blob:http://127.0.0.1:8080/cfab3833-cbb0-4072-a576-feaf8fb19e5f
        isImageViewer: false,//是否显示图片查看器
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        dirName :'',
        introduction : '',
        thumbnailSuffix: '',
    });

    //处理上传图片
    const handleChange = (file: UploadFile, fileList:UploadUserFile[]) => {
        if (fileList.length > 1) {
            fileList.splice(0, 1);
        }
    }
    //处理删除图片
    const handleImageRemove = (file: UploadFile) => {
        
    }
    //打开图片预览
    const openImagePreview = (file: UploadFile) => {
        state.localImageUrl = file.url;
        state.isImageViewer = true;
    }
    //关闭图片预览
    const closeImagePreview= () => {
        state.localImageUrl = '';
        state.isImageViewer = false;
    }


    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.name != null){
            formData.append('name', state.name);
            
        }
        if(state.dirName != null){
            formData.append('dirName',state.dirName);
            
        }
        if(state.introduction != null){
            formData.append('introduction', state.introduction);
            
        }
        formData.append('verifyCSRF', state.verifyCSRF.toString());
        

        if(state.images != null && state.images.length >0){
            for(let i=0; i<state.images.length; i++){
                let file = state.images[i];
                formData.append('uploadImage', file.raw!);
            }
        }



        proxy?.$axios({
            url: '/control/template/manage?method=add',
            method: 'post',
            data: formData,
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
			    if(result){
                    let returnValue = JSON.parse(result);
			    	if(returnValue.code === 200){//成功
                        ElMessage({
                            showClose: true,
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
			    		router.push({
							path : '/admin/control/template/list',
						});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
                state.submitForm_disabled = false;//提交按钮disabled状态
            }
        })
        .catch((error: any) =>{
            console.log(error);
            state.submitForm_disabled = false;//提交按钮disabled状态
        });
    }

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

    }) 

</script>