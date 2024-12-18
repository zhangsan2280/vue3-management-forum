<!-- 修改注册禁止的用户名称 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/disableUserName/list',query:{ page : ($route.query.superiorPage != undefined ? $route.query.superiorPage :'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="120" @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="100"></el-input>
                    <div class="form-help" >可使用通配符 *和?  &nbsp;  星号匹配0或者任意数量的字符；问号匹配任何单字符   &nbsp;&nbsp;例如：*admin* 表示不能含有字符admin</div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                    <div class="form-error" v-text="error.disableUserNameId"></div>
                </el-form-item>
            </el-form>
            
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        name :'',
        disableUserNameId :'',
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        disableUserNameId :'',
		name :'',
    });

    //查询注册禁止的用户名称
    const queryDisableUserName = () => {
        if(state.disableUserNameId == undefined){
            ElMessage({
                showClose: true,
                message: '注册禁止的用户名称Id不能为空',
                type: 'error',
                onClose: ()=>{
                    
                }
            })
        }

        proxy?.$axios({
            url: '/control/disableUserName/manage',
            method: 'get',
            params: {
                method : 'edit',
			    disableUserNameId: state.disableUserNameId,
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "disableUserName"){
			    				let disableUserName = mapData[key];
			    				state.name = disableUserName.name;
			    			
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
        formData.append('disableUserNameId',  state.disableUserNameId); 
			
        if(state.name != null){
            formData.append('name', state.name);
            
        }

        proxy?.$axios({
            url: '/control/disableUserName/manage?method=edit',
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
							path : '/admin/control/disableUserName/list',
							query:{ 
				    			page : (router.currentRoute.value.query.superiorPage != undefined ? router.currentRoute.value.query.superiorPage :'')
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

        if(router.currentRoute.value.query.disableUserNameId != undefined && router.currentRoute.value.query.disableUserNameId != ''){
			state.disableUserNameId = router.currentRoute.value.query.disableUserNameId as string;
		}
		
		queryDisableUserName();
    }) 
</script>