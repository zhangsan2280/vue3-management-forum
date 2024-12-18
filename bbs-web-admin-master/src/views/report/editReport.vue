<!-- 修改举报 -->
<template>
    <div class="main" >
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: state.sourceUrlObject.path, query:state.sourceUrlObject.query})">返回</el-button>
        
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="120"  @submit.native.prevent>
                <el-form-item label="状态">
                    <el-radio-group v-model="state.status">
                        <el-radio :label="10" disabled>待处理</el-radio>
                        <el-radio :label="40">投诉失败</el-radio>
                        <el-radio :label="50">投诉成功</el-radio>
                        <el-radio :label="1010" disabled>待处理【用户删除】</el-radio>
                        <el-radio :label="1040" disabled>投诉失败【用户删除】</el-radio>
                        <el-radio :label="1050" disabled>投诉成功【用户删除】</el-radio>
                        <el-radio :label="100010" disabled>待处理【员工删除】</el-radio>
                        <el-radio :label="100040" disabled>投诉失败【员工删除】</el-radio>
                        <el-radio :label="100050" disabled>投诉成功【员工删除】</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分类" :required="true" :error="error.reportTypeId">
                    <el-select ref="type_ref" size="large" v-model="state.reportTypeId" @focus="loadType"  style="width: 100%;" :placeholder="state.select_placeholder" >
                        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="理由" :error="error.reason">
                    <el-input type="textarea" :autosize="{minRows: 5}" placeholder="请填写举报理由" v-model="state.reason"></el-input>
                    <div class="form-help" >需要举报分类中设置了显示举报理由，前台才显示本项</div>
                </el-form-item>
                <el-form-item :error="error.image">
                    <el-upload ref="selectImage" v-model:file-list="state.fileList" action="#" :auto-upload="false" list-type="picture-card" :on-preview="openImagePreview" :accept="'.jpg,.jpeg,.gif,.png,.bmp'" >
                        <el-icon><Plus /></el-icon>
                    </el-upload>
                    <!-- 图片预览 -->
                    <el-image-viewer v-if="state.isImageViewer" @close="closeImagePreview" :url-list="[state.localImageUrl]" />

                </el-form-item>
                <el-form-item label="处理结果">
                    <el-input type="textarea" :autosize="{minRows: 5}" v-model="state.processResult"></el-input>
                </el-form-item>
                <el-form-item label="备注(本属性值不在前台显示)">
                    <el-input type="textarea" :autosize="{minRows: 5}" v-model="state.remark"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            <div class="selectReportTypeModule">
                <el-dialog title="选择分类" v-model="state.popup_allType" @close="closeType">
                    <div class="reportType-container">
                        <div class="reportType-group" v-for="reportType in state.reportTypeList">
                            
                            <!--  仅有一级分类 -->
                            <div v-if="reportType.childType.length ==0">
                                <ul class="reportType-list">
                                    <li class="reportType-item">
                                        <el-radio-group v-model="state.reportTypeId" @change="selectReportType(state.reportTypeList)">
                                            <el-radio :label="reportType.id" size="large">{{reportType.name}}</el-radio>
                                        </el-radio-group>
                                    </li>
                                </ul>
                                
                            </div>
                            <div v-else><!-- 含有多级分类 -->
                                <p class="reportType-name">{{reportType.name}}</p>
                                <ul class="reportType-list">
                                    <el-radio-group v-model="state.reportTypeId" @change="selectReportType(state.reportTypeList)">
                                    <li class="reportType-item" v-for="childReportType in reportType.childType">
                                        <el-radio :label="childReportType.id" size="large">{{childReportType.name}}</el-radio>
                                    </li>
                                </el-radio-group>
                                </ul>
                            </div>
                        </div>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: 'editReport',
    beforeRouteEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        //上级路由编码
        if(to.query.editReport_beforeUrl == undefined || to.query.editReport_beforeUrl==''){//前一个URL
            let parameterObj:any = new Object();
            parameterObj.path = from.path;
            let query = from.query;
            for(let q in query){
                query[q] = encodeURIComponent(query[q] as string);
            
            }
            
            parameterObj.query = query;
            //将请求参数转为base62
            let wordArray = enc.Utf8.parse(JSON.stringify(parameterObj));
            let encrypt = enc.Base64url.stringify(wordArray);


            
            let newFullPath = updateURLParameter(to.fullPath,'editReport_beforeUrl',encrypt);
            
            to.fullPath = newFullPath;
            
            let paramGroup = to.query;
            paramGroup.editReport_beforeUrl = encrypt;
            to.query = paramGroup;
        }
        next()
    }
}
</script>

<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { NavigationGuardNext, RouteLocationNormalized, useRouter } from 'vue-router';
    import { AxiosResponse } from 'axios';
    import { ElMessage, UploadFile, UploadUserFile, } from 'element-plus';
    import { processErrorInfo, updateURLParameter } from '@/utils/tool';
    import { ReportType, SourceUrl } from '@/types';
    import { enc} from 'crypto-js';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();
    const type_ref = ref();


    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        reportId :'',
        reportTypeId :'',

        options: [] as Array<OptionsItem>,//Select 选择器分类数据
        popup_allType :false,//是否弹出分类表单
        reportTypeList: [] as Array<ReportType>,//全部分类
        select_placeholder: '请选择',

        status :10,
        reason : '',
        processResult : '',//处理结果
        remark : '',//备注(本属性值不在前台显示)
        version:0,//版本号

        fileList:[] as UploadUserFile[],//上传的文件列表
        localImageUrl: '' as string | undefined,//本地图片地址 例如blob:http://127.0.0.1:8080/cfab3833-cbb0-4072-a576-feaf8fb19e5f
        isImageViewer: false,//是否显示图片查看器

        submitForm_disabled:false,//提交按钮是否禁用

        sourceUrlObject:{} as SourceUrl,//来源URL对象
    });
    const error = reactive({
        reportTypeId:'',//举报分类Id
        reason:'',//举报理由
        image:'',//举报图片
        report:'',//举报
    });


    //打开图片预览
    const openImagePreview = (file: UploadFile) => {
        state.localImageUrl = file.url;
        state.isImageViewer = true;
    }
    //关闭图片预览
    const closeImagePreview= () => {
        state.localImageUrl = '';
        state.isImageViewer = false;
    }

    //查询举报
    const queryReport = () => {
        proxy?.$axios({
            url: '/control/report/manage',
            method: 'get',
            params: {
                method : 'edit',
			    reportId: state.reportId,
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
                        let mapData = returnValue.data;
		    			let report = null;
			    		for(let key in mapData){
			    			if(key == "report"){
			    				report = mapData[key];
			    				
			    			}
			    		}
			    		
			    		if(report != null){
                            
                            if(report.reportTypeId != ''){
                                let o:any = new Object();
                                o.value = report.reportTypeId;
                                o.label = report.reportTypeName;
                                state.options.push(o);
                                state.reportTypeId = report.reportTypeId;
                                state.select_placeholder = "";
                            }
                            
                            state.status = report.status;
                            state.reason = report.reason;
                            state.processResult = report.processResult;
                            state.remark = report.remark;
                            state.version = report.version;

                            for(let i=0; i< report.imageInfoList.length; i++){
			    				let imageInfo = report.imageInfoList[i];
			    				state.fileList.push({
				    				name: imageInfo.name,
				    				url: imageInfo.path+imageInfo.name,
				    			});
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
    
    //加载分类
    const loadType = () => {
        state.popup_allType = true;
        type_ref.value.blur();//使Select选择器失去焦点，并隐藏下拉框
        if(state.reportTypeId == ''){
            state.options.length = 0;//清空	
        }
        
        queryAllType();
    }


    //关闭分类弹出框
    const closeType = () => {
        state.popup_allType = false;

    }
    //选择举报分类
    const selectReportType = (reportTypeList: Array<ReportType>) => {
        nextTick(()=>{
            let o:any = new Object();
            for(let i =0; i<reportTypeList.length; i++){
                let reportType = reportTypeList[i];
                if(reportType.id == state.reportTypeId){
                    o.value = reportType.id;
                    o.label = reportType.name;
                    state.options.push(o);
                    state.select_placeholder = "";
                    break;
                }
                
                for(let j =0; j<reportType.childType.length; j++){
                    let childReportType = reportType.childType[j];
                    if(childReportType.id == state.reportTypeId){
                        o.value = childReportType.id;
                        o.label = childReportType.name;
                        state.options.push(o);
                        state.select_placeholder = "";
                        break;
                    }
                }
            }
            
            closeType();
        })
    }
    //查询所有分类
    const queryAllType = () => {
        proxy?.$axios({
            url: '/control/reportType/manage',
            method: 'get',
            params: {
                method : 'allType'
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
                        state.reportTypeList = returnValue.data;
                    }else if(returnValue.code === 500){//错误
                        
                        
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
        formData.append('reportId', state.reportId);
			
        if(state.reportTypeId != null){
            formData.append('reportTypeId', state.reportTypeId);
            
        }
        if(state.status != null && state.status == 40 || state.status == 50){
            formData.append('status', String(state.status));
        }

        if(state.reason != null){
            formData.append('reason', state.reason);
        }
        if(state.processResult != null){
            formData.append('processResult', state.processResult);
        }
        if(state.remark != null){
            formData.append('remark', state.remark);
        }

        formData.append('version', String(state.version));

        if(state.fileList != null && state.fileList.length >0){
            for(let i=0; i<state.fileList.length; i++){
                let file = state.fileList[i];
                
                if(file.raw != undefined){
                    formData.append('imageFile', file.raw!);
                }else{
                    formData.append('imageFile',  new Blob([], { type: "text/html" }));//空白Blob
                    formData.append('imagePath', file.url!);
                }
            }
        } 

        proxy?.$axios({
            url: '/control/report/manage?method=edit',
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
			    			path: state.sourceUrlObject.path, 
			    			query:state.sourceUrlObject.query
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
        if(router.currentRoute.value.query.reportId != undefined && router.currentRoute.value.query.reportId != ''){
			state.reportId = router.currentRoute.value.query.reportId as string;
		}

        //上级路由解码
		if(router.currentRoute.value.query.editReport_beforeUrl != undefined && router.currentRoute.value.query.editReport_beforeUrl != ''){
			
            let parsedWordArray = enc.Base64url.parse(router.currentRoute.value.query.editReport_beforeUrl as string);
            let decrypt = parsedWordArray.toString(enc.Utf8);


			let decryptObject = JSON.parse(decrypt);
			
			let query = decryptObject.query;
			for(let q in query){
				query[q] = decodeURIComponent(query[q]);
			}
			state.sourceUrlObject = {
				path : decryptObject.path,
				query :query
			}
		}
		
		queryReport();
    }) 

</script>