<!-- 敏感词 -->
<template>
    <div class="main" >
        <div class="data-view label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent >
                <div v-if="state.filterWord != undefined && state.filterWord != null && Object.keys(state.filterWord).length>0">
                    <el-form-item label="过滤词数量">
                        {{state.filterWord.wordNumber}}
                    </el-form-item>
                    <el-form-item label="词库大小">
                        {{state.filterWord.size}}
                    </el-form-item>
                    <el-form-item label="词库最后修改时间">
                        {{state.filterWord.lastModified}}
                    </el-form-item>
                    <el-form-item label="前3个词">
                        <span v-for="word in state.filterWord.beforeWordList" >	
                            <span class="blue-tag" >{{word}}</span>
                        </span>
                    </el-form-item>
                </div>
                
                <el-form-item>
                    <span style="color: #F56C6C;">注意：词库必须为UTF-8格式。  词库必须到 ‘系统设置’ -- ‘基本设置’ 里打开 ‘敏感词过滤’ 开关才能生效</span>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" size="large" class="submitButton" plain @click="uploadFilterWordUI($event)" >上传词库</el-button>
                    <el-button type="primary" size="large" class="submitButton" @click="deleteFilterWord($event)" :disabled="state.submitForm_disabled">删除</el-button>
                </el-form-item>
            </el-form>
            <el-dialog title="上传词库" v-model="state.uploadForm">
                <el-form label-width="auto"  @submit.native.prevent>
                    <el-form-item :error="error.file">
                        <el-upload class="filterWordModule" drag :http-request="uploadFilterWord" :show-file-list="false" :accept="'.txt'">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    只允许上传 txt 文件
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-progress :text-inside="true" :stroke-width="20" :percentage="state.progressPercent" />
                    </el-form-item>
                </el-form>
            </el-dialog>
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive} from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { FilterWord } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        filterWord :{} as FilterWord,
			
        uploadForm:false,//是否显示上传表单
        progressPercent: 0 as any, // 进度条默认为0
        
        submitForm_disabled:false,//提交按钮是否禁用
    });

    const error = reactive({
        file :'',
    });

    //查询敏感词
    const queryViewFilterWord = () => {

        proxy?.$axios({
            url: '/control/filterWord/manage',
            method: 'get',
            params: {
                method : 'view',
            },
           // showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		state.filterWord = returnValue.data;
			    	}else if(returnValue.code === 500){//错误
			    		 //处理错误信息
                         processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //上传词库UI
    const uploadFilterWordUI = (event:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();
        
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        
        state.uploadForm =true;//是否显示上传表单
        state.progressPercent= 0; // 进度条默认为0
    }

    //文件上传
    const uploadFilterWord = (param:any) => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
		formData.append('file', param.file);

        proxy?.$axios({
            url: '/control/filterWord/manage?method=uploadFilterWord',
            method: 'post',
            data: formData,
            timeout: 0,// 定义请求超时时间
            onUploadProgress: (progressEvent:any) => {
                if (progressEvent.lengthComputable) {
                    let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
                    if (rate < 1) {
                        //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                        //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                        //等响应回来时，再将进度设为100%
                        // progressEvent.loaded:已上传文件大小
                        // progressEvent.total:被上传文件的总大小
                        state.progressPercent = (progressEvent.loaded / progressEvent.total * 100).toFixed(2);
                    }
                }
            }
        })
        .then((response: AxiosResponse) => {
            if(response){

                const result: any = response.data;
            
                if(result){
                    
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        state.progressPercent = 100;
			    		ElMessage({
                            showClose: true,
                            message: '上传成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		
			    		//删除缓存
			    		store.setCacheNumber();
			    		
			    		state.uploadForm = false;
			    		queryViewFilterWord();

                    }else if(returnValue.code === 500){//错误
                        
                        //处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

                        
                    }
                }
            }
            state.submitForm_disabled = false;//提交按钮disabled状态
        })
        .catch((error: any) =>{
            console.log(error);
            state.submitForm_disabled = false;//提交按钮disabled状态
        });
    }

    //删除词库
    const deleteFilterWord = (event:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();


        ElMessageBox.confirm('此操作将删除该词库, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();

            proxy?.$axios({
                url: '/control/filterWord/manage?method=deleteFilterWord',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
                            ElMessage({
                                showClose: true,
                                message: '删除成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryViewFilterWord();
				    	}else if(returnValue.code === 500){//错误
				    		
                            //处理错误信息
                            processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

				    		
				    	}
				    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });

        })
        .catch(() => {
            //取消
        })
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        queryViewFilterWord();
    }) 
</script>