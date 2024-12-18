<!-- 导入模板列表 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item>模板压缩包列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain  v-if="verifyPermissionMenu('/control/template/manage?method=upload*','post')" @click="uploadUI($event)">模板压缩包上传</el-button>
            
            <el-dialog title="模板压缩包上传" v-model="state.uploadForm">
                <el-form @submit.native.prevent>
                    <el-form-item :error="error.uploadFile">
                        <el-upload class="importTemplateModule" drag :http-request="upload" :file-list="state.fileList" :accept="'.zip'">
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    只允许上传 zip 文件，且单文件不超过 200MB
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <el-progress :text-inside="true" :stroke-width="20" :percentage="state.progressPercent" />
            </el-dialog>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="fileName" label="文件名称" align="center" ></el-table-column>
                <el-table-column prop="name" label="模板名称" align="center" ></el-table-column>
                <el-table-column prop="dirName" label="目录名称" align="center" ></el-table-column>
                <el-table-column prop="introduction" label="模板简介" align="center" ></el-table-column>	
                <el-table-column label="操作" align="center" width="450">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/template/manage?method=templateDownload&*','get')" @click="templateDownload($event,scope.row)">下载</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/template/manage?method=directoryRename&*','post')" @click="directoryRenameUI($event,scope.row)">目录重命名</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/template/manage?method=import&*','post')" @click="importTemplate($event,scope.row)">解压到模板列表</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/template/manage?method=deleteExport&*','post')" @click="deleteExport($event,scope.row)">删除</el-button>
                            </el-button-group>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        <el-dialog title="文件下载" v-model="state.downloadForm">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="state.downloadProgressPercent" />
        </el-dialog>
        <el-dialog title="目录重命名" v-model="state.directoryRenameForm" class="data-form">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="旧目录名称" >
                    {{state.oldDirName}}
                </el-form-item>
                <el-form-item label="新目录名称" :required="true" :error="error.directoryName">
                    <el-input v-model.trim="state.directoryName" maxlength="40" :clearable="true" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" size="large" class="submitButton" @click="directoryRename_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
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
    import { ArrowRight } from '@element-plus/icons-vue'

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        
        oldDirName: '',
        fileName: '',
        directoryRenameForm :false,//是否显示目录重命名表单
        directoryName: '',//新目录名称
        downloadForm:false,//是否显示文件下载表单
        submitForm_disabled:false,//提交按钮是否禁用
        
        downloadProgressPercent: 0 as any, // 下载进度条默认为0
        
        uploadForm:false,//是否显示上传表单
        fileList:[],//上传的文件列表
        progressPercent: 0 as any, // 进度条默认为0
    });
    const error = reactive({
        directoryName: '',
        uploadFile: ''
    });

    //模板压缩包上传UI
    const uploadUI = (event:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();
        
        
        state.uploadForm =true;//是否显示上传表单
        state.progressPercent= 0; // 进度条默认为0
        state.fileList=[];
    }



    //模板压缩包上传
    const upload = (param:any) => {
        
        let formData = new FormData();
	    formData.append('uploadFile', param.file);

        proxy?.$axios({
            url: '/control/template/manage?method=upload',
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
            }
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
                        store.setCacheNumber()
                        state.uploadForm = false;
			    		state.fileList=[];
			    		queryImportTemplateList();
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

    //模板下载
    const templateDownload = (event:any,row:any) => {
        //清空内容
        state.downloadForm = true;
		state.downloadProgressPercent = 0;


        proxy?.$axios({
            url: '/control/template/manage',
            method: 'get',
            params: {
                method:'templateDownload',
			    fileName:row.fileName
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

                    var fileName = row.fileName;

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

    //目录重命名表单
    const directoryRenameUI = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();
        
        
        state.directoryRenameForm =true;//是否显示目录重命名表单
        state.oldDirName = row.dirName;
        state.fileName = row.fileName;
        state.directoryName= '';//新目录名称
        state.submitForm_disabled = false;//提交按钮是否禁用
    }

    //目录重命名提交表单
    const directoryRename_submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.directoryName != null){
            formData.append('directoryName',state.directoryName);
            
        }
        if(state.fileName != null){
            formData.append('fileName', state.fileName);
            
        }

        proxy?.$axios({
            url: '/control/template/manage?method=directoryRename&a=a',//a=a参数的作用是仅增加连接符&
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
			    		state.directoryRenameForm = false;
			    		queryImportTemplateList();
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

    //解压到模板列表
    const importTemplate = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        ElMessageBox.confirm('此操作将解压到模板列表, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    formData.append('fileName', row.fileName);

            let msg = ElMessage({
                duration: 0,
                showClose: true,
                message: '解压到模板列表中，请稍候....',
                type: 'warning',
                onClose: ()=>{
                    
                }
            })

            proxy?.$axios({
                url: '/control/template/manage?method=import&a=a',//a=a参数的作用是仅增加连接符&
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
                                message: '解压成功，请到“模板列表查看”',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
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

        })
        .catch(() => {
            //取消
        })
    }

    //查询模板列表
    const queryImportTemplateList = () => {
        //清空内容
		state.tableData = []; 

        proxy?.$axios({
            url: '/control/template/manage',
            method: 'get',
            params: {
                method:'importTemplateList',
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
			    		}
			    	}else if(returnValue.code === 500){
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

    //删除模板压缩包
    const deleteExport = (event:any,row:any) => {
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
		    formData.append('fileName', row.fileName);

        

            proxy?.$axios({
                url: '/control/template/manage?method=deleteExport&a=a',//a=a参数的作用是仅增加连接符&
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
				    		queryImportTemplateList();
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

        queryImportTemplateList();
    }) 

</script>
<style scoped lang="scss">
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