<!-- 修改帮助分类 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item @click="$router.push({path: '/admin/control/helpType/list'});">全部分类</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(value, key) in state.navigation" @click="$router.push({path: '/admin/control/helpType/list',query:{parentId:key}});">{{value}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/helpType/list',query:{parentId:($route.query.sourceParentId != undefined ? $route.query.sourceParentId:''), page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="分类名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="50" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
                </el-form-item>
                <el-form-item label="缩略图" :error="error.images">
                    <el-upload action="#" v-model:file-list="state.images" list-type="picture-card" :auto-upload="false" :on-change="handleChange" :on-preview="openImagePreview" :on-remove="handleImageRemove" :accept="'image/*'">
                        <el-icon><Plus /></el-icon>
                    </el-upload>
                    <!-- 图片预览 -->
                    <el-image-viewer v-if="state.isImageViewer" @close="closeImagePreview" :url-list="[state.localImageUrl]" />
                </el-form-item>
                <el-form-item label="描述"  :error="error.description"  >
                    <el-input type="textarea" v-model="state.description" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>						
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
    import { HelpType } from '@/types';
    import { ArrowRight } from '@element-plus/icons-vue'


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        id:'',
        parentId:'',
        name :'',
        sort : 0,
        description :'',
        
        helpType :{} as HelpType,
        navigation :'',
        imagePath : '',
        images:[] as UploadUserFile[],
        localImageUrl: '' as string | undefined,//本地图片地址 例如blob:http://127.0.0.1:8080/cfab3833-cbb0-4072-a576-feaf8fb19e5f
        isImageViewer: false,//是否显示图片查看器
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        sort :'',
        images: '',
        description :'',
    });


    //查询分类
    const queryType = () => {
        proxy?.$axios({
            url: '/control/helpType/manage',
            method: 'get',
            params: {
                method : 'edit',
			    typeId: state.id,
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
			    		for(let key in mapData){
			    			if(key == "helpType"){
			    				state.helpType = mapData[key];
			    				state.name = state.helpType.name;
			    				state.sort = state.helpType.sort;
			    				state.description = state.helpType.description;
			    			}else if(key == "navigation"){
			    				state.navigation = mapData[key];
			    			}else if(key == "imagePath"){
			    				imagePath = mapData[key];
			    				
			    			}
			    		}
			    		
			    		if(state.helpType.image != null && state.helpType.image != ''){
			    			state.imagePath = state.helpType.image;
			    			state.images.push({
				    			name: state.helpType.image,
				    			url: imagePath
				    		});
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
    

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.id != null){
            formData.append('typeId', state.id);
            
        }
        if(state.name != null){
            formData.append('name', state.name);
            
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
            
        }
        if(state.imagePath != null){
            formData.append('imagePath', state.imagePath);
        }
        if(state.description != null){
            formData.append('description', state.description);
            
        }

        if(state.images != null && state.images.length >0){
            for(let i=0; i<state.images.length; i++){
                let file = state.images[i];
                formData.append('images', file.raw!);
            }
        }

        proxy?.$axios({
            url: '/control/helpType/manage?method=edit',
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
							path : '/admin/control/helpType/list',
							query:{
								parentId: state.parentId,
								page:(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')
							}
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

        if(router.currentRoute.value.query.typeId != undefined && router.currentRoute.value.query.typeId != ''){
			state.id = router.currentRoute.value.query.typeId as string;
		}
        if(router.currentRoute.value.query.parentId != undefined && router.currentRoute.value.query.parentId != ''){
			state.parentId = router.currentRoute.value.query.parentId as string;
		}

		queryType();
    }) 

</script>