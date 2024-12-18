<!-- 压缩文件打包 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain  @click="$router.push({path: '/admin/control/filePackage/list'})">返回</el-button>
        </div>
        <div class="data-form label-width-blank packageModule" >
            <div class="headInfo">
                <div class="title">选择要打包的目录或文件</div>
            </div>
            <el-tree ref="tree_ref" :props="props" :indent="23" :load="loadNode" lazy show-checkbox>
                <template #default="scope">
                    <i class="icon icon-folder el-icon-folder" v-if="scope.node.data.leaf == false"></i>
                    <i class="icon icon-file el-icon-document" v-if="scope.node.data.leaf == true"></i>
                    <span>{{scope.node.label}}</span>
                </template>
            </el-tree>
            <el-form @submit.native.prevent>
                <el-form-item :error="error.package">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">打包</el-button>
                    <div class="prompt">注意：根目录/WEB-INF/data/filePackage  下的文件将不打包</div>
                </el-form-item>
            </el-form>
        </div>
        
        
    
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const tree_ref = ref()

    const props = defineProps({
        label: {
            type: String,
            default: 'name'
        },
        children: {
            type: String,
            default: 'zones'
        },
        isLeaf: {
            type: String,
            default: 'leaf'
        },
        parentId2: {
            type: String,
            default: 'parentId'
        }
    })
    const state = reactive({
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        package: '',
    });

    //加载子节点
    const loadNode = async (node:any, resolve:any) => {

        let parentId = "";
			
        if (node.level > 0) {//如果不是根节点
            if(node.data != undefined){
                parentId = node.data.id;
            }
        }
        let return_resourceList = [] as any;

        await proxy?.$axios({
            url: '/control/filePackage/manage',
            method: 'get',
            params: {
                method: 'querySubdirectory',
			    parentId :parentId,
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
			    		let list = returnValue.data;
			    		if(list != null && list.length >0){
			    			return_resourceList = list;
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
        resolve(return_resourceList);
    }

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        
        
        if(tree_ref.value.getCheckedNodes().length ==0){
            ElMessage({
                showClose: true,
                message: '请选择要打包的目录或文件',
                type: 'error',
                onClose: ()=>{
                    
                }
            })
            state.submitForm_disabled = false;
        }
        
        for(let i=0; i<tree_ref.value.getCheckedNodes().length; i++){
            let node = tree_ref.value.getCheckedNodes()[i];
            formData.append('idGroup', node.id);
        }

        proxy?.$axios({
            url: '/control/filePackage/manage?method=package',
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
                            message: '提交成功,正在异步打包',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
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
<style scoped lang="scss">
/* 压缩文件打包 */
:deep(.packageModule){
    .headInfo{
        margin-top: 6px; 
        margin-left:8px; 
        margin-right:8px; 
        border-bottom:1px solid #eee;
        padding-bottom:4px; 
        margin-bottom:10px;
        text-align: center; 
        .title{
            margin-left:4px;
            font-size: 16px;
            line-height:26px;
            color:#909399;
            padding:6px 0;
        }
    }
    .el-tree-node__content{
        height: 30px;
    }
    .el-icon{
        color: #C0C4CC;
    }
    .icon{
        font-size: 16px;margin-right: 5px;
    }
    .icon-folder{
        position: relative;top: 1px;
    }
    .icon-file{
        margin-left: 0px;
    }
    .prompt{
        width: 100%;
        line-height: 34px;
        color: #F56C6C;
    }
}
</style>