<!-- 维护数据 -->
<template>
    <div class="main" >
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="重建话题索引" :error="error.rebuildTopicIndex">
                    <el-button-group>
                        <el-button type="primary" :disabled="!verifyPermissionMenu('/control/systemSetting/manage?method=rebuildTopicIndex&*','post')" @click="rebuildTopicIndex()">开始重建</el-button>
                    </el-button-group>
                    <div class="form-help" >需要时间取决于话题数量</div>
                </el-form-item>
                <el-form-item label="重建问题索引" :error="error.rebuildQuestionIndex">
                    <el-button-group>
                        <el-button type="primary" :disabled="!verifyPermissionMenu('/control/systemSetting/manage?method=rebuildQuestionIndex&*','post')" @click="rebuildQuestionIndex()">开始重建</el-button>
                    </el-button-group>
                    <div class="form-help" >需要时间取决于问题数量</div>
                </el-form-item>
                
                
                <el-form-item label="清空系统所有缓存" :error="error.clearAllCache">
                    <el-button-group>
                        <el-button type="primary" :disabled="!verifyPermissionMenu('/control/systemSetting/manage?method=clearAllCache&*','post')" @click="clearAllCache()">清空</el-button>
                    </el-button-group>
                </el-form-item>
                
                <el-form-item label="删除浏览量数据" :error="error.deletePageViewData_beforeTime" >
                    <div class="singleRowTable">
                        <div>
                            <el-date-picker v-model="state.deletePageViewData_beforeTime" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="指定日期"></el-date-picker>
                        </div>
                        <div class="rightCell">
                            之前的数据
                        </div>
                        <div class="rightCell">
                            <el-button-group>
                                <el-button type="primary" :disabled="!verifyPermissionMenu('/control/systemSetting/manage?method=deletePageViewData&*','post')" @click="deletePageViewData()">开始</el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <div class="form-help" >需要时间取决于数据数量</div>
                </el-form-item>
                <el-form-item label="删除用户登录日志数据" :error="error.deleteUserLoginLogData_beforeTime" >
                    <div class="singleRowTable">
                        <div>
                            <el-date-picker v-model="state.deleteUserLoginLogData_beforeTime" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="指定日期"></el-date-picker>
                        </div>
                        <div class="rightCell">
                            之前的数据
                        </div>
                        <div class="rightCell">
                            <el-button-group>
                                <el-button type="primary" :disabled="!verifyPermissionMenu('/control/systemSetting/manage?method=deleteUserLoginLogData&*','post')" @click="deleteUserLoginLogData()">开始</el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <div class="form-help" >需要时间取决于日志数量</div>
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
    import { ElMessage } from 'element-plus';
    import dayjs from "dayjs"
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        updateDatabasePasswordForm:false, //是否显示修改数据库密码表单
        oldPassword:'',
        newPassword:'',
        repeatPassword:'',
        deletePageViewData_beforeTime :'',//日期  格式化为适合el-date-picker标签的值
        deleteUserLoginLogData_beforeTime :'',
        seaweedFSToLocal_syncSeaweedFSFileCount :'',
        localToSeaweedFS_syncSeaweedFSFileCount :'',
        minIOToLocal_syncMinIOFileCount :'',
        localToMinIO_syncMinIOFileCount :'',
        ossToLocal_syncOSSFileCount :'',
        localToOSS_syncOSSFileCount :'',
        oss_acl :10,
        options: [{
            value: 10,
            label: '继承Bucket'
        }, {
            value: 20,
            label: '公共读写'
        }, {
            value: 30,
            label: '公共读，私有写'
        }, {
            value: 40,
            label: '私有读写'
        }],
        
        submitForm_disabled:false,//提交按钮是否禁用
    });

    const error = reactive({
        rebuildTopicIndex:'',
        rebuildQuestionIndex:'',
        oldPassword:'',
        newPassword:'',
        repeatPassword:'',
        clearAllCache:'',
        deletePageViewData_beforeTime:'',
        deleteUserLoginLogData_beforeTime :'',
        
        seaweedFSToLocal :'',
        localToSeaweedFS :'',
        minIOToLocal :'',
        localToMinIO :'',
        ossToLocal :'',
        localToOSS :'',
        ossSecureLinkFileACL:'',
    });

    //重建话题索引
    const rebuildTopicIndex = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();

        proxy?.$axios({
            url: '/control/systemSetting/manage?method=rebuildTopicIndex&a=a',//a=a参数的作用是仅增加连接符&
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
                            message: '执行任务成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
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

    //重建问题索引
    const rebuildQuestionIndex = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();

        proxy?.$axios({
            url: '/control/systemSetting/manage?method=rebuildQuestionIndex&a=a',//a=a参数的作用是仅增加连接符&
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
                            message: '执行任务成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
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


    //修改数据库密码UI
    const updateDatabasePasswordUI = () => {
		//清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        state.updateDatabasePasswordForm =true;//显示修改数据库密码表单
	       	
			
        state.oldPassword = "";
        state.newPassword= "";
        state.repeatPassword = "";
	       	
        state.submitForm_disabled = false;//提交按钮是否禁用
    }
    
    //修改数据库密码
    const updateDatabasePassword_submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();

        formData.append('oldPassword', state.oldPassword);
        formData.append('newPassword', state.newPassword);
        formData.append('repeatPassword', state.repeatPassword);
        
        
        if(state.newPassword != state.repeatPassword){
            error.repeatPassword = "两次输入新密码不一致";
            state.submitForm_disabled = false;
            return;
        }

        proxy?.$axios({
            url: '/control/systemSetting/manage?method=updateDatabasePassword&a=a',//a=a参数的作用是仅增加连接符&
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
                        state.updateDatabasePasswordForm = false;
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


    //清空系统所有缓存
    const clearAllCache = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();

        proxy?.$axios({
            url: '/control/systemSetting/manage?method=clearAllCache&a=a',//a=a参数的作用是仅增加连接符&
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
                            message: '执行任务成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
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

    //删除浏览量数据
    const deletePageViewData = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();

        if(state.deletePageViewData_beforeTime != null && state.deletePageViewData_beforeTime != ''){
            formData.append('deletePageViewData_beforeTime', dayjs(state.deletePageViewData_beforeTime).format('YYYY-MM-DD HH:mm'));
        }

        proxy?.$axios({
            url: '/control/systemSetting/manage?method=deletePageViewData&a=a',//a=a参数的作用是仅增加连接符&
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
                            message: '执行任务成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
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

    //删除用户登录日志数据
    const deleteUserLoginLogData = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        let formData = new FormData();

        if(state.deleteUserLoginLogData_beforeTime != null && state.deleteUserLoginLogData_beforeTime != ''){
            formData.append('deleteUserLoginLogData_beforeTime', dayjs(state.deleteUserLoginLogData_beforeTime).format('YYYY-MM-DD HH:mm'));
        }

        proxy?.$axios({
            url: '/control/systemSetting/manage?method=deleteUserLoginLogData&a=a',//a=a参数的作用是仅增加连接符&
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
                            message: '执行任务成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
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