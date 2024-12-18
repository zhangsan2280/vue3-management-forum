<!-- 修改举报分类 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item @click="$router.push({path: '/admin/control/reportType/list'});">全部分类</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(value, key) in state.navigation" @click="$router.push({path: '/admin/control/reportType/list',query:{parentId:key}});">{{value}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/reportType/list',query:{parentId:($route.query.sourceParentId != undefined ? $route.query.sourceParentId:''), page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="父分类名称" v-if="state.parentType != undefined && state.parentType != null && Object.keys(state.parentType).length>0">
                    {{state.parentType.name}}
                </el-form-item>
                <el-form-item label="分类名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="50" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="是否需要说明理由">
                    <el-radio-group v-model="state.giveReason" :disabled="state.childNodeNumber ==0 ? false:true">
                        <el-radio :label="true">需要</el-radio>
                        <el-radio :label="false">不需要</el-radio>
                    </el-radio-group>
                    <div class="form-help" >仅在最后一级分类上有效</div>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
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
    import { ElMessage, } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { ReportType } from '@/types';
    import { ArrowRight } from '@element-plus/icons-vue'

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        id:'',
        parentId:'',
        name :'',
        sort : 0,
        giveReason : false,
		childNodeNumber : 0,

        parentType :{} as ReportType,
        navigation :'',
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        sort :'',
    });


    
    //查询分类
    const queryReportType = () => {

        proxy?.$axios({
            url: '/control/reportType/manage',
            method: 'get',
            params: {
                method : 'edit',
			    reportTypeId: state.id,
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
                        let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "reportType"){
			    				let type = mapData[key];
			    				state.name = type.name;
			    				state.sort = type.sort;
                                state.giveReason = type.giveReason;
			    				state.childNodeNumber = type.childNodeNumber;
			    			}else if(key == "parentType"){
			    				state.parentType = mapData[key];
			    			}else if(key == "navigation"){
			    				state.navigation = mapData[key];
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
        if(state.id != null){
            formData.append('reportTypeId', state.id);
            
        }
        if(state.name != null){
            formData.append('name', state.name);
            
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
            
        }
        if(state.giveReason != null){
            formData.append('giveReason', state.giveReason.toString());
        }

        proxy?.$axios({
            url: '/control/reportType/manage?method=edit',
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
			    		let parentId = state.parentId;
                        if(state.parentId == '0'){
                            parentId = ''
                        }

			    		router.push({
							path : '/admin/control/reportType/list',
							query:{
								parentId: parentId,
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
		
		queryReportType();
    }) 

</script>