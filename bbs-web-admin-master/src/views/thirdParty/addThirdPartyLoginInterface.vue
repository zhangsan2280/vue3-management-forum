<!-- 添加第三方登录接口 -->
<template>
    <div class="main" >
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/thirdPartyLoginInterface/list',query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-col :span="18"><el-input v-model.trim="state.name" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="接口产品" :required="true" :error="error.interfaceProduct">
                    <el-select v-model="state.interfaceProduct" placeholder="请选择">
                        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <div class="form-help" >每种接口只能添加一次</div>
                </el-form-item>
                <el-form-item label="微信开放平台 AppID" v-if="state.interfaceProduct ==10" :required="true" :error="error.weixin_op_appID">
                    <el-input type="textarea" v-model="state.weixin_op_appID" :autosize="{minRows: 1}" placeholder="请输入AppID" ></el-input>	
                    <div class="form-help" >微信开放平台应用唯一标识</div>
                </el-form-item>
                <el-form-item label="微信开放平台 AppSecret" v-if="state.interfaceProduct ==10" :required="true" :error="error.weixin_op_appSecret">
                    <el-input type="textarea" v-model="state.weixin_op_appSecret" :autosize="{minRows: 5}" placeholder="请输入密钥" ></el-input>	
                    <div class="form-help" >应用密钥</div>
                </el-form-item>
                <el-form-item label="微信公众号 AppID" v-if="state.interfaceProduct ==10" :required="true" :error="error.weixin_oa_appID">
                    <el-input type="textarea" v-model="state.weixin_oa_appID" :autosize="{minRows: 5}" ></el-input>	
                    <div class="form-help" >微信公众平台服务号的应用唯一标识</div>
                </el-form-item>
                <el-form-item label="微信公众号 AppSecret" v-if="state.interfaceProduct ==10" :required="true" :error="error.weixin_oa_appSecret">
                    <el-input type="textarea" v-model="state.weixin_oa_appSecret" :autosize="{minRows: 5}" ></el-input>	
                    <div class="form-help" >应用密钥</div>
                </el-form-item>
                <el-form-item label="注意" v-if="state.interfaceProduct ==10">
                    <div class="form-help" >
                        1、需要在微信公众平台的“开发 - 接口权限 - 网页服务 - 网页帐号 - 网页授权获取用户基本信息”的配置选项中，修改授权回调域名 (域名格式不需要加http://协议头)。前后端分离模式需要填写前端域名<br>		
                        2、需要在微信开放平台的“管理中心 - 开发信息 - 授权回调域”的配置选项中，修改授权回调域名 (域名格式不需要加http://协议头)。前后端分离模式需要填写前端域名<br>
                        3、需要在微信开放平台绑定公众号
                    </div>
                </el-form-item>
                
                
                <el-form-item label="其他开放平台应用ID" v-if="state.interfaceProduct ==50" :required="true" :error="error.other_appID">
                    <el-input type="textarea" v-model="state.other_appID" :autosize="{minRows: 1}" placeholder="请输入应用ID" ></el-input>	
                    <div class="form-help" >开放平台应用唯一标识</div>
                </el-form-item>
                <el-form-item label="其他开放平台应用私钥" v-if="state.interfaceProduct ==50" :required="true" :error="error.other_appSecret">
                    <el-input type="textarea" v-model="state.other_appSecret" :autosize="{minRows: 5}" placeholder="请输入应用私钥" ></el-input>	
                    <div class="form-help" >应用私钥</div>
                </el-form-item>
                
                
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-col :span="6"><el-input v-model.trim="state.sort" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="是否启用" :required="true" :error="error.enable">
                    <el-switch v-model="state.enable" ></el-switch>
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

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        name :'',
        interfaceProduct :'' as any,
        options: [] as Array<OptionsItem>,
        sort:0,
        enable:true,
        weixin_op_appID :'',
        weixin_op_appSecret :'',
        weixin_oa_appID :'',
        weixin_oa_appSecret :'',
        
        other_appID :'',
        other_appSecret :'',
      
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        interfaceProduct :'',
        sort :'',
        enable :'',
        
        weixin_op_appID :'',
        weixin_op_appSecret :'',
        weixin_oa_appID :'',
        weixin_oa_appSecret :'',
        
        other_appID :'',
        other_appSecret :'',
    });


    
    //查询添加第三方登录接口
    const queryAddThirdPartyLoginInterface = () => {

        proxy?.$axios({
            url: '/control/thirdPartyLoginInterface/manage',
            method: 'get',
            params: {
                method : 'add',
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
			    			if(key == "interfaceProductMap"){
			    				let interfaceProductMap = mapData[key];
			    				let count = 0;
				    			for(let interfaceProduct in interfaceProductMap){
				    				let obj:any =new Object();
					    	    	obj.value = interfaceProduct;
					    	    	obj.label = interfaceProductMap[interfaceProduct];
					    	    	state.options.push(obj);
					    	    	count++;
				    			}
					    		if(count == 0){
					    			error.interfaceProduct = "接口已添加完";
					    		}
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
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.interfaceProduct != null){
            formData.append('interfaceProduct', state.interfaceProduct);
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
        }
        if(state.enable != null){
            formData.append('enable', state.enable.toString());
        }
        
        if(state.weixin_op_appID != null){
            formData.append('weixin_op_appID', state.weixin_op_appID);
        }
        if(state.weixin_op_appSecret != null){
            formData.append('weixin_op_appSecret', state.weixin_op_appSecret);
        }
        if(state.weixin_oa_appID != null){
            formData.append('weixin_oa_appID', state.weixin_oa_appID);
        }
        if(state.weixin_oa_appSecret != null){
            formData.append('weixin_oa_appSecret', state.weixin_oa_appSecret);
        }
        if(state.other_appID != null){
            formData.append('other_appID', state.other_appID);
        }
        if(state.other_appSecret != null){
            formData.append('other_appSecret', state.other_appSecret);
        }

        proxy?.$axios({
            url: '/control/thirdPartyLoginInterface/manage?method=add',
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
							path : '/admin/control/thirdPartyLoginInterface/list',
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

        queryAddThirdPartyLoginInterface();
    }) 

</script>