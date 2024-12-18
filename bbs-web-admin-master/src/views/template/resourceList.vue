<!-- 资源列表 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}]</el-breadcrumb-item>
                <el-breadcrumb-item>资源列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/resource/manage?method=upload&*','post')" @click="uploadUI(null)">上传文件</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/resource/manage?method=newFolder*','post')" @click="newFolderUI(null)">新建文件夹</el-button>
        </div>
        <div class="data-table resourceListModule" >
            <el-table ref="multipleTable" :data="state.tableData" :indent="34" tooltip-effect="dark" row-key="id"  @cell-click="cellExpandRow" lazy :load="loadNode" :tree-props="{children: 'childNode', hasChildren: 'hasChildren'}" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="文件" >
                    <template #default="scope">
                        <el-icon class="icon icon-folder" v-if="!scope.row.leaf"><Folder /></el-icon>
                        <el-icon class="icon icon-file" v-if="scope.row.leaf"><Document /></el-icon>{{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column label="最后修改时间" align="center" width="200">
                    <template #default="scope">	
                        {{scope.row.lastModified}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template #default="scope">
                        <div class="link-group-wrapper" >
                    
                            <el-link :disabled="!verifyPermissionMenu('/control/resource/manage?method=editFile*','post')" v-if="scope.row.leaf && (/\.(js|css|JS|CSS)$/.test(scope.row.id)) " type="primary" class="item" href="javascript:void(0);" @click="viewUI(scope.row)">编辑</el-link>
                            <el-link :disabled="!verifyPermissionMenu('/control/resource/manage?method=showFileUI&*','get')" v-if="scope.row.leaf&& !(/\.(js|css|JS|CSS)$/.test(scope.row.id)) " type="primary" class="item" href="javascript:void(0);" @click="viewUI(scope.row)">查看</el-link>
                            <el-link :disabled="!verifyPermissionMenu('/control/resource/manage?method=download*','get')" v-if="scope.row.leaf" type="primary" class="item" href="javascript:void(0);" @click="resourceDownload(scope.row)">下载</el-link>
                            <el-link :disabled="!verifyPermissionMenu('/control/resource/manage?method=upload&*','post')" v-if="!scope.row.leaf" type="primary" class="item" href="javascript:void(0);" @click="uploadUI(scope.row)">上传文件</el-link>
                            <el-link :disabled="!verifyPermissionMenu('/control/resource/manage?method=newFolder*','post')" v-if="!scope.row.leaf" type="primary" class="item" href="javascript:void(0);" @click="newFolderUI(scope.row)">新建文件夹</el-link>
                            <el-link :disabled="!verifyPermissionMenu('/control/resource/manage?method=rename*','post')" type="primary" class="item" href="javascript:void(0);" @click="renameUI(scope.row)">重命名</el-link>
                            <el-link :disabled="!verifyPermissionMenu('/control/resource/manage?method=delete*','post')" type="primary" class="item" href="javascript:void(0);" @click="deleteResource(scope.row)">删除</el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        
        
        
        <el-dialog title="查看" v-model="state.viewWindow">
            <el-image :src="state.fullPath" preview-teleported :fit="'contain'"></el-image>
        </el-dialog>
        <el-dialog title="文件编辑" v-model="state.editFileForm" :before-close="handleEditFileFormClose" width="100%" :fullscreen="true" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
            <div class="editFileModule">
                <el-row >
                    <el-col :span="24"><div class="name">{{state.name}}</div></el-col>
                </el-row>
                
                <div class="code">
                    <textarea ref="editFileContentRef" >{{state.fileContent}}</textarea>
                </div>
                
                <el-row>
                    <el-col :span="24">
                            <el-button class="submitButton" size="large" type="primary" @click="editFile" :disabled="state.submitForm_disabled">提交</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
        <el-dialog title="文件下载" v-model="state.downloadForm">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="state.downloadProgressPercent" />
        </el-dialog>
        
        <el-dialog title="上传文件" v-model="state.uploadForm">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item :error="error.uploadFile">
                    <el-upload class="importTemplateModule" drag :http-request="upload" :file-list="state.fileList" :accept="'.zip,.gif,.jpg,.jpeg,.bmp,.png,.svg,.map,.txt,.css,.js'">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <template #tip>
                            <div class="el-upload__tip">
                                只允许上传 gif、jpg、jpeg、bmp、png、svg、map、txt、css、js、ico、eot、ttf、woff 文件，且单文件不超过 200MB
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-progress :text-inside="true" :stroke-width="20" :percentage="state.progressPercent" />
        </el-dialog>
        <el-dialog title="新建文件夹" v-model="state.newFolderForm" class="data-form">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="路径">
                    根目录/common/{{state.dirName}}/{{state.id}}
                </el-form-item>
                <el-form-item label="新文件夹名称" :required="true" :error="error.folderName">
                    <el-input v-model.trim="state.folderName" maxlength="35" :clearable="true" show-word-limit></el-input>
                    <div class="form-help" >不能含有\\&nbsp;/:*?\"&lt;>|%..字符</div>
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="submitButton" size="large" type="primary" @click="newFolder_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="重命名" v-model="state.renameForm" class="data-form">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="旧名称">
                    {{state.name}}
                </el-form-item>
                <el-form-item label="新名称" :required="true" :error="error.rename">
                    <el-input v-model.trim="state.rename" maxlength="35" :clearable="true" show-word-limit></el-input>
                    <div class="form-help" >不能含有\\&nbsp;/:*?\"&lt;>|%..字符</div>
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="submitButton" size="large" type="primary" @click="rename_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </span>
            </template>
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
    import { ArrowRight } from '@element-plus/icons-vue'
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
    const editFileContentRef = ref()


    const state = reactive({
        tableData: [],//表格内容
			

        dirName: '',
        templates: {} as Templates,//模板
        
        id: '',//资源Id
        name: '',//文件名称
        rename: '',//重名命新文件名称
        folderName: '',//新文件夹名称
        fullPath: '',//文件路径
        renameForm:false, //是否显示重命名表单
        newFolderForm:false, //是否显示新建文件表单
        viewWindow:false, //是否显示查看文件窗口
        editFileForm:false,//是否显示文件编辑表单
        downloadForm:false,//是否显示文件下载表单
        submitForm_disabled:false,//提交按钮是否禁用
        
        downloadProgressPercent: 0, // 下载进度条默认为0
        
        uploadForm:false,//是否显示上传表单
        fileList:[],//上传的文件列表
        progressPercent: 0 as any, // 进度条默认为0
        
        
        fileName: '',//文件名称
        fileType: '',//文件类型
        fileContent:'',//文件内容
        editor_editFileContent:'' as any,
        
        maps : new Map(),//缓存数据
    });

    const error = reactive({
        rename: '',
        folderName: '',
        uploadFile: '',
    });

    //点击单元格展开行
    const cellExpandRow = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="文件"){
            let rawValue = multipleTable.value!.store.states.treeData['_value'][row.id];//是否展开行
            
            if(rawValue != undefined && !rawValue.loaded){
                multipleTable.value!.store.loadOrToggle(row);
            
            }
        //const keys = Object.keys(this.$refs.multipleTable.store.states.treeData);
        //for (let i = 0; i < keys.length; i++) {
        //	console.log("值",keys[i]);
        //}
            multipleTable.value!.toggleRowExpansion(row);
        }
    }


    //加载子节点
    const loadNode= (tree:any, treeNode:any, resolve:any) => {

        proxy?.$axios({
            url: '/control/resource/query',
            method: 'get',
            params: {
                parentId :tree.id,
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
			    		let resourceList = returnValue.data;
			    		if(resourceList != null && resourceList.length >0){
			    			for(let i=0; i<resourceList.length; i++){
			    				let resource = resourceList[i];
			    				if(resource.leaf == true){
			    					resource.hasChildren = false;
			    				}else{
			    					resource.hasChildren = true;
			    				}
			    				
			    			}
			    		}else{
				    		//清空已加载的数据
				    		multipleTable.value!.store.states.lazyTreeNodeMap.value[tree.id] = []; 
			    		
			    		}
			    		resolve(resourceList);
			    		state.maps.set(tree.id, {tree, treeNode, resolve});
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

    //查询资源子节点
    const queryChildNode= async (node:any) => {
        let parentId = "";
        if(node != null){
            parentId = node.id;
        }else{
            //清空内容
            state.tableData = []; 
        }
        let return_resourceList = null;

        await proxy?.$axios({
            url: '/control/resource/query',
            method: 'get',
            params: {
                parentId :parentId,
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
			    		let resourceList = returnValue.data;
			    		if(resourceList != null && resourceList.length >0){
			    			for(let i=0; i<resourceList.length; i++){
			    				let resource = resourceList[i];
			    				if(resource.leaf == true){
			    					resource.hasChildren = false;
			    				}else{
			    					resource.hasChildren = true;
			    				}
			    			}
			    		}
			    		if(node != null){
							return_resourceList = resourceList;
						}else{
							state.tableData = resourceList;
						}
			    		state.maps.set(0,resourceList)
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
        return return_resourceList;
    }

    //查询模板
    const queryTemplate = () => {

        proxy?.$axios({
            url: '/control/resource/list',
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

    //刷新节点
    const refreshNode = (id:string,name:string) => {
        nextTick(() => {
            //获取父节点
            let rowId = id;
            let symbol = rowId.lastIndexOf("/");
            let parentId = rowId.substring(0,symbol); //取前部分

            //懒加载刷新父节点
            if (parentId && state.maps.get(parentId)) {
                const { tree, treeNode, resolve } = state.maps.get(parentId);
                loadNode(tree, treeNode, resolve);
                
            }
            
            //如果为根节点
            if(parentId == ""){
                queryChildNode(null);
            }
            
            
            //懒加载刷新子节点
            let rawValue = multipleTable.value!.store.states.treeData['_value'][id];//是否展开行
            if(rawValue != undefined && rawValue.expanded){
                const {  resolve } = state.maps.get(id);
                queryChildNode({id:parentId}).then(function (res:any) {
                    if(res != null && res.length >0){
                        for(let i=0; i<res.length; i++){
                            let resource = res[i];
                            if(resource.id = (parentId != null && parentId != ''? parentId+'/' : '')+name){
                                multipleTable.value!.store.loadOrToggle(resource);
                                break;
                            }
                        }
                    }
                    
                });
            }
        });
    }

    //刷新节点
    const refreshNode2 = (id:string,name:string) => {
        nextTick(() => {
            //获取父节点
            let rowId = id;
            let symbol = rowId.lastIndexOf("/");
            let parentId = rowId.substring(0,symbol); //取前部分

            //懒加载刷新父节点
            if (parentId && state.maps.get(parentId)) {
                const { tree, treeNode, resolve } = state.maps.get(parentId);
                loadNode(tree, treeNode, resolve);
                
            }
            
            //如果为根节点
            if(parentId == ""){
                queryChildNode(null);
            }
            
            
            //懒加载刷新子节点
            let rawValue:any = multipleTable.value!.store.states.treeData['_value'][id];//是否展开行
            
            if(rawValue != undefined && rawValue.expanded){
                const {  resolve } = state.maps.get(id);
                queryChildNode({id:parentId}).then(function (res:any) {
                    if(res != null && res.length >0){
                        for(let i=0; i<res.length; i++){
                            let resource = res[i];
                            if(resource.id = (parentId != null && parentId != ''? parentId+'/' : '')+name){
    
                                loadNode(resource, resource, resolve);//重新加载
                                break;
                            }
                        }
                    }
                    
                });
            }
        });
    }

    //查看文件UI
    const viewUI = (row:any) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        
        state.id = row.id;
        state.name= row.name;
        state.fileContent = "";
        state.fileType = "";
        
        
        //如果为文本格式，则用查看器加载
        if (/\.(map|Map|txt|TXT|js|css|JS|CSS)$/.test(row.id)) {
            state.editFileForm =true;
            
            let mode = "text/html";
            
            
            proxy?.$axios({
                url: '/control/resource/manage',
                method: 'get',
                params: {
                    method :'showFileUI',
                    resourceId :row.id,
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
                            let mapData = returnValue.data;
                            for(let key in mapData){
                                if(key == "fileType"){
                                    state.fileType = mapData[key];
                                    
                                    if(state.fileType == "js"){
                                        mode = "javascript";
                                    }else if(state.fileType == "css"){
                                        mode = "css";
                                    }
                                    
                                }else if(key == "fileContent"){
                                    state.fileContent = mapData[key];	
                                    
                                    nextTick(()=> {
                                        //markRaw 方法可以将原始数据标记为非响应式的
                                        state.editor_editFileContent = markRaw(CodeMirror.fromTextArea(editFileContentRef.value, {
                                            lineNumbers: true,
                                            mode: mode,
                                            indentUnit: 4,
                                            extraKeys: {"Alt-/": "autocomplete"},
                                            indentWithTabs: true,
                                            autoCloseTags: true,
                                        }));
                                        state.editor_editFileContent.setSize("100%","100%");//设置自适应高度 
                                    
                                    });
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
        }else{
            state.fullPath = store.apiUrl+"common/"+state.dirName+"/"+row.id+"?timestamp="+ new Date().getTime();
            state.viewWindow =true;//是否显示查看文件窗口

        }
    }

    const editFile = () => {
        state.submitForm_disabled = true;
        
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.editor_editFileContent != null && state.editor_editFileContent != ''){
            formData.append('content', state.editor_editFileContent.getValue());	
        }
        if(state.id != null){
            formData.append('resourceId',state.id);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }


        proxy?.$axios({
            url: '/control/resource/manage?method=editFile',
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
			    		state.editFileForm = false;
                    

                        handleEditFileFormClose(function(){});
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

    //处理文件编辑表单关闭
    const handleEditFileFormClose = (done:any) => {
        if(state.editor_editFileContent != ""){
            state.editor_editFileContent.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            state.editor_editFileContent = "";
        }
        done();
    }

    //下载
    const resourceDownload = (row:any) => {
        state.downloadForm = true;
        state.downloadProgressPercent =0;

        proxy?.$axios({
            url: '/control/resource/manage',
            method: 'get',
            params: {
                method:'download',
			    resourceId:row.id,
			    dirName:state.dirName
            },
            responseType: 'blob',// 表明返回服务器返回的数据类型
            timeout: 0,// 定义请求超时时间
            onDownloadProgress: (evt:any) => {
                // 对原生进度事件的处理
                state.downloadProgressPercent = evt.loaded / evt.total * 100
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    var blob = response.data;
                    if(blob.type ==  "text/json"){
                        ElMessage({
                            duration :0,
                            showClose: true,
                            message: (response.headers.exception != undefined ? decodeURIComponent(response.headers.exception) :""),
                            type: 'error',
                            onClose: ()=>{
                                
                            }
                        })
                        state.downloadForm = false;
                        return;
                    }


                    var blob = response.data;
                    var a = document.createElement('a');
                    // blob.type = "application/octet-stream";
                    var url = window.URL.createObjectURL(blob);

                    var fileName = row.name;

                    if((window.navigator as any).msSaveBlob){
                        try {
                            (window.navigator as any).msSaveBlob(blob,fileName)
                        } catch (e) {
                            console.log(e);
                        }
                    }else{
                        a.href = url;
                        a.download = fileName ;
                        document.body.appendChild(a); // 火狐浏览器 必须把元素插入body中
                        a.click();
                        document.body.removeChild(a);
                        //释放之前创建的URL对象
                        window.URL.revokeObjectURL(url);
                    }
                    state.downloadForm = false;

                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //文件上传UI
    const uploadUI = (row:any) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        if(row == null){//根目录
            state.id = "";
            state.name= "";
        }else{//子目录
            state.id = row.id;
            state.name= row.name;
        }
        
        state.uploadForm =true;//是否显示上传表单
        state.progressPercent= 0; // 进度条默认为0
        state.fileList=[];
    }

    //文件上传
    const upload = (param:any) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        
        let formData = new FormData();
        if(state.id != null){
            formData.append('resourceId', state.id);	
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }
        formData.append('uploadFile', param.file);
        

        proxy?.$axios({
            url: '/control/resource/manage?method=upload&a=a',//a=a参数的作用是仅增加连接符&
            method: 'post',
            data: formData,
            timeout: 0,// 定义请求超时时间
            onUploadProgress: (progressEvent:any) => {
                if (progressEvent.lengthComputable) {
                    let rate = progressEvent.loaded / progressEvent.total;  //已上传的比例
                    if (rate < 1) {
                        //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                        //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                        //等响应回来时，再将进度设为100%
                        // progressEvent.loaded:已上传文件大小
                        // progressEvent.total:被上传文件的总大小
                        state.progressPercent = (progressEvent.loaded / progressEvent.total * 100).toFixed(2);
                    }
                }
            },
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
                            message: '上传成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
			    		state.uploadForm = false;
			    		state.fileList=[];
			    		refreshNode2(state.id,state.name);
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

    //新建文件夹UI
    const newFolderUI = (row:any) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        
        state.newFolderForm =true;//显示新建文件夹表单
        	
        if(row == null){//根目录
            state.id = "";
            state.name= "";
        }else{//子目录
            state.id = row.id;
            state.name= row.name;
        }
        
        state.folderName = "";
        
        state.submitForm_disabled = false;//提交按钮是否禁用
    }

    //新建文件夹提交
    const newFolder_submitForm = () => {
        state.submitForm_disabled = true;
        
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.id != null){
            formData.append('resourceId', state.id);	
        }
        if(state.folderName != null){
            formData.append('folderName', state.folderName);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/resource/manage?method=newFolder',
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
			    		state.newFolderForm = false;
			    		
			    		refreshNode2(state.id,state.name);
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

    //重命名UI
    const renameUI = (row:any) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        state.renameForm =true;//显示重命名表单
        
        
        state.id = row.id;
        state.name= row.name;
        state.rename = "";
        
        state.submitForm_disabled = false;//提交按钮是否禁用


    }

    //重命名提交
    const rename_submitForm = () => {
        state.submitForm_disabled = true;
			
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();
        if(state.id != null){
            formData.append('resourceId', state.id);	
        }
        if(state.rename != null){
            formData.append('rename', state.rename);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/resource/manage?method=rename',
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
			    		state.renameForm = false;
			    		//刷新节点
	    				refreshNode(state.id, state.rename);   
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
    const deleteResource = (row:any) => {
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
                formData.append('resourceId', row.id);	
            }
            if(state.dirName != null){
                formData.append('dirName', state.dirName);
            }

        

            proxy?.$axios({
                url: '/control/resource/manage?method=delete',
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
				    		//刷新节点
		    				refreshNode(row.id, row.name);  
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
		
		CodeMirror.commands.autocomplete = function(cm:any) {
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint); 
		};
		
		
		//初始化
		queryTemplate();
		queryChildNode(null);
    }) 

</script>
<style scoped lang="scss">
/* 资源列表 */ 
.resourceListModule{
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

.importTemplateModule{
    width: 100%;
    /**
    .el-upload {
        display:block;
    }*/
    .el-upload-dragger {
        width: 100%;
        .el-upload__text{
            font-size: 15px;
        }
    }
    .el-upload__tip {
        font-size: 14px;
    } 
}
</style>