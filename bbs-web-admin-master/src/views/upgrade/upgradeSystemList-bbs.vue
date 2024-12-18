<!-- 升级 -->
<template>
    <div class="main upgradeModule">
        <div class="navbar" style="margin-bottom: 15px;">
            <el-button type="primary" plain @click="uploadUpgradePackageUI()">上传升级包</el-button>
        </div>
        <el-dialog title="上传升级包" v-model="state.uploadForm">
            <el-form @submit.native.prevent>
                <el-form-item :error="error.file">
                    <el-upload class="upload" drag :http-request="uploadUpgradePackage" :file-list="state.fileList" :show-file-list="false" :accept="'.zip'">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <template #tip>
                            <div class="el-upload__tip">
                                只允许上传 zip 格式文件
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="state.progressPercent" />
                </el-form-item>
            </el-form>
        </el-dialog>
        
        <div class="data-form" >
            <el-form @submit.native.prevent>
                <el-tabs v-model="state.item" type="card"  @tab-click="handleClick">
                    <el-tab-pane label="升级" :name="1"></el-tab-pane>
                    <el-tab-pane label="升级包列表" :name="2"></el-tab-pane>
                </el-tabs>
                <el-form-item  v-if="state.item ==1 && state.notCompletedUpgrade == null">
                    <span style="font-size: 16px;color: #409EFF;margin-left: 12px;">当前BBS版本 {{state.currentVersion}}</span>
                </el-form-item>
                <div v-if="state.item ==1 && state.notCompletedUpgrade != null">
                    <el-form-item>
                        <div class="singleRowTable">
                            <div class="leftCell">
                                    <el-button type="primary" size="large" class="submitButton" @click="upgradeNow($event,state.notCompletedUpgrade)" plain :disabled="state.upgradeNow_disabled" v-if="state.upgradeNow_show">立即升级</el-button>
                            </div>
                            <div>
                                    <el-button type="primary" size="large" class="submitButton" @click="continueUpgrade($event,state.notCompletedUpgrade)" :disabled="state.continueUpgrade_disabled" v-if="state.continueUpgrade_show">继续升级</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="state.isUpgradeComplete">
                        <span style="font-size: 16px;color: #67C23A;margin-left: 12px;">升级完成</span>
                    </el-form-item>
                    
                    <el-form-item v-if="state.interruptError">
                        <span style="font-size: 16px;color: #F56C6C;margin-left: 12px;">出现错误升级已中断,原因请查看日志</span>
                    </el-form-item>
                    <el-form-item v-if="state.interruptRestart">
                        <span style="font-size: 16px;color: #E6A23C;margin-left: 12px;">需重启应用服务器才能继续升级</span>
                    </el-form-item>
                    
                    <el-form-item>
                        <div style="font-size: 16px;color: #F56C6C;margin-left: 12px;">1.升级前请先备份所有数据</div>
                        <div style="font-size: 16px;color: #F56C6C;margin-left: 12px;">2.升级过程不能中断</div>
                    </el-form-item>
                    
                    
                </div>
                
            </el-form>
        </div>
        
        <div class="detail-data" v-if="state.item ==1 && state.notCompletedUpgrade != null">
            <el-row :gutter="10" type="flex" class="item">
                <el-col :span="4"><div class="name">升级包文件名称</div></el-col>
                <el-col :span="20"><div class="content">{{state.notCompletedUpgrade.updatePackageName}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex" class="item">
                <el-col :span="4"><div class="name">升级包上传时间</div></el-col>
                <el-col :span="20"><div class="content">{{state.notCompletedUpgrade.updatePackageTime}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex" class="item">
                <el-col :span="4"><div class="name">旧BBS版本</div></el-col>
                <el-col :span="20"><div class="content">{{state.notCompletedUpgrade.oldSystemVersion}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex" class="item">
                <el-col :span="4"><div class="name">升级包版本</div></el-col>
                <el-col :span="20"><div class="content">{{state.notCompletedUpgrade.updatePackageVersion}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex" class="item">
                <el-col :span="4"><div class="name">升级日志</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <div class="singleRowTable" v-for="upgradeLog in state.notCompletedUpgrade.upgradeLogList">
                            <div class="leftCell">
                                <span class="time">{{upgradeLog.time}}</span>
                            </div>
                            <div>
                                <span v-if="upgradeLog.grade == 2" style="color: #F56C6C;">{{upgradeLog.content}}</span>
                                <span v-else>{{upgradeLog.content}}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" class="item">
                <el-col :span="4"><div class="name">说明</div></el-col>
                <el-col :span="20"><div class="content" v-html="state.notCompletedUpgrade.explanation"></div></el-col>
            </el-row>
        </div>
        
        <div class="data-table detail-data" v-if="state.item ==1">
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" row-key="id" stripe empty-text="没有内容">
                <el-table-column prop="id" label="当前版本" align="center" ></el-table-column>
                <el-table-column prop="oldSystemVersion" label="旧BBS版本" align="center" width="150"></el-table-column>
                <el-table-column prop="updatePackageVersion" label="升级包版本" align="center" width="150"></el-table-column>
                <el-table-column prop="upgradeTime" label="升级时间" align="center" width="170"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="large" link @click="toogleExpand(scope.row)">升级日志</el-button>
                        <el-button type="primary" size="large" link @click="explanationView(scope.row)">说明</el-button>
                    </template>
                
                </el-table-column>
                <el-table-column type="expand" width="1"><!-- width="1"用来隐藏带箭头列 -->
                    <template #default="props">
                        <el-form>
                            <span style="color: #99a9bf;">升级日志</span>
                        </el-form>
                        <el-form label-position="left">
                            <div class="singleRowView" v-for="upgradeLog in props.row.upgradeLogList">
                                <div class="leftCell">
                                    <span class="time">{{upgradeLog.time}}</span>
                                </div>
                                <div>
                                    <span v-if="upgradeLog.grade == 2" style="color: #F56C6C;">{{upgradeLog.content}}</span>
                                    <span v-else>{{upgradeLog.content}}</span>
                                </div>
                            </div>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        
        
        <el-dialog title="说明" v-model="state.explanation_popup">
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item>
                    <span v-html="state.explanation_data"></span>
                </el-form-item>
            </el-form>
        </el-dialog>
        
        
        <div class="data-table detail-data" v-if="state.item ==2">
            <el-table ref="upgradePackage_multipleTable" :data="state.upgradePackage_tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="name" label="升级包名称" align="center" ></el-table-column>
                <el-table-column prop="size" label="文件大小" align="center" width="150"></el-table-column>
                <el-table-column prop="lastModifiedTime" label="上传时间" align="center" width="170"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <el-button type="primary" @click="deleteUpgradePackage($event,scope.row)">删除</el-button>
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
    import { processErrorInfo } from '@/utils/tool';
    import { UpgradeSystem } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
			
        upgradePackage_tableData: [],//升级包表格内容
        
        
        item :1,
        
        uploadForm:false,//是否显示上传表单
        fileList:[],//上传的文件列表
        progressPercent: 0 as any, // 进度条默认为0

        currentVersion:'',
        notCompletedUpgrade:{} as UpgradeSystem,
        
        explanation_popup:false,//说明弹出层
        explanation_data:'',//说明弹出层数据
        
        interruptError:false,//中断提示
        interruptRestart:false,//重启提示
        isUpgradeComplete:false,//是否升级完成
        upgradeNow_show:false,//立即升级按钮是否显示
        upgradeNow_disabled:true,//立即升级按钮是否禁用按钮
        continueUpgrade_show:false,//继续升级按钮是否显示
        continueUpgrade_disabled:true,//继续升级按钮是否禁用按钮

    });

    const error = reactive({
        file:'',
    });

    //查询升级
    const handleClick = (tab:any, event:any) => {
        if(tab.props.name == "2"){
            queryUpgradePackageList();
        }
    }

    //查询升级
    const queryUpgradeSystemList = () => {
        //清空内容
        state.tableData = [];

        proxy?.$axios({
            url: '/control/upgrade/manage',
            method: 'get',
            params: {
                method :  'upgradeSystemList',
                a :  'a',//a=a参数的作用是仅增加连接符&
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
			    			if(key == "currentVersion"){
			    				state.currentVersion = mapData[key];
			    			}else if(key == "notCompletedUpgrade"){
			    				let notCompletedUpgrade = mapData[key];
			    				if(notCompletedUpgrade != null){
			    					if(notCompletedUpgrade.runningStatus == 0){
			    						state.upgradeNow_show = true;//显示立即升级按钮
			    						state.upgradeNow_disabled = false;//立即升级按钮启用
			    						state.continueUpgrade_show = false;//隐藏立即升级按钮
			    					}else{
			    						state.upgradeNow_show = false;//隐藏立即升级按钮
			    						state.upgradeNow_disabled = true;//立即升级按钮禁用
			    						
			    						state.continueUpgrade_show = true;//显示立即升级按钮
			    						
			    					}
			    					if(notCompletedUpgrade.interruptStatus == 0 && notCompletedUpgrade.runningStatus > 20){
			    						state.continueUpgrade_disabled = true;//继续升级按钮禁用
		    						}else{
		    							state.continueUpgrade_disabled = false;//继续升级按钮启用
		    							
		    						}
			    					
			    				
					    			if(notCompletedUpgrade.interruptStatus == 1){//1:错误
					    				state.interruptError = true;//中断提示
					    				
					    				//按钮设为可用 disabled="disabled"
					    				state.continueUpgrade_disabled = false;//继续升级按钮是否禁用按钮
					        
					    			}
			    					
			    					
			    				}
			    				
			    				state.notCompletedUpgrade = notCompletedUpgrade;
			    			}else if(key == "upgradeSystemList"){
			    				let upgradeSystemList = mapData[key];
			    				if(upgradeSystemList != null &&  upgradeSystemList.length >0){
			    					for(let i = upgradeSystemList.length - 1; i >= 0; i--) {
			    						let upgradeSystem = upgradeSystemList[i];
			    						if(upgradeSystem.runningStatus != 9999){
			    							upgradeSystemList.splice(i, 1);
			    						}
			    						
			    					}
			    				}
			    				
			    				state.tableData = upgradeSystemList;
			    			}
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


    //升级日志 展开行
    const toogleExpand = (row:any) => {
        multipleTable.value!.toggleRowExpansion(row);
    }
    //说明 弹出层数据
    const explanationView = (row:any) => {
        state.explanation_popup =true;
        state.explanation_data = row.explanation;
    }

    //查询当前升级 timing：是否定时执行
    const queryCurrentUpgrade = (id:string,timing:boolean) => {

        proxy?.$axios({
            url: '/control/upgrade/manage',
            method: 'get',
            params: {
                method :  'queryUpgrade',
			    upgradeSystemId :  encodeURIComponent(id)
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
			    		let upgradeSystem = returnValue.data;
			    		if(upgradeSystem != null){
			    			if(upgradeSystem.upgradeLogList != null && upgradeSystem.upgradeLogList.length >0){
				    			state.notCompletedUpgrade.upgradeLogList = upgradeSystem.upgradeLogList;
				    		}
			    			
			    			
			    			if(upgradeSystem.runningStatus == 9999){
			    				state.continueUpgrade_show = false;//隐藏继续升级按钮
			    				
			    				//显示完成升级
			    				state.isUpgradeComplete = true;
			    			}
			    			//中断状态
			    			if(upgradeSystem.interruptStatus == 0){//0:正常
			    				state.interruptError = false;//中断提示
			    				state.interruptRestart = false;//重启提示
			    			}
			    			if(upgradeSystem.interruptStatus == 1){//1:错误
			    				state.interruptError = true;//中断提示
			    				
			    				//按钮设为可用 disabled="disabled"
			    				state.continueUpgrade_disabled = false;//继续升级按钮是否禁用按钮
			        
			    			}
			            	if(upgradeSystem.interruptStatus == 2){//2:待重启
			            		state.interruptRestart = true;//重启提示
			    			}
			    			
			    			if(timing == true && upgradeSystem.runningStatus <9999 && upgradeSystem.interruptStatus < 2){
			    				setTimeout(function(){
			    					queryCurrentUpgrade(id,timing)
			    				}, 5000);//5秒钟刷新 
			    			}
			    			
			    			
			    			
			    			
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
    //立即升级 
    const upgradeNow = (event:any,upgradeSystem:UpgradeSystem) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        ElMessageBox.confirm('此操作将升级系统, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {
            //隐藏‘立即升级’按钮 disabled="disabled"
            state.upgradeNow_show = false;
            
            
            let formData = new FormData();
            formData.append('updatePackageName', upgradeSystem.updatePackageName);
            proxy?.$axios({
                url: '/control/upgrade/manage?method=upgradeNow&a=a',//a=a参数的作用是仅增加连接符&
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
                                message: '升级任务开始运行',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		//读取当前升级
	        				queryCurrentUpgrade(upgradeSystem.id,false);
	        				//显示继续升级按钮
	        				state.continueUpgrade_show = true;
	        				state.continueUpgrade_disabled =false;
	        				
	        				state.upgradeNow_show = false;//隐藏立即升级按钮
    						state.upgradeNow_disabled = true;//立即升级按钮禁用
	        				
	        				//执行继续升级
	        				continueUpgrade(event,upgradeSystem);
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

    //继续升级
    const continueUpgrade = (event:any,upgradeSystem:UpgradeSystem) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        //按钮设为不可用 disabled="disabled"
        state.continueUpgrade_disabled = true;
        
        
        let formData = new FormData();
        formData.append('upgradeId', upgradeSystem.id);

        proxy?.$axios({
            url: '/control/upgrade/manage?method=continueUpgrade&a=a',//a=a参数的作用是仅增加连接符&
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
                            message: '继续升级任务开始运行',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
                        //执行定时刷新	
						queryCurrentUpgrade(upgradeSystem.id,true);
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

    //查询升级包列表
    const queryUpgradePackageList = () => {

        //清空内容
        state.upgradePackage_tableData = [];


        proxy?.$axios({
            url: '/control/upgrade/manage',
            method: 'get',
            params: {
                method :  'queryUpgradePackageList'
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
			    		state.upgradePackage_tableData = returnValue.data;
			    	}else if(returnValue.code === 500){//错误
			    		
			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //上传升级包UI
    const uploadUpgradePackageUI = () => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        
        state.uploadForm =true;//是否显示上传表单
        state.progressPercent= 0; // 进度条默认为0
        state.fileList=[];
    }

    //上传升级包
    const uploadUpgradePackage = (param:any) => {
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
		formData.append('file', param.file);

        proxy?.$axios({
            url: '/control/upgrade/manage?method=uploadUpgradePackage',
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
                        state.progressPercent = 100;
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
			    		queryUpgradePackageList();
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


    //删除升级包
    const deleteUpgradePackage = (event:any,upgradePackage:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        ElMessageBox.confirm('此操作将删除升级包, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {
	        	
            let formData = new FormData();
            formData.append('fileName', upgradePackage.name);


            proxy?.$axios({
                url: '/control/upgrade/manage?method=deleteUpgradePackage&a=a',//a=a参数的作用是仅增加连接符&
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
				    		queryUpgradePackageList();
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

        queryUpgradeSystemList();
    }) 

</script>
<style scoped lang="scss">
.upgradeModule{
    .headInfo{
        margin-top: 6px; 
        margin-left:8px;
        margin-right:8px; 
        border-bottom:1px solid #eee;
        padding-bottom:4px; 
        margin-bottom:5px;
        text-align: center; 
        .title{
            margin-left:4px;
            font-size: 16px;
            line-height:26px;
            color:#909399;
            padding:6px 0;
        }
    }
    :deep(.detail-data){
        padding: 10px 0px 10px 0px;
        position: relative;
        margin-left: 15px;
        margin-right: 15px;
        .el-row {
            align-items:center;
        }

        .el-table__expanded-cell[class*=cell] {
            padding: 20px 50px;
        }
        .item{
            &:nth-of-type(odd){ background:#fafafa;}/*奇数行*/ 
            &:nth-of-type(even){ background:#f5f5f5;}/*偶数行 */ 
            .name{ 
                text-align: right;line-height: 40px;font-size: 14px;margin-top: 4px;margin-bottom: 4px;
                color: #99a9bf;
            }
            .content{
                text-align: left;line-height: 40px;font-size: 14px;margin-left: 20px;
            }
            
            .singleRowTable{
                display: flex;justify-content:flex-start;
                .leftCell{
                    margin-right: 12px;
                    .time{
                        white-space: nowrap; 
                    }
                }
                .rightCell{
                    margin-left: 12px;
                }
            }
            
        }
        .singleRowView{
            display: flex;justify-content:flex-start;line-height: 30px;color: #909399;
            .leftCell{
                margin-right: 14px;
            }
            .time{
                white-space: nowrap; 
            }
            .rightCell{
                margin-left: 14px;
            }
        }
    }
    .upload{
        width: 100%;
        .el-upload {
            display:block;
        }
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
}
</style>