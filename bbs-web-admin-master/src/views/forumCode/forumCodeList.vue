<!-- 版块代码 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}]</el-breadcrumb-item>
                <el-breadcrumb-item>版块代码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="data-table forumCodeListModule" >
            <el-table ref="multipleTable" :data="state.tableData" :indent="34" tooltip-effect="dark" row-key="nodeId" :expand-row-keys="state.defaultExpandRow" @cell-click="cellExpandRow" :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="nodeName" label="版块" ></el-table-column>
                <el-table-column label="最后修改时间" align="center" width="200">
                    <template #default="scope">	
                        <div v-if="scope.row.pc_lastTime != null && scope.row.pc_lastTime != ''">电脑版 {{scope.row.pc_lastTime}}</div>
                        <div v-if="scope.row.wap_lastTime != null && scope.row.wap_lastTime != ''">手机版 {{scope.row.wap_lastTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="添加版块代码" align="center" width="130">
                    <template #default="scope">	
                        <el-link type="primary" :disabled="!verifyPermissionMenu('/control/forumCode/manage?method=add*','post')" href="javascript:void(0);" @click="addForumCodeUI($event,scope.row)" v-if="scope.row.prefix != null && scope.row.prefix != ''">添加版块代码</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="220">
                    <template #default="scope">
                        <div class="link-group-wrapper" v-if="(scope.row.prefix == null || scope.row.prefix == '') && scope.row.childNode.length ==0">
                            <el-link type="primary" class="item" :disabled="!verifyPermissionMenu('/control/forumCode/manage?method=forumSource&*','get')" href="javascript:void(0);" @click="editForumSourceUI($event,scope.row)">源码编辑</el-link>
                            <el-link type="primary" class="item" :disabled="!verifyPermissionMenu('/control/forumCode/manage?method=edit*','post')" href="javascript:void(0);" @click="editForumCodeUI($event,scope.row)">修改</el-link>
                            <el-link type="primary" class="item" :disabled="!verifyPermissionMenu('/control/forumCode/manage?method=delete*','post')" href="javascript:void(0);" @click="deleteForumCode($event,scope.row)">删除</el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        
        <el-dialog title="添加版块代码" v-model="state.addForumCodeForm" class="data-form">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="模板名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="50" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="模板显示类型" :required="true" :error="error.displayType">
                    <el-select v-model="state.displayType" @change="selectedTag"  placeholder="选择标签">
                        <el-option v-for="item in state.displayType_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" :error="error.remark">
                    <el-input type="textarea" v-model="state.remark" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="submitButton" size="large" type="primary" @click="addForumCode_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </span>
            </template>
        </el-dialog>
        
        <el-dialog title="修改版块代码" v-model="state.editForumCodeForm" class="data-form">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="模板名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="50" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="模板显示类型" :required="true" :error="error.displayType">
                    <el-select v-model="state.displayType" @change="selectedTag" placeholder="选择标签">
                        <el-option v-for="item in state.displayType_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" :error="error.remark">
                    <el-input type="textarea" v-model="state.remark" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="submitButton" size="large" type="primary" @click="editForumCode_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </span>
            </template>
        </el-dialog>
        
        <el-dialog title="源码编辑" v-model="state.editForumSourceForm" :before-close="handleEditForumSourceFormClose" width="100%" :fullscreen="true" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
            <div class="editForumSourceModule">
                <div class="forumSource-container">
                    <el-row >
                        <el-col :span="24"><div class="nodeName">{{state.nodeName}}.html</div></el-col>
                    </el-row>
                    
                    
                    <el-tabs v-model="state.activeName" @tab-click="handleEditForumSourceFormClick">
                        <el-tab-pane label="电脑版" name="pc">
                            <div class="code" >
                                <textarea ref="pc_code_ref" v-if="state.isPCHtmlExist">{{state.pc_html}}</textarea>
                                <div class="notExistPrompt" v-if="!state.isPCHtmlExist">电脑版 {{state.nodeName}}.html 文件不存在</div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="移动版" name="wap">
                            <div class="code">
                                <textarea ref="wap_code_ref" v-if="state.isWapHtmlExist">{{state.wap_html}}</textarea>
                                <div class="notExistPrompt" v-if="!state.isWapHtmlExist">移动版 {{state.nodeName}}.html 文件不存在</div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    
                    
                    <el-row>
                        <el-col :span="24">
                                <el-button class="submitButton" type="primary" size="large" @click="editForumSource_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-row >
                    <el-col :span="24">
                        <div class="doc">
                            <el-tabs v-model="state.activeDoc" type="card"  @tab-click="handleDocClick" size="large">
                                <el-tab-pane label="文档参数" name="example">
                                    <div ref="example_doc_ref" v-html="state.example"></div>
                                </el-tab-pane>
                                <el-tab-pane label="公共API" name="common">
                                    <div ref="common_doc_ref" v-html="state.common"></div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, markRaw, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';
    import { Templates } from '@/types';
    import { ArrowRight } from '@element-plus/icons-vue';
    import CodeMirror from "codemirror";
    import "codemirror/lib/codemirror.css";
    import "codemirror/mode/xml/xml";
    import "codemirror/mode/javascript/javascript";
    import "codemirror/mode/css/css";
    import "codemirror/mode/htmlmixed/htmlmixed";
    import "codemirror/mode/vue/vue";


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const example_doc_ref = ref()
    const common_doc_ref = ref()
    const pc_code_ref = ref()
    const wap_code_ref = ref()
   

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        nodeId:'' as any,
        tableData: [] as any,//表格内容
        defaultExpandRow: [] as any,//默认展开行

        dirName: '',
        templates: {} as Templates,//模板
        
        addForumCodeForm:false, //是否显示添加版块代码表单
        editForumCodeForm:false, //是否显示修改版块代码表单
        editForumSourceForm:false,//是否显示源码编辑表单
        parentId: '',
        parentNodeName: '',
        nodeName: '',
        name: '',//模板名称
        oldFileName: '',//旧模板名称
        displayType: '',//模板显示类型
        displayType_options:[] as Array<OptionsItem>,
        remark: '',//备注
        submitForm_disabled:false,//提交按钮是否禁用
        
    //	pc_code:'',//代码
    //	wap_code:'',//代码
        activeName : 'pc',//源码表单标签选择
        activeDoc : 'example',//文档选择common
        example: '',
        common: '',
        pc_html: '',
        wap_html: '',
        editor_pc:'' as any,
        editor_wap:'' as any,
        isPCHtmlExist:false,//是否存在电脑版html文件
        isWapHtmlExist:false,//是否存在手机版html文件
        example_editor:[] as any,
        common_editor:[] as any
    });
    const error = reactive({
        name: '',
        displayType: '',
        remark: '',
    });

    //点击单元格展开行
    const cellExpandRow = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="版块"){
            multipleTable.value!.toggleRowExpansion(row);
        }
    }

    //选中标签
    const selectedTag = (val:any) => {
        
    }

    //添加版块代码UI
    const addForumCodeUI = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();
        
        
        state.addForumCodeForm =true;//显示添加版块代码表单
        state.displayType_options = [];
        if(row.displayType != null && row.displayType.length >0){
            for(var i = 0 ; i < row.displayType.length; i++){
                //默认选中第一个
                if(i == 0){
                    state.displayType = row.displayType[i];
                }
                
                state.displayType_options.push({
                    value: row.displayType[i],
                    label: row.displayType[i]
                });
            }
        }else{
            state.displayType = "";
            state.displayType_options = [];
        }
        state.parentId = row.nodeId;
        state.nodeName= row.nodeName;
        
        state.name = "";
        state.remark = "";
        
        state.submitForm_disabled = false;//提交按钮是否禁用
    }

    //添加版块代码
    const addForumCode_submitForm = () => {
        state.submitForm_disabled = true;
			
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.parentId != null){
            formData.append('parentId', state.parentId);	
        }
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.displayType != null){
            formData.append('displayType', state.displayType);
        }
        if(state.remark != null){
            formData.append('remark',state.remark);
        }
        if(state.dirName != null){
            formData.append('dirName',state.dirName);
        }

        proxy?.$axios({
            url: '/control/forumCode/manage?method=add',
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
			    		
			    		state.addForumCodeForm = false;
			    		queryForumCode(state.nodeName);
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

    //修改版块代码UI
    const editForumCodeUI = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();
        
        var name_arr = new Array(); //定义一数组 
        name_arr = row.nodeName.split("_");
        var name_arr_length = name_arr.length;	
        var displayType = name_arr[name_arr_length-2];
        var displayTypeValue = "";
        if(displayType == "monolayer"){
            displayTypeValue = "单层";
        }else if(displayType == "multilayer"){
            displayTypeValue = "多层";
        }else if(displayType == "page"){
            displayTypeValue = "分页";
        }else if(displayType == "entityBean"){
            displayTypeValue = "实体对象";
        }else if(displayType == "collection"){
            displayTypeValue = "集合";
        }
        
        state.name = name_arr[name_arr_length-1];
        state.remark = row.remark;
        state.parentId = "";
        state.parentNodeName = "";
        
        state.editForumCodeForm =true;//显示添加版块代码表单
        state.displayType = "";
        state.displayType_options = [];
        let parent_displayType = [];
        for(let i=0; i<state.tableData.length; i++){
            let table = state.tableData[i];
            if(table.childNode != null && table.childNode.length >0){
                for(let j=0; j<table.childNode.length; j++){
                    let childTable = table.childNode[j];
                    for(let k=0; k<childTable.childNode.length; k++){
                        let forumCodeTable = childTable.childNode[k];
                        
                        if(forumCodeTable.nodeId == row.nodeId){
                            parent_displayType = childTable.displayType;
                            state.parentId = childTable.nodeId;
                            state.parentNodeName = childTable.nodeName;
                            break;
                        }
                    }
                }
            }
        }
        
        
        
        if(parent_displayType != null && parent_displayType.length >0){
            for(var i = 0; i < parent_displayType.length; i++){
                if(parent_displayType[i] == displayTypeValue){
                    state.displayType = displayTypeValue;
                }
            
                state.displayType_options.push({
                    value: parent_displayType[i],
                    label: parent_displayType[i]
                });
            }
        }
        
        state.nodeId = row.nodeId;
        state.oldFileName= row.nodeName;
        
        
        state.submitForm_disabled = false;//提交按钮是否禁用

    }

    //修改版块代码
    const editForumCode_submitForm = () => {
        state.submitForm_disabled = true;
			
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();
        if(state.nodeId != null){
            formData.append('nodeId', state.nodeId);	
        }
        if(state.parentId != null){
            formData.append('parentId', state.parentId);	
        }
        if(state.oldFileName != null){
            formData.append('oldFileName', state.oldFileName);	
        }
        
        
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.displayType != null){
            formData.append('displayType', state.displayType);
        }
        if(state.remark != null){
            formData.append('remark', state.remark);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/forumCode/manage?method=edit',
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
			    		state.editForumCodeForm = false;
			    		queryForumCode( state.parentNodeName);
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

    //查询版块目录
    const queryForumDirectory = () => {
        //清空内容
        state.tableData = []; 

        proxy?.$axios({
            url: '/control/forumCode/query',
            method: 'get',
            params: {
                method :'directory',
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
			    		let forumCodeNodeList = returnValue.data;
			    		if(forumCodeNodeList != null && forumCodeNodeList.length >0){
			    			for(let i=0; i<forumCodeNodeList.length; i++){
			    				let forumCodeNode = forumCodeNodeList[i];
			    				
			    				state.defaultExpandRow.push(String(forumCodeNode.nodeId));
			    				
			    			}
			    		}
			    		state.tableData = forumCodeNodeList;
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

    //查询版块代码
    const queryForumCode = (childNodeName:string) => {
        proxy?.$axios({
            url: '/control/forumCode/query',
            method: 'get',
            params: {
                method :'forumCode',
                dirName:state.dirName,
                childNodeName:childNodeName
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
			    		let forumCodeNodeList = returnValue.data;
			    		for(let i=0; i<state.tableData.length; i++){
							let table = state.tableData[i];
							if(table.childNode != null && table.childNode.length >0){
								for(let j=0; j<table.childNode.length; j++){
									let childTable = table.childNode[j];
									if(childTable.nodeName == childNodeName){
										childTable.childNode = forumCodeNodeList;
										
									}
								}
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
	//查询模板
    const queryTemplate = () => {

        proxy?.$axios({
            url: '/control/forumCode/list',
            method: 'get',
            params: {
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

    
    //删除版块代码
    const deleteForumCode = (event:any,row:any) => {
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

            formData.append('nodeName', row.nodeName);
		    formData.append('dirName', state.dirName);
        

            proxy?.$axios({
                url: '/control/forumCode/manage?method=delete',
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
				    		for(let i=0; i<state.tableData.length; i++){
								let table = state.tableData[i];
								if(table.childNode != null && table.childNode.length >0){
									for(let j=0; j<table.childNode.length; j++){
										let childTable = table.childNode[j];
										for(let k=0; k<childTable.childNode.length; k++){
											let forumCodeTable = childTable.childNode[k];
											
											if(forumCodeTable.nodeId == row.nodeId){
												queryForumCode(childTable.nodeName);
												break;
											}
										}
									}
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

        })
        .catch(() => {
            //取消
        })
    }
    //源码编辑UI
    const editForumSourceUI = (event:any,row:any) => {
        state.editForumSourceForm = true;
    	state.nodeName = row.nodeName;

        proxy?.$axios({
            url: '/control/forumCode/manage',
            method: 'get',
            params: {
                method:'forumSource',
			    dirName:state.dirName,
			    nodeName:row.nodeName,
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
			    			if(key == "example"){
			    				state.example = mapData[key];   				
			    			}else if(key == "common"){
			    				state.common = mapData[key];
			    			}else if(key == "pc_html"){
			    				state.pc_html = mapData[key];
			    			}else if(key == "wap_html"){
			    				state.wap_html = mapData[key];
			    			}else if(key == "isPCHtmlExist"){
			    				state.isPCHtmlExist = mapData[key];
			    			}else if(key == "isWapHtmlExist"){
			    				state.isWapHtmlExist = mapData[key];
			    			}
			    		}
			    		
			    		nextTick(()=> {
	    					if(state.activeDoc == "example"){
	    						//markRaw 方法可以将原始数据标记为非响应式的
	    						let exampleCodeList = example_doc_ref.value.querySelectorAll("[name*='exampleCode']");
		    					for(let i = 0; i < exampleCodeList.length; ++i) {
									let exampleCode = exampleCodeList[i];
									let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
								      	lineNumbers: true,
								        mode: 'text/html',
								        indentUnit: 4,
								        extraKeys: {"Alt-/": "autocomplete"},
								        indentWithTabs: true,
								        autoCloseTags: true,
								 	}));
								    editor.setSize("100%","100%");//设置自适应高度 
									
									state.example_editor.push(editor);
								}
	    					}
	    				});
			    		nextTick(()=> {
	    					if(state.activeDoc == "common"){
	    						//markRaw 方法可以将原始数据标记为非响应式的
	    						let exampleCodeList = common_doc_ref.value.querySelectorAll("[name*='exampleCode']");
		    					for(let i = 0; i < exampleCodeList.length; ++i) {
									let exampleCode = exampleCodeList[i];
									let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
								      	lineNumbers: true,
								        mode: 'text/html',
								        indentUnit: 4,
								        extraKeys: {"Alt-/": "autocomplete"},
								        indentWithTabs: true,
								        autoCloseTags: true,
								 	}));
								    editor.setSize("100%","100%");//设置自适应高度 
									
									state.common_editor.push(editor);
								}
	    					}
	    				});
			    		if(state.activeName == "pc" && state.isPCHtmlExist){
			    			nextTick(()=> {
			    				//markRaw 方法可以将原始数据标记为非响应式的
			    				state.editor_pc = markRaw(CodeMirror.fromTextArea(pc_code_ref.value, {
							      	lineNumbers: true,
							        mode: 'text/html',
							        indentUnit: 4,
							        extraKeys: {"Alt-/": "autocomplete"},
							        indentWithTabs: true,
							        autoCloseTags: true,
							 	}));
							 //	_self.editor_pc.setValue(_self.pc_html);
                                state.editor_pc.setSize("100%","100%");//设置自适应高度 
		    				
		    				});
					    }
			    		if(state.activeName == "wap" && state.isWapHtmlExist){
	    					nextTick(()=> {
			    				//markRaw 方法可以将原始数据标记为非响应式的
			    				state.editor_wap = markRaw(CodeMirror.fromTextArea(wap_code_ref.value, {
							      	lineNumbers: true,//是否在编辑器左侧显示行号
							        mode: 'text/html',
							        indentUnit: 4,//缩进单位，值为空格数，默认为2 
							        extraKeys: {"Alt-/": "autocomplete"},//给编辑器绑定快捷键
							        indentWithTabs: true,//在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符，默认为false
							        autoCloseTags: true,
							    }));
							    state.editor_wap.setSize("100%","100%");//设置自适应高度 
		    				});
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

    //提交源码编辑
    const editForumSource_submitForm = () => {
        state.submitForm_disabled = true;
			
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();
        if(state.editor_pc != null && state.editor_pc != ''){
            formData.append('pc_code', state.editor_pc.getValue());	
        }else{
            formData.append('pc_code', state.pc_html);	
        }
        if(state.editor_wap != null && state.editor_wap != ''){
            formData.append('wap_code', state.editor_wap.getValue());
        }else{
            formData.append('wap_code', state.wap_html);
        }
        if(state.nodeName != null){
            formData.append('nodeName', state.nodeName);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/forumCode/manage?method=forumSource&a=a',//a=a参数的作用是仅增加连接符&
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
			    		state.editForumSourceForm = false;
			    		
			    		
			    		for(let i=0; i<state.tableData.length; i++){
							let table = state.tableData[i];
							if(table.childNode != null && table.childNode.length >0){
								for(let j=0; j<table.childNode.length; j++){
									let childTable = table.childNode[j];
									for(let k=0; k<childTable.childNode.length; k++){
										let forumCodeTable = childTable.childNode[k];
										
										if(forumCodeTable.nodeName == state.nodeName){
											queryForumCode(childTable.nodeName);
											break;
										}
									}
								}
							}
						}
						
						handleEditForumSourceFormClose(function(){});
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

    //处理源码编辑表单选择
    const handleEditForumSourceFormClick = (tab:any, event:any) => {
        let _self = this;

        if(tab.props.name == "pc" && state.isPCHtmlExist){
            nextTick(()=> {
                if(state.editor_pc == ""){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    state.editor_pc = markRaw(CodeMirror.fromTextArea(pc_code_ref.value, {
                        lineNumbers: true,
                        mode: 'text/html',
                        indentUnit: 4,
                        extraKeys: {"Alt-/": "autocomplete"},
                        indentWithTabs: true,
                        autoCloseTags: true,
                    }));
                    state.editor_pc.setSize("100%","100%");//设置自适应高度 
                    nextTick(()=> {
                        state.editor_pc.refresh();
                    });
                }
            });
        
        }
        if(tab.props.name == "wap" && state.isWapHtmlExist){
            nextTick(()=> {
                if(state.editor_wap == ""){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    state.editor_wap = markRaw(CodeMirror.fromTextArea(wap_code_ref.value, {
                        lineNumbers: true,//是否在编辑器左侧显示行号
                        mode: 'text/html',
                        indentUnit: 4,//缩进单位，值为空格数，默认为2 
                        extraKeys: {"Alt-/": "autocomplete"},//给编辑器绑定快捷键
                        indentWithTabs: true,//在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符，默认为false
                        autoCloseTags: true,
                    }));
                    state.editor_wap.setSize("100%","100%");//设置自适应高度 
                    nextTick(()=> {
                        state.editor_wap.refresh();
                    });
                }
            });
        }
    }
    //处理文档表单选择
    const handleDocClick = (tab:any, event:any) => {
        if(tab.props.name == "example"){
            nextTick(() =>{
                if(state.example_editor.length ==0){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    let exampleCodeList = example_doc_ref.value.querySelectorAll("[name*='exampleCode']");
                    for(let i = 0; i < exampleCodeList.length; ++i) {
                        let exampleCode = exampleCodeList[i];
                        let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
                            lineNumbers: true,
                            mode: 'text/html',
                            indentUnit: 4,
                            extraKeys: {"Alt-/": "autocomplete"},
                            indentWithTabs: true,
                            autoCloseTags: true,
                        }));
                        editor.setSize("100%","100%");//设置自适应高度 
                        nextTick(()=> {
                            editor.refresh();
                        });
                        state.example_editor.push(editor);
                        
                    }
                }
            });
        
        }
        if(tab.props.name == "common"){
            nextTick(()=> {
                if(state.common_editor.length ==0){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    let exampleCodeList = common_doc_ref.value.querySelectorAll("[name*='exampleCode']");
                    for(let i = 0; i < exampleCodeList.length; ++i) {
                        let exampleCode = exampleCodeList[i];
                        let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
                            lineNumbers: true,
                            mode: 'text/html',
                            indentUnit: 4,
                            extraKeys: {"Alt-/": "autocomplete"},
                            indentWithTabs: true,
                            autoCloseTags: true,
                        }));
                        editor.setSize("100%","100%");//设置自适应高度 
                        nextTick(()=> {
                            editor.refresh();//解决初始状态不渲染数据
                        });
                        state.common_editor.push(editor);
                    }
                }
            });
        }
    }
    //处理源码编辑表单关闭
    const handleEditForumSourceFormClose = (done:any) => {
        if(state.editor_pc != ""){
            state.editor_pc.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            state.editor_pc = "";
        }
        if(state.editor_wap != ""){
            state.editor_wap.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            state.editor_wap = "";
        }
        state.activeName = "pc";
        state.activeDoc='example';
        
        if(state.example_editor != null && state.example_editor.length >0){
            for(let i =0; i <state.example_editor.length; i++ ){
                let editor = state.example_editor[i];
                editor.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            }
            state.example_editor = [];
        }
        if(state.common_editor != null && state.common_editor.length >0){
            for(let i =0; i <state.common_editor.length; i++ ){
                let editor = state.common_editor[i];
                editor.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            }
            state.common_editor = [];
        }
        
        done();
    }

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        if(router.currentRoute.value.query.dirName != undefined && router.currentRoute.value.query.dirName != ''){
			state.dirName = router.currentRoute.value.query.dirName as string;
		}
		
		
		
		CodeMirror.commands.autocomplete = function(cm:any) {
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint); 
		};
		
		
		//初始化
		queryTemplate();
		queryForumDirectory();
    }) 

</script>
<style scoped lang="scss">
/* 版块代码 */
.forumCodeListModule{
    .link-group-wrapper{
        .item{
            margin-left: 12px;
        }
    }
}
</style>