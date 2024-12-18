<!-- 添加布局 -->
<template>
    <div class="main" >
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/control/layout/list',query:{ dirName : $route.query.dirName} }">布局列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}]</el-breadcrumb-item>
                <el-breadcrumb-item>添加布局</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="类型" :required="true" :error="error.type">
                    <el-select v-model="state.type" placeholder="选择类型">
                        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="布局名称" v-if="state.type != 1" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="80" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="选择默认页" v-if="state.type == 1" :required="true" :error="error.layoutFile">
                    <el-select v-model="state.layoutFile" placeholder="请选择">
                        <el-option v-for="item in state.layoutFileOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="版块数据" v-if="state.type == 3" :required="true">
                    <el-radio-group v-model="state.forumData">
                        <el-radio :label="3">在线帮助</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="返回数据" v-if="state.type == 4" :required="true">
                    <el-radio-group v-model="state.returnData">
                        <el-radio :label="0">html</el-radio>
                        <el-radio :label="1">json</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="URL名称" v-if="state.type == 4" :required="true" :error="error.referenceCode">
                    <el-input v-model.trim="state.referenceCode" maxlength="40" :clearable="true" show-word-limit @blur="checkUrlName"></el-input>
                    <div class="form-help" >URL名称只能输入由数字、26个英文字母、下划线和或者左斜杆组成，左斜杆不能在最前面或最后面或连续出现。例一：aaa/ggg &nbsp;&nbsp; 例二：aaa </div>
                </el-form-item>
                <el-form-item label="访问需要登录" v-if="state.type != 5 && state.type != 6">
                    <el-switch v-model="state.accessRequireLogin" :disabled="state.disabled_accessRequireLogin"></el-switch>
                    <div class="form-help" >访问URI为user/开头的地址则默认需要登录后才能访问，本设置无效</div>
                    <div v-if="state.disabled_accessRequireLogin" style="color: #ffa940;">URL名称为user/开头的地址不需要设置本参数</div>
                </el-form-item>
                
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, watch } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { Templates } from '@/types';
    import { ArrowRight } from '@element-plus/icons-vue'


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        dirName :'',
        type :4,
        name :'',
        referenceCode :'',
        layoutFile: '',
        forumData: 3,
        returnData: 0,
        accessRequireLogin :false,//访问需要登录
        
        disabled_accessRequireLogin:false,
        
        
        options: [{//类型
            value: 1,
            label: '默认页'
        }, {
            value: 3,
            label: '更多'
        }, {
            value: 4,
            label: '空白页'
        }, {
            value: 5,
            label: '公共页(生成新引用页)'
        }, {
            value: 6,
            label: '公共页(引用版块值)'
        }],
        
        layoutFileOptions:[] as any,//默认布局文件
        
        templates: {} as Templates,
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        type :'',
        referenceCode: '',
        layoutFile: '',
    });

    //查询布局
    const queryLayoutList = () => {
        proxy?.$axios({
            url: '/control/layout/manage',
            method: 'get',
            params: {
                method : 'add',
			    dirName: state.dirName,
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
			    			if(key == "defaultLayoutList"){
			    				let list = mapData[key];
			    				if(list != null && list.length >0){
					    			for(let i=0; i<list.length; i++){
					    				let defaultLayout = list[i];
					    				
					    				state.layoutFileOptions.push({
					    					value: defaultLayout.layoutFile,
			        						label: defaultLayout.name,
					    					
					    				});
					    			}
					    		}
			    			}else if(key == "templates"){
			    				state.templates = mapData[key];
			    			}
			    		}
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

    //校验URL名称
    const checkUrlName = () => {
        error.referenceCode = "";


        proxy?.$axios({
            url: '/control/layout/manage',
            method: 'get',
            params: {
                method : 'checkUrlName',
                referenceCode: state.referenceCode,
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
        if(state.type != null){
            formData.append('type', String(state.type));
        }
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.referenceCode != null){
            formData.append('referenceCode', state.referenceCode);
        }
        if(state.accessRequireLogin != null){
            formData.append('accessRequireLogin', state.accessRequireLogin.toString());
        }
        
        
        if(state.layoutFile != null){
            formData.append('layoutFile', state.layoutFile);
        }
        if(state.forumData != null){
            formData.append('forumData', String(state.forumData));
        }
        if(state.returnData != null){
            formData.append('returnData', String(state.returnData));
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
            
        }

        proxy?.$axios({
            url: '/control/layout/manage?method=add',
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
							path : '/admin/control/layout/list',
							query:{ 
								dirName : state.dirName,
								page :(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')
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

        if(router.currentRoute.value.query.dirName != undefined && router.currentRoute.value.query.dirName != ''){
			state.dirName = router.currentRoute.value.query.dirName as string;
		}
		
		queryLayoutList();
    }) 

    //监听版块子类型值变化
    watch(() => state.referenceCode, (val, old) => {
        if(val.toLowerCase().startsWith("user/")){
            state.disabled_accessRequireLogin = true;
        }else{
            state.disabled_accessRequireLogin = false;
        }
   
    })
</script>