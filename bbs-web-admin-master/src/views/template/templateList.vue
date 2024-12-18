<!-- 模板列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/template/manage?method=add*','get')" @click="$router.push({path: '/admin/control/template/manage/add'});">添加模板</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/template/manage?method=importTemplateList*','get')" @click="$router.push({path: '/admin/control/template/manage/importTemplateList'});">模板压缩包列表</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="name" label="模板名称" align="center" ></el-table-column>
                <el-table-column label="模板缩略图" align="center" min-width="120">
                    <template #default="scope">
                        <el-image v-if="scope.row.thumbnailSuffix != null && scope.row.thumbnailSuffix != ''" preview-teleported style="width: 120px; height: 120px" fit="contain" :src="store.apiUrl+'common/'+scope.row.dirName+'/templates.'+scope.row.thumbnailSuffix+'?time='+new Date().getTime()" :preview-src-list="[store.apiUrl+'common/'+scope.row.dirName+'/templates.'+scope.row.thumbnailSuffix+'?time='+new Date().getTime()]" hide-on-click-modal ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="dirName" label="目录名称" align="center" min-width="100"></el-table-column>
                <el-table-column prop="uses" label="当前使用中" align="center" min-width="100">
                    <template #default="scope">	
                        <el-switch v-model="state.uses[scope.$index]" :disabled="!verifyPermissionMenu('/control/template/manage?method=setTemplate*','post')" @change="handleTemplateChange(scope.row,scope.$index)"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="480">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/forumCode/list*','get')" @click="$router.push({path: '/admin/control/forumCode/list', query:{ dirName : scope.row.dirName}})">版块代码</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/resource/list*','get')" @click="$router.push({path: '/admin/control/resource/list', query:{ dirName : scope.row.dirName}})">资源</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/layout/list*','get')" @click="$router.push({path: '/admin/control/layout/list', query:{ dirName : scope.row.dirName}})">布局</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/column/manage?method=list&*','get')" @click="$router.push({path: '/admin/control/column/manage/list',query:{ dirName : scope.row.dirName}});">栏目</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/template/manage?method=export*','post')" @click="exportTemplate($event,scope.row)">导出</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/template/manage?method=edit*','get')" @click="$router.push({path: '/admin/control/template/manage/edit', query:{ dirName : scope.row.dirName}})">修改</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/template/manage?method=delete&*','post')" @click="deleteTemplate($event,scope.row)">删除</el-button>
                            </el-button-group>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
		uses:[] as Array<boolean>,
    });

    //处理选择模板
    const handleTemplateChange = (row:any,index:any) => {
        if(row.uses && !state.uses[index]){//如果不选中
            state.uses[index] = true;
            return;
        }
        
        
        
        let formData = new FormData();
        formData.append('dirName', row.dirName);

        proxy?.$axios({
            url: '/control/template/manage?method=setTemplate',
            method: 'post',
            data: formData
        })
        .then((response: AxiosResponse) => {
            if(response){

                const result: any = response.data;
            
                if(result){
                    
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功

                        ElMessage({
                            showClose: true,
                            message: '设置成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
                        queryTemplateList();
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


    //查询模板列表
    const queryTemplateList = () => {
        //清空内容
        state.tableData = []; 
		state.uses = [];


        proxy?.$axios({
            url: '/control/template/list',
            method: 'get',
            params: {
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
			    		let templateList = returnValue.data;
			    		if(templateList != null && templateList.length >0){
			    			state.tableData = templateList;
			    			for(let i=0; i<templateList.length; i++){
			    				state.uses.push(templateList[i].uses);
			    			}
			    		}
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

  
    //删除模板
    const deleteTemplate = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();


        ElMessageBox.confirm('此操作将删除该项, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    formData.append('dirName', row.dirName);

        

            proxy?.$axios({
                url: '/control/template/manage?method=delete&a=a',//a=a参数的作用是仅增加连接符&
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
                            ElMessage({
                                showClose: true,
                                message: '删除成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryTemplateList();
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

        })
        .catch(() => {
            //取消
        })
    }

    //导出模板
    const exportTemplate = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();


        ElMessageBox.confirm('此操作将导出该模板, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    formData.append('dirName', row.dirName);

            let msg = ElMessage({
                duration: 0,
                showClose: true,
                message: '导出中，请稍候....',
                type: 'warning',
                onClose: ()=>{
                    
                }
            })

            proxy?.$axios({
                url: '/control/template/manage?method=export',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
                            msg.close();//关闭

                            ElMessage({
                                showClose: true,
                                message: '导出成功，请到“模板压缩包列表查看”',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryTemplateList();
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

        })
        .catch(() => {
            //取消
        })
    }

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        queryTemplateList();
    }) 

</script>