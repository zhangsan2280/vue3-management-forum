<!-- 修改友情链接 -->
<template>
    <div class="main" >
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/links/list'})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="120"  @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="50" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="网址" :required="true" :error="error.website">
                    <el-input v-model.trim="state.website" maxlength="50" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
                </el-form-item>
                <el-form-item label="缩略图" :error="error.images">
                    <el-upload action="#" v-model:file-list="state.fileList" list-type="picture-card" :auto-upload="false" :on-change="handleChange" :on-preview="openImagePreview" :on-remove="handleImageRemove" :accept="'image/*'">
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
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, UploadFile, UploadUserFile, } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        linksId :'',
        
        name :'',
        website : '',
        sort :0,
        
        imagePath : '',
        fileList:[] as UploadUserFile[],//上传的文件列表
        localImageUrl: '' as string | undefined,//本地图片地址 例如blob:http://127.0.0.1:8080/cfab3833-cbb0-4072-a576-feaf8fb19e5f
        isImageViewer: false,//是否显示图片查看器
        error : {
            
        },
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        website : '',
        sort : '',
        images: '',
    });


    //处理上传图片
    const handleChange = (file: UploadFile, fileList:UploadUserFile[]) => {
        if (fileList.length > 1) {
            fileList.splice(0, 1);
        }
        state.imagePath = "";
    }
    //处理删除图片
    const handleImageRemove = (file: UploadFile) => {
        state.imagePath = "";
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

    //查询友情链接
    const queryLinks = () => {
        proxy?.$axios({
            url: '/control/links/manage',
            method: 'get',
            params: {
                method : 'edit',
			    linksId: state.linksId,
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        let mapData = returnValue.data;
			    		let imagePath = "";
		    			let links = null;
			    		for(let key in mapData){
			    			if(key == "imagePath"){
			    				imagePath = mapData[key];
			    				
			    			}else if(key == "links"){
			    				links = mapData[key];
			    				
			    			}
			    		}
			    		
			    		if(links != null){
			    			state.name =links.name;
							state.website = links.website;
							state.sort = links.sort;
							
			    			if(links.image != null && links.image != ''){
			    				state.imagePath = links.image;
			    				state.fileList.push({
				    				name: links.image,
				    				url: imagePath
				    			});
			    			}
			    		}
						
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
    

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('linksId', state.linksId);
			
			
        if(state.name != null){
            formData.append('name', state.name);
            
        }
        if(state.website != null){
            formData.append('website', state.website);
            
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
            
        }
        if(state.imagePath != null){
            formData.append('imagePath', state.imagePath);
        }
        
        if(state.fileList != null && state.fileList.length >0){
            for(let i=0; i<state.fileList.length; i++){
                let file = state.fileList[i];
                if(file.raw != undefined){
                    formData.append('images', file.raw!);
                }
            }
        }

        proxy?.$axios({
            url: '/control/links/manage?method=edit',
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
							path : '/admin/control/links/list',
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
        if(router.currentRoute.value.query.linksId != undefined && router.currentRoute.value.query.linksId != ''){
			state.linksId = router.currentRoute.value.query.linksId as string;
		}
		
		queryLinks();
    }) 

</script>