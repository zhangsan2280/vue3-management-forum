<!-- 修改文件系统接口 -->
<template>
    <div class="main" >
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/fileSystemInterface/list',query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-col :span="18"><el-input v-model.trim="state.name" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="接口产品">
                    <span v-if="state.interfaceProduct == 10">SeaweedFS</span>
                    <span v-if="state.interfaceProduct == 20">MinIO</span>
                    <span v-if="state.interfaceProduct == 30">阿里云OSS</span>
                </el-form-item>
                
                <el-form-item label="访问密钥Id" v-if="state.interfaceProduct ==10" :required="true" :error="error.seaweedFS_accessKeyId">
                    <el-input type="textarea" v-model="state.seaweedFS_accessKeyId" :autosize="{minRows: 5}" placeholder="请输入accessKey" ></el-input>	
                    <div class="form-help" >accessKey</div>
                </el-form-item>
                <el-form-item label="签名密钥" v-if="state.interfaceProduct ==10" :required="true" :error="error.seaweedFS_secretAccessKey">
                    <el-input type="textarea" v-model="state.seaweedFS_secretAccessKey" :autosize="{minRows: 5}" placeholder="请输入secretKey" ></el-input>	
                    <div class="form-help" >secretKey</div>
                </el-form-item>
                <el-form-item label="存储空间" v-if="state.interfaceProduct ==10" >
                    bbs-bucket
                </el-form-item>
                <el-form-item label="区域" v-if="state.interfaceProduct ==10" >
                    default
                </el-form-item>
                <el-form-item label="访问存储空间类型" v-if="state.interfaceProduct ==10" :required="true" :error="error.seaweedFS_accessBucketType">
                    <el-radio-group v-model="state.seaweedFS_accessBucketType">
                        <el-radio :label="10">路径类型访问</el-radio>
                        <el-radio :label="20">虚拟托管类型访问</el-radio>
                    </el-radio-group>
                    <div class="form-help" >路径类型访问(https://s3.Region.amazonaws.com/bucket-name/key name) 虚拟托管类型访问(https://bucket-name.s3.Region.amazonaws.com/key name)</div>
                </el-form-item>
                <el-form-item v-for="(formOption, index) in state.seaweedFS_formOptions" label="访问域名" :prop="'formOptions.' + index + '.value'" v-if="state.interfaceProduct ==10" >
                        <el-col :span="16">
                            <el-input v-model.trim="formOption.value" maxlength="200"></el-input>
                        </el-col>
                        <el-col :span="6" :offset="1">
                            <el-button size="large" :icon="Top" circle @click.prevent="seaweedFS_moveUp(formOption)" title="上移"></el-button>
                            <el-button size="large" :icon="Bottom" circle @click.prevent="seaweedFS_moveDown(formOption)" title="下移"></el-button>
                            <el-button size="large" :icon="Delete" circle @click.prevent="seaweedFS_removeItem(formOption)" title="删除"></el-button>
                        </el-col>
                </el-form-item>
                <el-form-item v-if="state.interfaceProduct ==10" label=" ">
                    <el-col :span="24">
                        <div class="form-help" >格式http://IP:port  例如http://s3-1.diyhi.com或http://localhost:8333</div>
                    </el-col>
                    <el-col :span="24">
                        <div class="form-error" v-text="error.seaweedFS_endpoint"></div>
                    </el-col>
                    <el-col :span="24">
                        <el-button size="large" :icon="Plus" @click="seaweedFS_addItem">添加项</el-button>
                    </el-col>
                </el-form-item>
                
                <el-form-item label="访问密钥Id" v-if="state.interfaceProduct ==20" :required="true" :error="error.minIO_accessKeyId">
                    <el-input type="textarea" v-model="state.minIO_accessKeyId" :autosize="{minRows: 5}" placeholder="请输入accessKey" ></el-input>	
                    <div class="form-help" >accessKey</div>
                </el-form-item>
                <el-form-item label="签名密钥" v-if="state.interfaceProduct ==20" :required="true" :error="error.minIO_secretAccessKey">
                    <el-input type="textarea" v-model="state.minIO_secretAccessKey" :autosize="{minRows: 5}" placeholder="请输入secretKey" ></el-input>	
                    <div class="form-help" >secretKey</div>
                </el-form-item>
                <el-form-item label="存储空间" v-if="state.interfaceProduct ==20" >
                    bbs-bucket
                </el-form-item>
                <el-form-item label="区域" v-if="state.interfaceProduct ==20" >
                    default
                </el-form-item>
                <el-form-item label="访问存储空间类型" v-if="state.interfaceProduct ==20" :required="true" :error="error.minIO_accessBucketType">
                    <el-radio-group v-model="state.minIO_accessBucketType">
                        <el-radio :label="10">路径类型访问</el-radio>
                        <el-radio :label="20">虚拟托管类型访问</el-radio>
                    </el-radio-group>
                    <div class="form-help" >路径类型访问(https://s3.Region.amazonaws.com/bucket-name/key name) 虚拟托管类型访问(https://bucket-name.s3.Region.amazonaws.com/key name)</div>
                </el-form-item>
                <el-form-item v-for="(formOption, index) in state.minIO_formOptions" label="访问域名" :prop="'formOptions.' + index + '.value'" v-if="state.interfaceProduct ==20" >
                        <el-col :span="16">
                            <el-input v-model.trim="formOption.value" maxlength="200"></el-input>
                        </el-col>
                        <el-col :span="6" :offset="1">
                            <el-button size="large" :icon="Top" circle @click.prevent="minIO_moveUp(formOption)" title="上移"></el-button>
                            <el-button size="large" :icon="Bottom" circle @click.prevent="minIO_moveDown(formOption)" title="下移"></el-button>
                            <el-button size="large" :icon="Delete" circle @click.prevent="minIO_removeItem(formOption)" title="删除"></el-button>
                        </el-col>
                </el-form-item>
                <el-form-item v-if="state.interfaceProduct ==20" label=" ">
                    <el-col :span="24">
                        <div class="form-help" >格式http://IP:port  例如http://s3-1.diyhi.com或http://localhost:9000</div>
                    </el-col>
                    <el-col :span="24">
                        <div class="form-error" v-text="error.minIO_endpoint"></div>
                    </el-col>
                    <el-col :span="24">
                        <el-button size="large" :icon="Plus" @click="minIO_addItem">添加项</el-button>
                    </el-col>
                </el-form-item>
                
                <el-form-item label="访问密钥Id" v-if="state.interfaceProduct ==30" :required="true" :error="error.oss_accessKeyId">
                    <el-input type="textarea" v-model="state.oss_accessKeyId" :autosize="{minRows: 5}" placeholder="请输入accessKey" ></el-input>	
                    <div class="form-help" >accessKey</div>
                </el-form-item>
                <el-form-item label="签名密钥" v-if="state.interfaceProduct ==30" :required="true" :error="error.oss_accessKeySecret">
                    <el-input type="textarea" v-model="state.oss_accessKeySecret" :autosize="{minRows: 5}" placeholder="请输入secretKey" ></el-input>	
                    <div class="form-help" >secretKey</div>
                </el-form-item>
                <el-form-item label="存储空间" v-if="state.interfaceProduct ==30" :required="true" :error="error.oss_bucket">
                    <el-col :span="18"><el-input v-model="state.oss_bucket" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >Bucket 名称。需要在阿里云OSS控制台创建Bucket，本页面功能不能自动创建Bucket</div>
                </el-form-item>
                <el-form-item label="访问域名" v-if="state.interfaceProduct ==30" :required="true" :error="error.oss_endpoint">
                    <el-col :span="18"><el-input v-model="state.oss_endpoint" maxlength="80" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >Endpoint 例如 https://oss-cn-zhangjiakou.aliyuncs.com</div>
                </el-form-item>
                <el-form-item label="跨域请求的来源" v-if="state.interfaceProduct ==30" :error="error.oss_originGroup">
                    <el-input type="textarea" v-model="state.oss_originGroup" :autosize="{minRows: 5}" ></el-input>	
                    <div class="form-help" style="color: #F56C6C;">设置本参数时需要预先在阿里云OSS控制台创建好Bucket，否则本设置不能生效。如果您已在阿里云OSS控制台上设置好'跨域资源共享',则不需填写本参数</div>
                    <div class="form-help">多个域名用逗号分割 例如 https://pc.diyhi.com 或 https://pc.diyhi.com,https://wap.diyhi.com 或 https://*.diyhi.com <br>可以同时指定多个来源。配置时需带上完整的域信息，例如：http://10.X.X.100:8001或https://www.aliyun.com。注意，不要遗漏了协议名http或https，如果端口不是默认的80，还需要带上端口。域名支持*通配符，每个域名中允许最多使用一个*，例如https://*.aliyun.com。如果来源指定为*，则表示允许所有来源的跨域请求。</div>
                </el-form-item>
                <el-form-item label="媒体处理地域Id" v-if="state.interfaceProduct ==30" :error="error.oss_regionId">
                    <el-col :span="18"><el-input v-model="state.oss_regionId" maxlength="200" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >例如cn-hangzhou 可用地域 https://help.aliyun.com/document_detail/43248.html</div>
                </el-form-item>
                <el-form-item label="管道Id" v-if="state.interfaceProduct ==30" :error="error.oss_pipelineId">
                    <el-col :span="18"><el-input v-model="state.oss_pipelineId" maxlength="200" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >参数获取页面 https://mps.console.aliyun.com/pipeline/list</div>
                </el-form-item>
                <el-form-item label="MNS消息队列名称" v-if="state.interfaceProduct ==30" :error="error.oss_mnsQueueName">
                    <el-col :span="18"><el-input v-model="state.oss_mnsQueueName" maxlength="200" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >参数获取页面 https://mns.console.aliyun.com/</div>
                </el-form-item>
                <el-form-item label="MNS消息队列服务端地址" v-if="state.interfaceProduct ==30"  :error="error.oss_accountEndpoint">
                    <el-col :span="18"><el-input v-model="state.oss_accountEndpoint" maxlength="200" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >参数获取页面 https://mns.console.aliyun.com/ 点击'获取Endpoint'按钮，部署在阿里云同地域的主机建议用'私网Endpoint'，其他情况用'公网Endpoint' </div>
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
    import { Top, Bottom,Delete,Plus} from '@element-plus/icons-vue'

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        fileSystemInterfaceId :'',
			
        name :'',
        interfaceProduct :'' as any,
        options: [] as Array<OptionsItem>,
        enable:true,
        
        seaweedFS_accessKeyId :'',
        seaweedFS_secretAccessKey :'',
        seaweedFS_accessBucketType :10,
        seaweedFS_formOptions: [] as any,
        
        
        minIO_accessKeyId :'',
        minIO_secretAccessKey :'',
        minIO_accessBucketType :10,
        minIO_formOptions: [] as any,
        
        oss_accessKeyId :'',
        oss_accessKeySecret :'',
        oss_bucket :'',
        oss_endpoint :'',
        oss_originGroup :'',
        oss_regionId :'',
        oss_pipelineId :'',
        oss_mnsQueueName :'',
        oss_accountEndpoint :'',
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        interfaceProduct :'',
        enable :'',
        
        seaweedFS_accessKeyId :'',
        seaweedFS_secretAccessKey :'',
        seaweedFS_accessBucketType :'',
        seaweedFS_endpoint :'',
        
        minIO_accessKeyId :'',
        minIO_secretAccessKey :'',
        minIO_accessBucketType :'',
        minIO_endpoint :'',
        
        oss_accessKeyId :'',
        oss_accessKeySecret :'',
        oss_bucket :'',
        oss_endpoint :'',
        oss_originGroup :'',
        oss_regionId :'',
        oss_pipelineId :'',
        oss_mnsQueueName :'',
        oss_accountEndpoint :'',
    });


    
    //查询修改文件系统接口
    const queryEditFileSystemInterface = () => {

        proxy?.$axios({
            url: '/control/fileSystemInterface/manage',
            method: 'get',
            params: {
                method : 'edit',
			    fileSystemInterfaceId : state.fileSystemInterfaceId,
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
			    			if(key == "fileSystemInterface"){
			    				let fileSystemInterface = mapData[key];
			    				
			    				state.name = fileSystemInterface.name;
			    				state.interfaceProduct = fileSystemInterface.interfaceProduct;
			    				state.enable = fileSystemInterface.enable;
			    			}else if(key == "seaweedFS"){
			    				let seaweedFS = mapData[key];
			    				state.seaweedFS_accessKeyId = seaweedFS.accessKeyId;
			    				state.seaweedFS_secretAccessKey = seaweedFS.secretAccessKey;
			    				state.seaweedFS_accessBucketType = seaweedFS.accessBucketType;
			    				
			    				if(seaweedFS.endpointList != null && seaweedFS.endpointList.length >0){
			    					for (let i=0;i<seaweedFS.endpointList.length; i++) {  
			    						let endpoint = seaweedFS.endpointList[i];
				    					let item = {
									    	key: "",
											value: endpoint
							            }
				    					state.seaweedFS_formOptions.push(item);
						    	    }
			    				}
			    			}else if(key == "minIO"){
			    				let minIO = mapData[key];
			    				state.minIO_accessKeyId = minIO.accessKeyId;
			    				state.minIO_secretAccessKey = minIO.secretAccessKey;
			    				state.minIO_accessBucketType = minIO.accessBucketType;
			    				
			    				if(minIO.endpointList != null && minIO.endpointList.length >0){
			    					for (let i=0;i<minIO.endpointList.length; i++) {  
			    						let endpoint = minIO.endpointList[i];
				    					let item:any = {
									    	key: "",
											value: endpoint
							            }
				    					state.minIO_formOptions.push(item);
						    	    }
			    				}
			    			}else if(key == "oss"){
			    				let oss = mapData[key];
			    				
			    				state.oss_accessKeyId  = oss.accessKeyId;
			    				state.oss_accessKeySecret  = oss.accessKeySecret;
			    				state.oss_bucket = oss.bucket;
			    				state.oss_endpoint = oss.endpoint;
			    				state.oss_originGroup  = oss.originGroup;
			    				state.oss_regionId = oss.regionId;
			    				state.oss_pipelineId = oss.pipelineId;
			    		        state.oss_mnsQueueName = oss.mnsQueueName;
			    		        state.oss_accountEndpoint = oss.accountEndpoint;
			    				
			    				
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

    //添加项
    const seaweedFS_addItem = () => {
        state.seaweedFS_formOptions.push({
            key: '',
            value: ''
        });
    }
    //删除项
    const seaweedFS_removeItem = (formOption:any) => {
        let index = state.seaweedFS_formOptions.indexOf(formOption);
        if (index !== -1) {
            state.seaweedFS_formOptions.splice(index, 1);
        }
    }
    //上移
    const seaweedFS_moveUp = (formOption:any) => {
        let index = state.seaweedFS_formOptions.indexOf(formOption);
        if (index >0) {
            let upData = state.seaweedFS_formOptions[index - 1];
            state.seaweedFS_formOptions.splice(index - 1, 1);
            state.seaweedFS_formOptions.splice(index, 0, upData);
        }
    }
    //下移
    const seaweedFS_moveDown = (formOption:any) => {
        let index = state.seaweedFS_formOptions.indexOf(formOption);
        if ((index + 1) < state.seaweedFS_formOptions.length) {
            let downData = state.seaweedFS_formOptions[index + 1];
            state.seaweedFS_formOptions.splice(index + 1, 1);
            state.seaweedFS_formOptions.splice(index, 0, downData);
        }
    }
    
    //添加项
    const minIO_addItem = () => {
        state.minIO_formOptions.push({
            key: '',
            value: ''
        });
    }
    //删除项
    const minIO_removeItem = (formOption:any) => {
        let index = state.minIO_formOptions.indexOf(formOption);
        if (index !== -1) {
            state.minIO_formOptions.splice(index, 1);
        }
    }
    //上移
    const minIO_moveUp = (formOption:any) => {
        let index = state.minIO_formOptions.indexOf(formOption);
        if (index >0) {
            let upData = state.minIO_formOptions[index - 1];
            state.minIO_formOptions.splice(index - 1, 1);
            state.minIO_formOptions.splice(index, 0, upData);
        }
    }
    //下移
    const minIO_moveDown = (formOption:any) => {
        let index = state.minIO_formOptions.indexOf(formOption);
        if ((index + 1) < state.minIO_formOptions.length) {
            let downData = state.minIO_formOptions[index + 1];
            state.minIO_formOptions.splice(index + 1, 1);
            state.minIO_formOptions.splice(index, 0, downData);
        }
    }

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('fileSystemInterfaceId', state.fileSystemInterfaceId);
			
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.enable != null){
            formData.append('enable', state.enable.toString());
        }
        
        
        if(state.seaweedFS_accessKeyId != null){
            formData.append('seaweedFS_accessKeyId', state.seaweedFS_accessKeyId);
        }
        if(state.seaweedFS_secretAccessKey != null){
            formData.append('seaweedFS_secretAccessKey', state.seaweedFS_secretAccessKey);
        }
        if(state.seaweedFS_accessBucketType != null){
            formData.append('seaweedFS_accessBucketType', String(state.seaweedFS_accessBucketType));
        }
        if(state.seaweedFS_formOptions != null && state.seaweedFS_formOptions.length >0){
            for(let i=0; i<state.seaweedFS_formOptions.length; i++){
                let formOption = state.seaweedFS_formOptions[i];
                formData.append('seaweedFS_endpoint', formOption.value);
            }
        }
    
        if(state.minIO_accessKeyId != null){
            formData.append('minIO_accessKeyId', state.minIO_accessKeyId);
        }
        if(state.minIO_secretAccessKey != null){
            formData.append('minIO_secretAccessKey', state.minIO_secretAccessKey);
        }
        if(state.minIO_accessBucketType != null){
            formData.append('minIO_accessBucketType', String(state.minIO_accessBucketType));
        }
        if(state.minIO_formOptions != null && state.minIO_formOptions.length >0){
            for(let i=0; i<state.minIO_formOptions.length; i++){
                let formOption = state.minIO_formOptions[i];
                formData.append('minIO_endpoint', formOption.value);
            }
        }
        
        if(state.oss_accessKeyId != null){
            formData.append('oss_accessKeyId', state.oss_accessKeyId);
        }
        if(state.oss_accessKeySecret != null){
            formData.append('oss_accessKeySecret', state.oss_accessKeySecret);
        }
        if(state.oss_bucket != null){
            formData.append('oss_bucket', state.oss_bucket);
        }
        if(state.oss_endpoint != null){
            formData.append('oss_endpoint', state.oss_endpoint);
        }
        if(state.oss_originGroup != null){
            formData.append('oss_originGroup', state.oss_originGroup);
        }
        if(state.oss_regionId != null){
            formData.append('oss_regionId', state.oss_regionId);
        }
        if(state.oss_pipelineId != null){
            formData.append('oss_pipelineId', state.oss_pipelineId);
        }
        if(state.oss_mnsQueueName != null){
            formData.append('oss_mnsQueueName', state.oss_mnsQueueName);
        }
        if(state.oss_accountEndpoint != null){
            formData.append('oss_accountEndpoint', state.oss_accountEndpoint);
        }

        proxy?.$axios({
            url: '/control/fileSystemInterface/manage?method=edit',
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
							path : '/admin/control/fileSystemInterface/list',
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

        if(router.currentRoute.value.query.fileSystemInterfaceId != undefined && router.currentRoute.value.query.fileSystemInterfaceId != ''){
			state.fileSystemInterfaceId = router.currentRoute.value.query.fileSystemInterfaceId as string;
		}
		
		queryEditFileSystemInterface();
    }) 

</script>