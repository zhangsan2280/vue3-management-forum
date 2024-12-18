<!-- 栏目列表 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}]</el-breadcrumb-item>
                <el-breadcrumb-item>栏目列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/column/manage?method=add*','post')" @click="addColumnUI(null)">添加栏目</el-button>
        </div>
        <div class="data-table columnListModule" >
            <el-table ref="multipleTable" :data="state.tableData" :indent="34" tooltip-effect="dark" row-key="id" default-expand-all @cell-click="cellExpandRow"  :tree-props="{children: 'childColumn', hasChildren: 'hasChildren'}" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="栏目名称" >
                    <template #default="scope">
                        <el-icon class="icon icon-folder" v-if="scope.row.childColumn.length >0"><Folder /></el-icon>
                        <el-icon class="icon icon-file" v-if="scope.row.childColumn.length ==0"><Document /></el-icon>{{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column label="链接方式" align="center" width="200">
                    <template #default="scope">	
                        <span v-if="scope.row.linkMode == 1">无</span>
                        <span v-if="scope.row.linkMode == 2">外部URL</span>
                        <span v-if="scope.row.linkMode == 3">内部URL</span>
                        <span v-if="scope.row.linkMode == 4">空白页</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="80"></el-table-column>
                <el-table-column label="操作" align="center" width="230">
                    <template #default="scope">
                        <div class="link-group-wrapper" >
                            <el-link type="primary" :disabled="!verifyPermissionMenu('/control/column/manage?method=add*','post')" class="item" href="javascript:void(0);" @click="addColumnUI(scope.row)">添加下级栏目</el-link>
                            <el-link type="primary" :disabled="!verifyPermissionMenu('/control/column/manage?method=edit*','post')" class="item" href="javascript:void(0);" @click="editColumnUI(scope.row)">修改</el-link>
                            <el-link type="primary" :disabled="!verifyPermissionMenu('/control/column/manage?method=delete*','post')" class="item" href="javascript:void(0);" @click="deleteColumn(scope.row)">删除</el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="添加下级栏目" v-model="state.addColumnForm" class="data-form">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="栏目名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="30" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
                </el-form-item>
                <el-form-item label="链接方式" :required="true" :error="error.linkMode">
                    <el-radio-group v-model="state.linkMode">
                        <el-radio :label="1">无</el-radio>
                        <el-radio :label="2">外部URL</el-radio>
                        <el-radio :label="3">内部URL</el-radio>
                        <el-radio :label="4">空白页</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="URL地址" :required="true" :error="error.url" v-if="state.linkMode == 2 || state.linkMode == 3">
                    <el-input type="textarea" v-model.trim="state.url" :autosize="{minRows: 3}" placeholder="请输入网址" ></el-input>
                    <div class="form-help" v-if="state.linkMode == 2">请填写http或https开头的网址</div>
                    <div class="form-help" v-if="state.linkMode == 3">标识资源的字符串,不能以/为开头。如：productInfo/3.htm</div>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="submitButton" size="large" type="primary" @click="addColumn_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </span>
            </template>
        </el-dialog>
        
        <el-dialog title="修改下级栏目" v-model="state.editColumnForm" class="data-form">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="栏目名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="30" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
                </el-form-item>
                <el-form-item label="链接方式" :required="true" :error="error.linkMode">
                    <el-radio-group v-model="state.linkMode">
                        <el-radio :label="1">无</el-radio>
                        <el-radio :label="2">外部URL</el-radio>
                        <el-radio :label="3">内部URL</el-radio>
                        <el-radio :label="4">空白页</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="URL地址" :required="true" :error="error.url" v-if="state.linkMode == 2 || state.linkMode == 3">
                    <el-input type="textarea" v-model.trim="state.url" :autosize="{minRows: 3}" placeholder="请输入网址" ></el-input>		
                    <div class="form-help" v-if="state.linkMode == 2">请填写http或https开头的网址</div>
                    <div class="form-help" v-if="state.linkMode == 3">标识资源的字符串,不能以/为开头。如：productInfo/3.htm</div>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="submitButton" size="large" type="primary" @click="editColumn_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </span>
            </template>
        </el-dialog>

        
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
    import { Templates } from '@/types';
    import { ArrowRight } from '@element-plus/icons-vue'


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容

        dirName: '',
        templates: {} as Templates,//模板
        
        id : '',
        parentId: '',
        name: '',
        sort: 0,
        linkMode: 1,
        url: '',
        
        addColumnForm:false, //是否显示添加下级栏目表单
        editColumnForm:false, //是否显示修改下级栏目表单
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name: '',
        sort: '',
        linkMode: '',
        url: '',
    });

    //点击单元格展开行
    const cellExpandRow = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="栏目名称"){
            multipleTable.value!.toggleRowExpansion(row);
        }
    }

    //查询模板
    const queryTemplate = () => {
        proxy?.$axios({
            url: '/control/column/manage',
            method: 'get',
            params: {
                method:'list',
			    dirName:state.dirName,
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
			    		state.templates = returnValue.data;
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
	//查询栏目
    const queryColumnList = () => {
        state.tableData = []; 

        proxy?.$axios({
            url: '/control/column/manage',
            method: 'get',
            params: {
                method:'queryColumn',
			    dirName:state.dirName,
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
			    			state.tableData = list;
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

    //添加下级栏目UI
    const addColumnUI = (row:any) => {
        
        	
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        state.addColumnForm =true;//显示添加下级栏目表单
        	
        state.name = '';
        state.sort = 0;
        state.linkMode = 1;
        state.url = '';
        if(row == null){//根目录
            state.parentId = "";
        }else{//子目录
            state.parentId = row.id; 
        }
			
		state.submitForm_disabled = false;//提交按钮是否禁用
    }

    //添加下级栏目提交
    const addColumn_submitForm = () => {
		state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.name != null){
            formData.append('name', state.name);	
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
        }
        if(state.linkMode != null){
            formData.append('linkMode', String(state.linkMode));
        }
        if(state.url != null){
            formData.append('url', state.url);
        }
        if(state.parentId != null){
            formData.append('parentId', state.parentId);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/column/manage?method=add',
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
			    		state.addColumnForm = false;
			    		
			    		queryColumnList();	
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

    //修改栏目UI
    const editColumnUI = (row:any) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        state.editColumnForm =true;//显示添加下级栏目表单
        
        state.id = row.id;
        state.name = row.name;
        state.sort = row.sort;
        state.linkMode = row.linkMode;
        state.url = row.url;
        

        
        state.submitForm_disabled = false;//提交按钮是否禁用
    }

    //修改栏目提交
    const editColumn_submitForm = () => {
        state.submitForm_disabled = true;
			
		//清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.name != null){
            formData.append('name', state.name);	
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
        }
        if(state.linkMode != null){
            formData.append('linkMode', String(state.linkMode));
        }
        if(state.url != null){
            formData.append('url', state.url);
        }
        if(state.id != null){
            formData.append('columnId', state.id);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/column/manage?method=edit',
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
			    		state.editColumnForm = false;
			    		
			    		queryColumnList();	
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
  
    //删除
    const deleteColumn = (row:any) => {

        ElMessageBox.confirm('此操作将删除该项, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {
            //清空error的属性值
            Object.keys(error).map(key => {
                Object.assign(error, {[key] : ''});
            })

            let formData = new FormData();


		    if(state.id != null){
                formData.append('columnId', row.id);	
            }
            if(state.dirName != null){
                formData.append('dirName', state.dirName);
            }
				

        

            proxy?.$axios({
                url: '/control/column/manage?method=delete',
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
				    		queryColumnList();
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

        if(router.currentRoute.value.query.dirName != undefined && router.currentRoute.value.query.dirName != ''){
			state.dirName = router.currentRoute.value.query.dirName as string;
		}
		
		//初始化
		queryTemplate();
		queryColumnList();
    }) 

</script>
<style scoped lang="scss">
.columnListModule{
    .link-group-wrapper{
        .item{
            margin-left: 12px;
        }
    }
    .icon{
        font-size: 16px;margin-right: 5px;
    }
    .icon-folder{
        position: relative;top: 1px;
    }
    .icon-file{
        margin-left: 3px;
    }
}
</style>