<!-- 数据库备份 -->
<template>
<div class="main dataBackupModule">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/dataBase/list'});">返回</el-button>
        </div>
        <div class="headInfo">
            <div class="container">
                <el-form @submit.native.prevent>
                    <el-form-item>
                        <el-col :span="24">
                            <div class="singleRowTable">
                                <div class="leftCell" v-if="state.backupProgress != ''">
                                    备份进度
                                </div>
                                <div style="color: #67C23A;">
                                    {{state.backupProgress}}
                                </div>
                            </div>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="24">
                            <el-button type="primary" size="large" class="submitButton" @click="submitBackup($event)" :disabled="state.submitForm_disabled">立即备份</el-button>
                        </el-col>
                        <el-col :span="24">
                            <div class="form-help" style="color: #F56C6C;">备份过程不能中断</div>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" show-summary :summary-method="getSummaries" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="name" label="表名称" align="center" ></el-table-column>
                <el-table-column prop="rows" label="记录条数" align="center" width="250"></el-table-column>
                <el-table-column prop="indexSize" label="索引大小" align="center" width="250"></el-table-column>
                <el-table-column prop="dataSize" label="数据大小" align="center" width="250"></el-table-column>
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

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        countIndexSize:0,
        countDataSize:0,
        countRow:0,
        
        backupProgress:'',
        submitForm_disabled:false,//提交按钮是否禁用
    });

    //查询数据库备份
    const queryDataBackup = () => {
        //清空内容
        state.tableData = [];

        proxy?.$axios({
            url: '/control/dataBase/manage',
            method: 'get',
            params: {
                method :  'backup'
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
			    			if(key == "showTable"){
			    				state.tableData = mapData[key];
			    			}else if(key == "countIndexSize"){
			    				state.countIndexSize = mapData[key];
			    			}else if(key == "countDataSize"){
			    				state.countDataSize = mapData[key];
			    			}else if(key == "countRow"){
			    				state.countRow = mapData[key];
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

    //合并总数
    const getSummaries = (param:any) => {
        const { columns, data } = param;
        const sums = [] as any;
        columns.forEach((column:any, index:any) => {
            if (index === 0) {
                sums[index] = '总大小';
                return;
            }
            if (index === 1) {
                sums[index] = state.countRow;
                return;
            }
            if (index === 2) {
                sums[index] = state.countIndexSize;
                return;
            }
            if (index === 3) {
                sums[index] = state.countDataSize;
                return;
            }
        });

        return sums;
    }


    //查询备份进度
    const queryBackupProgress = () => {

        proxy?.$axios({
            url: '/control/dataBase/manage',
            method: 'get',
            params: {
                method :  'queryBackupProgress'
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
			    		state.backupProgress = returnValue.data;
			    		
			    	
			    		setTimeout(function(){
							if(state.backupProgress != "备份完成"){
								queryBackupProgress();
							}else{
								state.submitForm_disabled = false;
							}
							
					    }, 3000);//3秒钟刷新 
			    	}else if(returnValue.code === 500){//错误
			    		
			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //备份数据库
    const submitBackup = (event:any) => {
        state.submitForm_disabled = true;
        
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        ElMessageBox.confirm('此操作将备份数据库, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            proxy?.$axios({
                url: '/control/dataBase/manage?method=backup',
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
                                message: '备份任务开始执行',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryBackupProgress();
				    	}else if(returnValue.code === 500){//错误
				    		
                            //处理错误信息
                            processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

				    		
				    	}
				    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
                state.submitForm_disabled = false;
            });

        })
        .catch(() => {
            //取消
            state.submitForm_disabled = false;
        })

    }



    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        queryDataBackup();
    }) 

</script>