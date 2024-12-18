<!-- 添加会员等级 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/userGrade/list'})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="120"  @submit.native.prevent>
                <el-form-item label="等级名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="40" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="需要积分" :required="true" :error="error.needPoint">
                    <el-col :span="4"><el-input v-model.trim="state.needPoint" maxlength="9" :clearable="true" ></el-input></el-col>
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
        needPoint : '',
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
		needPoint :'',
    });

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.name != null && state.name != ''){
            formData.append('name', state.name);
            
        }
        if(state.needPoint != null && state.needPoint != ''){
            formData.append('needPoint', state.needPoint);
            
        }

        proxy?.$axios({
            url: '/control/userGrade/manage?method=add',
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
							path : '/admin/control/userGrade/list',
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