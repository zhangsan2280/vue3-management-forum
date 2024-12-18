<!-- 会员角色列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain  v-if="verifyPermissionMenu('/control/userRole/manage?method=add*','get')" @click="$router.push({path: '/admin/control/userRole/manage/add'});">添加会员角色</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="name" label="角色名称" align="center" min-width="200"></el-table-column>
                <el-table-column prop="sort" label="排序" align="center" min-width="200">
                    <template #default="scope">	
                        <span v-if="!scope.row.defaultRole" >{{scope.row.sort}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="defaultRole" label="是否默认角色" align="center"  min-width="200">
                    <template #default="scope">	
                        <el-switch v-model="scope.row.defaultRole" :disabled="!verifyPermissionMenu('/control/userRole/manage?method=setAsDefault*','post')" @change="handleDefaultRoleChange(scope.row.id,scope.row.defaultRole)"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/userRole/manage?method=edit*','get')" @click="$router.push({path: '/admin/control/userRole/manage/edit', query:{ userRoleId : scope.row.id}})">修改</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/userRole/manage?method=delete*','post')" @click="deleteUserRole($event,scope.row)">删除</el-button>
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
    import { storeToRefs } from 'pinia';
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
    });

    //处理选择默认角色
    const handleDefaultRoleChange = (id:string,defaultRole:boolean) => {
        let formData = new FormData();
        formData.append('id', id);
        formData.append('defaultRole',defaultRole.toString());

        proxy?.$axios({
            url: '/control/userRole/manage?method=setAsDefault',
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
                            message: '设置成功，默认角色自动排到最前面',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		queryUserRoleList();
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


    //查询会员角色列表
    const queryUserRoleList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/userRole/list',
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
                        let userRoleList = returnValue.data;
			    		if(userRoleList != null && userRoleList.length >0){
			    			state.tableData = userRoleList;
			    		}
                    }else if(returnValue.code === 500){//错误
                        
                        
                    }
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //删除会员角色
    const deleteUserRole = (event:any,row:any) => {
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
		    	
            formData.append('id', row.id);

            proxy?.$axios({
                url: '/control/userRole/manage?method=delete',
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
				    		queryUserRoleList();
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


        queryUserRoleList();

    }) 
</script>