<!-- 修改系统通知 -->
<template>
    <div class="main" >
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/systemNotify/list' ,query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="通知内容" :required="true" :error="error.content">
                    <el-input type="textarea" v-model="state.content" :autosize="{minRows: 8}" placeholder="请输入内容" ></el-input>	
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
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        systemNotifyId :'',
        content :'',
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        content:'',
    });

    //查询修改系统通知
    const querySystemNotify = () => {

        proxy?.$axios({
            url: '/control/systemNotify/manage',
            method: 'get',
            params: {
                method : 'edit',
			    systemNotifyId : state.systemNotifyId,
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
                        let systemNotify = returnValue.data;
			    		state.content = systemNotify.content;
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

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('systemNotifyId', state.systemNotifyId);
        if(state.content != null){
            formData.append('content',state.content);
            
        }
    
        proxy?.$axios({
            url: '/control/systemNotify/manage?method=edit',
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
							path : '/admin/control/systemNotify/list',
							query:{ page:(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')}
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

        if(router.currentRoute.value.query.systemNotifyId != undefined && router.currentRoute.value.query.systemNotifyId != ''){
			state.systemNotifyId = router.currentRoute.value.query.systemNotifyId as string;
		}
		
		
		querySystemNotify();
    }) 

</script>