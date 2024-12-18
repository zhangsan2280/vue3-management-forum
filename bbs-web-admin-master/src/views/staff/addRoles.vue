<!-- 添加角色 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/roles/list', query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank userRoleModule" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="角色名" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="40"></el-input>
                </el-form-item>
                <el-form-item label="备注"  :error="error.remarks"  >
                    <el-input type="textarea" v-model="state.remarks" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>						
                </el-form-item>
                <el-form-item label="权限" :error="error.permission" >
                    <el-table ref="tableRef" :data="state.permissionGroupList" @select="handleSelectionSelect" tooltip-effect="dark" :default-expand-all="true"  :show-header="false" style="width: 100%" empty-text="没有内容">
                        <el-table-column type="selection" :selectable="checkSelectable"></el-table-column>
                        <el-table-column label="模块" >
                            <template #default="scope">	
                                {{scope.row.module}}
                            </template>
                        </el-table-column>
                        <el-table-column type="expand" label="权限" ><!-- 因为type="expand"方式导致索引不连续,所以使用数据中设置的索引 -->
                            <template #default="scope">
                                <div class="userResource-box">
                                    <el-checkbox v-model="state.permissionIdGroup[scope.row.index][index]" :disabled="permissionObject.logonUserPermission == false" v-for="(permissionObject,index) in scope.row.permissionObjectList" @change="handleUserResourceChange(scope.row.index)">{{permissionObject.remarks}}</el-checkbox>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="form-help" >如果不选择[系统]--[后台框架]，则无法进入管理后台首页</div>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton"  @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElTable } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const tableRef = ref();

    const state = reactive({
        name :'',
        remarks :'',
        permissionGroupList :[] as any,
        permissionIdGroup:[] as any,//权限Id组(二维数组)
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        remarks :'',
        permission :'',
    });

    //处理全选单元格
    const handleSelectionSelect = (selection:any, row:any) => {
        //是否选中
        let isSelected = selection.length && selection.indexOf(row) !== -1;// true就是选中，0或者false是取消选中
        
        for (let i = 0; i <state.permissionGroupList.length; i++) {
            let permissionGroup = state.permissionGroupList[i];
            if(permissionGroup.module == row.module){
                
                if(isSelected == true){//选中
                    let permissionId_arr = state.permissionIdGroup[i];
                    if(permissionId_arr != null && permissionId_arr.length >0){
                        for (let j = 0; j <permissionId_arr.length; j++) {
                            permissionId_arr.splice(j,1,true);
                        }
                    }
                
                }else{//取消选中
                    let permissionId_arr = state.permissionIdGroup[i];
                    if(permissionId_arr != null && permissionId_arr.length >0){
                        for (let j = 0; j <permissionId_arr.length; j++) {
                            permissionId_arr.splice(j,1,false);
                        }
                    }
                }
                
                break;
            }					
        }
    }


    //处理用户权限选择
    const handleUserResourceChange = (permissionGroup_index:any) => {
        let permissionId_arr = state.permissionIdGroup[permissionGroup_index];
        if(permissionId_arr != null && permissionId_arr.length >0){
            let count = 0;
            for (let i = 0; i <permissionId_arr.length; i++) {
                if(permissionId_arr[i] == true){
                    count++;
                }
            }
            if(count == permissionId_arr.length){//如果全选
                tableRef.value.toggleRowSelection(state.permissionGroupList[permissionGroup_index],true);
            }else{
                tableRef.value.toggleRowSelection(state.permissionGroupList[permissionGroup_index],false);
            }
        }
    }
    
    //处理用户权限全选
    const handlePermissionSelectAll = () => {
        if(state.permissionGroupList != null && state.permissionGroupList.length >0){
            
            for (let i = 0; i <state.permissionGroupList.length; i++) {
                let permissionGroup = state.permissionGroupList[i];
                let count = 0;
                if(permissionGroup.permissionObjectList != null && permissionGroup.permissionObjectList.length >0){
                    for (let j = 0; j <permissionGroup.permissionObjectList.length; j++) {
                        let permissionObject = permissionGroup.permissionObjectList[j];
                        if(permissionObject.selected){
                            count++;
                        }
                    }
                    if(count == permissionGroup.permissionObjectList.length){
                        tableRef.value.toggleRowSelection(state.permissionGroupList[permissionGroup.index],true);
                    }
                }
            }
        }
    }
    //处理选择框禁止选中(若返回为 true， 则可以选中，否则禁止选中)
    const checkSelectable = (row:any) => {
        let count = 0;
        if(row.permissionObjectList != null && row.permissionObjectList.length >0){
            for (let j = 0; j <row.permissionObjectList.length; j++) {
                let permissionObject = row.permissionObjectList[j];
                if(permissionObject.logonUserPermission == false){
                    count++;
                }
            }
            if(count == row.permissionObjectList.length){
                return false;
            }		
        }
        return true;
    }

    
    //查询添加角色 
    const queryAddRole = () => {
        state.permissionIdGroup.length = 0;

        proxy?.$axios({
            url: '/control/acl/manage',
            method: 'get',
            params: {
                method : 'addRoles',
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
			    		let permissionObjectMap = returnValue.data;
			    		
			    		let permissionGroupList = [];
			    		
			    		
			    		let index =0;
		    			for(let permissionObject in permissionObjectMap){
		    				let permissionGroup:any =new Object();
    	    				permissionGroup.module = permissionObject;
    	    				permissionGroup.index = index;//因为表格使用type="expand"方式展示时，scope.$index获取的索引不连续,所以在数据里直接设置索引
		    				permissionGroup.permissionObjectList = permissionObjectMap[permissionObject];
		    				permissionGroupList.push(permissionGroup);
		    				
		    				
		    				//定义权限Id数组
							let permissionId_array = [];
							if(permissionGroup.permissionObjectList != null && permissionGroup.permissionObjectList.length >0){
								for (let j = 0; j <permissionGroup.permissionObjectList.length; j++) {
									let permissionObject = permissionGroup.permissionObjectList[j];
									permissionId_array.push(permissionObject.selected);
								}
							}
							state.permissionIdGroup[index] = permissionId_array;//把数组permissionId_array作为permissionIdGroup数组的元素传入
		    				
		    				index++;
		    			}
			    		
			    		state.permissionGroupList = permissionGroupList;
			    		nextTick(()=>{
			    			handlePermissionSelectAll();
			    		})
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
        formData.append('remarks', state.remarks);
        
        if(state.permissionIdGroup != null && state.permissionIdGroup.length >0){
            for (let i = 0; i <state.permissionIdGroup.length; i++) {
                let permissionId_arr = state.permissionIdGroup[i];
                if(permissionId_arr != null && permissionId_arr.length >0){
                    for (let j = 0; j <permissionId_arr.length; j++) {
                        if(permissionId_arr[j]){
                            let permissionGroup = state.permissionGroupList[i];
                            if(permissionGroup.permissionObjectList != null && permissionGroup.permissionObjectList.length >0){
                                let permissionObject = permissionGroup.permissionObjectList[j];
                                
                                formData.append('sysPermissionId',permissionObject.permissionId);
                                
                            }
                            
                            
                        }
                    }
                }	
            }
        }

        proxy?.$axios({
            url: '/control/acl/manage?method=addRoles',
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
							path : '/admin/control/roles/list'
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

        queryAddRole();
    }) 

</script>