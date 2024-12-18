<!-- 修改在线支付接口 -->
<template>
    <div class="main" >
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/onlinePaymentInterface/list',query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-col :span="18"><el-input v-model.trim="state.name" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="接口产品">
                    <span v-if="state.interfaceProduct == 1">支付宝即时到账</span>
                    <span v-if="state.interfaceProduct == 4">支付宝手机网站(alipay.trade.wap.pay)</span>
                </el-form-item>
                <el-form-item label="APPID" v-if="state.interfaceProduct ==1" :required="true" :error="error.direct_app_id">
                    <el-input type="textarea" v-model="state.direct_app_id" :autosize="{minRows: 1}" placeholder="请输入APPID" ></el-input>	
                    <div class="form-help" >应用的APPID</div>
                </el-form-item>
                <el-form-item label="商户签名算法类型" v-if="state.interfaceProduct ==1" >
                    RSA2(2048位)
                </el-form-item>
                <el-form-item label="商户的私钥(pkcs8格式)" v-if="state.interfaceProduct ==1" :required="true" :error="error.direct_rsa_private_key">
                    <el-input type="textarea" v-model="state.direct_rsa_private_key" :autosize="{minRows: 5}" placeholder="请输入私钥" ></el-input>	
                </el-form-item>
                <el-form-item label="支付宝公钥" v-if="state.interfaceProduct ==1" :required="true" :error="error.direct_alipay_public_key">
                    <el-input type="textarea" v-model="state.direct_alipay_public_key" :autosize="{minRows: 5}" placeholder="请输入支付宝公钥" ></el-input>	
                    <div class="form-help" >查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥</div>
                </el-form-item>
                
                
                <el-form-item label="APPID" v-if="state.interfaceProduct ==4" :required="true" :error="error.mobile_app_id">
                    <el-input type="textarea" v-model="state.mobile_app_id" :autosize="{minRows: 1}" placeholder="请输入APPID" ></el-input>	
                    <div class="form-help" >应用的APPID</div>
                </el-form-item>
                <el-form-item label="商户签名算法类型" v-if="state.interfaceProduct ==4" >
                    RSA2(2048位)
                </el-form-item>
                <el-form-item label="商户的私钥(pkcs8格式)" v-if="state.interfaceProduct ==4" :required="true" :error="error.mobile_rsa_private_key">
                    <el-input type="textarea" v-model="state.mobile_rsa_private_key" :autosize="{minRows: 5}" placeholder="请输入私钥" ></el-input>	
                </el-form-item>
                <el-form-item label="支付宝公钥" v-if="state.interfaceProduct ==4" :required="true" :error="error.mobile_alipay_public_key">
                    <el-input type="textarea" v-model="state.mobile_alipay_public_key" :autosize="{minRows: 5}" placeholder="请输入支付宝公钥" ></el-input>	
                    <div class="form-help" >查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥</div>
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

    const state = reactive({
        onlinePaymentInterfaceId :'',
			
        name :'',
        interfaceProduct :'' as any,
        sort:0,
        enable:true,
        
        direct_app_id :'',
        direct_rsa_private_key :'',
        direct_alipay_public_key :'',
        
        mobile_app_id :'',
        mobile_rsa_private_key :'',
        mobile_alipay_public_key :'',
        
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        interfaceProduct :'',
        sort :'',
        enable :'',
        
        direct_app_id :'',
        direct_rsa_private_key :'',
        direct_alipay_public_key :'',
        
        mobile_app_id :'',
        mobile_rsa_private_key :'',
        mobile_alipay_public_key :'',
    });


    
    //查询修改在线支付接口
    const queryEditOnlinePaymentInterface = () => {

        proxy?.$axios({
            url: '/control/onlinePaymentInterface/manage',
            method: 'get',
            params: {
                method : 'edit',
			    onlinePaymentInterfaceId: state.onlinePaymentInterfaceId,
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
			    			if(key == "onlinePaymentInterface"){
			    				let onlinePaymentInterface = mapData[key];
			    				
			    				state.name = onlinePaymentInterface.name;
			    				state.interfaceProduct = onlinePaymentInterface.interfaceProduct;
			    				state.sort = onlinePaymentInterface.sort;
			    				state.enable = onlinePaymentInterface.enable;
			    			}else if(key == "alipayDirect"){
			    				let alipayDirect = mapData[key];
			    				state.direct_app_id = alipayDirect.app_id;
			    				state.direct_rsa_private_key = alipayDirect.rsa_private_key;
			    				state.direct_alipay_public_key = alipayDirect.alipay_public_key;
			    			}else if(key == "alipayMobile"){
			    				let alipayMobile = mapData[key];
			    				state.mobile_app_id = alipayMobile.app_id;
			    				state.mobile_rsa_private_key = alipayMobile.rsa_private_key;
			    				state.mobile_alipay_public_key = alipayMobile.alipay_public_key;
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
        formData.append('onlinePaymentInterfaceId', state.onlinePaymentInterfaceId);
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.interfaceProduct != null){
            formData.append('interfaceProduct', String(state.interfaceProduct));
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
        }
        if(state.enable != null){
            formData.append('enable', state.enable.toString());
        }
        if(state.direct_app_id != null){
            formData.append('direct_app_id', state.direct_app_id);
        }
        if(state.direct_rsa_private_key != null){
            formData.append('direct_rsa_private_key',state.direct_rsa_private_key);
        }
        if(state.direct_alipay_public_key != null){
            formData.append('direct_alipay_public_key', state.direct_alipay_public_key);
        }
        
        if(state.mobile_app_id != null){
            formData.append('mobile_app_id', state.mobile_app_id);
        }
        if(state.mobile_rsa_private_key != null){
            formData.append('mobile_rsa_private_key', state.mobile_rsa_private_key);
        }
        if(state.mobile_alipay_public_key != null){
            formData.append('mobile_alipay_public_key', state.mobile_alipay_public_key);
        }

        proxy?.$axios({
            url: '/control/onlinePaymentInterface/manage?method=edit&a=a',//a=a参数的作用是仅增加连接符&
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
							path : '/admin/control/onlinePaymentInterface/list',
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

        if(router.currentRoute.value.query.onlinePaymentInterfaceId != undefined && router.currentRoute.value.query.onlinePaymentInterfaceId != ''){
			state.onlinePaymentInterfaceId = router.currentRoute.value.query.onlinePaymentInterfaceId as string;
		}
		
		queryEditOnlinePaymentInterface();
    }) 

</script>