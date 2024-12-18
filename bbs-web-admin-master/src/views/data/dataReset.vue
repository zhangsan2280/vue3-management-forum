<!-- 数据库还原 -->
<template>
    <div class="main dataBackupModule">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/dataBase/list'});">返回</el-button>
        </div>
        <div class="headInfo">
            <div class="container">
                <el-form label-width="auto"  @submit.native.prevent>
                    <el-form-item>
                        <el-col :span="24">
                            <div class="singleRowTable">
                                <div class="leftCell" v-if="state.resetProgress != ''">
                                    还原进度
                                </div>
                                <div style="color: #67C23A;">
                                    {{state.resetProgress}}
                                </div>
                            </div>
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-col :span="24">
                            <el-button type="primary" size="large" class="submitButton" @click="submitReset($event)" :disabled="state.submitForm_disabled">立即还原</el-button>
                        </el-col>
                        <el-col :span="24">
                            <div class="form-help" style="color: #F56C6C;">还原过程不能中断</div>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="key" label="表文件名称" align="center" ></el-table-column>
                <el-table-column prop="value" label="文件大小" align="center" width="250"></el-table-column>
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
        tableData: [] as any,//表格内容
			
        dateName:'',
        resetProgress:'',
        submitForm_disabled:false,//提交按钮是否禁用
    });

    //查询数据库还原
    const queryDataReset = () => {
        //清空内容
        state.tableData = [];

        proxy?.$axios({
            url: '/control/dataBase/manage',
            method: 'get',
            params: {
                method :  'reset',
			    dateName :  state.dateName
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
			    			if(key == "fileMap"){
			    				let fileMap = mapData[key];
			    				let fileList = [];
	    						for(let key in fileMap){//Map转为List
	    							let obj:any =new Object();
					    	    	obj.key = key;
					    	    	obj.value = fileMap[key];
					    	    	fileList.push(obj);
	    						}
	    						state.tableData = fileList;
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

    //查询还原进度
    const queryResetProgress = () => {

        proxy?.$axios({
            url: '/control/dataBase/manage',
            method: 'get',
            params: {
                method :  'queryResetProgress'
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
			    		state.resetProgress = returnValue.data;
			    		
			    	
			    		setTimeout(function(){
							if(state.resetProgress != "还原完成"){
								queryResetProgress();
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

    //还原数据库
    const submitReset = (event:any) => {
        state.submitForm_disabled = true;
        
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        ElMessageBox.confirm('此操作将还原数据库, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            formData.append('dateName', state.dateName);

            proxy?.$axios({
                url: '/control/dataBase/manage?method=reset&a=a',//a=a参数的作用是仅增加连接符&
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
                                message: '还原任务开始执行',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryResetProgress();
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

        if(router.currentRoute.value.query.dateName != undefined && router.currentRoute.value.query.dateName != ''){
			state.dateName = router.currentRoute.value.query.dateName as string;
		}
		//初始化
		queryDataReset();
    }) 

</script>