<!-- 修改短信接口 -->
<template>
    <div class="main" >
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/smsInterface/list',query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-col :span="18"><el-input v-model.trim="state.name" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="接口产品">
                    <span v-if="state.interfaceProduct == 1">阿里云通信</span>
                </el-form-item>
                <el-form-item label="用户密钥Id(accessKeyId)" v-if="state.interfaceProduct ==1" :required="true" :error="error.alidayu_accessKeyId">
                    <el-input type="textarea" v-model="state.alidayu_accessKeyId" :autosize="{minRows: 1}" placeholder="请输入密钥" ></el-input>	
                    <div class="form-help" >
                        <a href="/backstage/images/help/alidayu_accessKey.jpg" target="_blank">获取方法演示</a>
                    </div>
                </el-form-item>
                <el-form-item label="用户密钥(accessKeySecret)" v-if="state.interfaceProduct ==1" :required="true" :error="error.alidayu_accessKeySecret">
                    <el-input type="textarea" v-model="state.alidayu_accessKeySecret" :autosize="{minRows: 1}" placeholder="请输入密钥" ></el-input>	
                    <div class="form-help" >
                        <a href="/backstage/images/help/alidayu_accessKey.jpg" target="_blank">获取方法演示</a>
                    </div>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-col :span="6"><el-input v-model.trim="state.sort" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                
                <div class="data-view" v-for="(sendService,index) in state.sendServiceList">
                    <el-form-item v-if="sendService.interfaceProduct == 1 && state.interfaceProduct ==1">
                        {{sendService.serviceName}}
                    </el-form-item>
                    <el-form-item label="短信签名" v-if="sendService.interfaceProduct == 1 && state.interfaceProduct ==1" :required="true" :error="error.alidayu_signName.get(sendService.interfaceProduct+'_'+sendService.serviceId)">
                        <el-col :span="18"><el-input v-model.trim="state.alidayu_signName[index]" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                        <div class="form-help" >阿里云管理控制台审核通过的短信签名</div>
                    </el-form-item>
                    <el-form-item label="短信模板代码" v-if="sendService.interfaceProduct == 1 && state.interfaceProduct ==1" :required="true" :error="error.alidayu_templateCode.get(sendService.interfaceProduct+'_'+sendService.serviceId)">
                        <el-col :span="18"><el-input v-model.trim="state.alidayu_templateCode[index]" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                        <div class="form-help" >例如：SMS_1000000</div>
                    </el-form-item>
                    
                    <el-form-item label="支持变量" v-if="sendService.interfaceProduct == 1 && state.interfaceProduct ==1" class="table-container">
                        <el-table ref="table" :data="sendService.alidayu_variable" tooltip-effect="dark" :show-header="false" stripe style="width: 100%" empty-text="没有变量">
                            <el-table-column label="变量" >
                                <template #default="scope">	
                                    {{scope.row.key}}
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" >
                                <template #default="scope">	
                                    {{scope.row.value}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </div>
                
                
                
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
    import { processErrorInfo,processErrorInfo_sms } from '@/utils/tool';
    import { SendService } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        smsInterfaceId:'',
        sendServiceList:[] as Array<SendService>,
        
        name :'',
        interfaceProduct :'' as any,
        options: [] as Array<OptionsItem>,
        sort:0,
        alidayu_accessKeyId :'',
        alidayu_accessKeySecret :'',
        alidayu_signName:[] as Array<string>,
        alidayu_templateCode:[] as Array<string>,
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        sort :'',
        alidayu_accessKeyId :'',
        alidayu_accessKeySecret :'',
        alidayu_signName : new Map(),
        alidayu_templateCode : new Map(),
    });


    
    //查询修改短信接口
    const queryEditSmsInterface = () => {

        proxy?.$axios({
            url: '/control/smsInterface/manage',
            method: 'get',
            params: {
                method : 'edit',
			    smsInterfaceId : state.smsInterfaceId,
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
			    			if(key == "sendServiceList"){
			    				let sendServiceList = mapData[key];
			    				if(sendServiceList != null && sendServiceList.length >0){
			    					for(let i=0; i<sendServiceList.length; i++){
			    						let sendService = sendServiceList[i];
			    						state.alidayu_signName.push(sendService.alidayu_signName);
			    						state.alidayu_templateCode.push(sendService.alidayu_templateCode);
			    						
			    						let variable = sendService.alidayu_variable;
			    						let variableList = [];
			    						for(let key in variable){//Map转为List
			    							let obj:any =new Object();
							    	    	obj.key = key;
							    	    	obj.value = variable[key];
							    	    	variableList.push(obj);
			    						}
			    						sendService.alidayu_variable = variableList;
			    					}
			    				}
			    				state.sendServiceList = sendServiceList;
			    			}else if(key == "smsInterface"){
			    				let smsInterface = mapData[key];
			    				
			    				state.name = smsInterface.name;
			    				state.interfaceProduct = smsInterface.interfaceProduct;
			    				state.sort = smsInterface.sort;
			    			}else if(key == "alidayu"){
			    				let alidayu = mapData[key];
			    				state.alidayu_accessKeyId = alidayu.accessKeyId;
			    				state.alidayu_accessKeySecret = alidayu.accessKeySecret;
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
        for (const [key, value] of Object.entries(error) as [string, string|Map<string,string>][]){
            if(value instanceof Map){
                value.clear();
            }else{
                Object.assign(error, {[key] : ''});
            }
        }

        let formData = new FormData();
        formData.append('smsInterfaceId', state.smsInterfaceId);
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
        }
        if(state.alidayu_accessKeyId != null){
            formData.append('alidayu_accessKeyId', state.alidayu_accessKeyId);
        }
        if(state.alidayu_accessKeySecret != null){
            formData.append('alidayu_accessKeySecret', state.alidayu_accessKeySecret);
        }
        
        if(state.sendServiceList != null && state.sendServiceList.length >0){
            for(let i=0; i<state.sendServiceList.length; i++){
                let sendService = state.sendServiceList[i];
                
                formData.append('alidayu_signName_'+sendService.interfaceProduct+"_"+sendService.serviceId, state.alidayu_signName[i]);
                formData.append('alidayu_templateCode_'+sendService.interfaceProduct+"_"+sendService.serviceId, state.alidayu_templateCode[i]);
            }
        }

        proxy?.$axios({
            url: '/control/smsInterface/manage?method=edit',
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
							path : '/admin/control/smsInterface/list',
							query:{ page:(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')}
						});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo_sms(returnValue.data as Map<string,string> , error,()=>{});

			    		
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

        if(router.currentRoute.value.query.smsInterfaceId != undefined && router.currentRoute.value.query.smsInterfaceId != ''){
			state.smsInterfaceId = router.currentRoute.value.query.smsInterfaceId as string;
		}
		
		queryEditSmsInterface();
    }) 

</script>