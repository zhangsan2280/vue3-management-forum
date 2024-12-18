<!-- 留言列表 -->
<template>
    <div class="main">
        <div class="search">
            <el-form :inline="true" label-width="auto" @keyup.enter.native="submitForm">
                <el-tooltip content="不限制请留空" placement="top">
                    <el-form-item :error="error.start_createDate" >
                        <el-date-picker v-model="state.start_createDate_format" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="留言起始时间" ></el-date-picker>
                    </el-form-item>
                </el-tooltip>
                <el-tooltip content="不限制请留空" placement="top">
                    <el-form-item :error="error.end_createDate" >
                        <el-date-picker v-model="state.end_createDate_format" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="留言结束时间"></el-date-picker>
                    </el-form-item>
                </el-tooltip>
                <el-form-item >
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" >筛选</el-button>
                </el-form-item>
                
            </el-form>
        </div> 
    
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column type="selection" v-if="false"></el-table-column>
                <el-table-column prop="name" label="称呼" align="center" width="170"></el-table-column>
                <el-table-column prop="contact" label="联系方式" align="center" width="170"></el-table-column>
                <el-table-column prop="content" label="内容" align="center"></el-table-column>
                <el-table-column prop="createDate" label="日期" align="center" width="170"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/feedback/manage?method=view*','get')" @click="store.setCacheNumber();$router.push({path: '/admin/control/feedback/manage/view', query:{ feedbackId : scope.row.id}})">查看</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/feedback/manage?method=delete*','post')" @click="deleteFeedback($event,scope.row)">删除</el-button>
                            </el-button-group>
                        </div>
                    </template>
                
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper" v-if="state.isShowPage">
                <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
            </div>
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
    import dayjs from "dayjs"
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        start_createDate :'',//留言日期 起始
        end_createDate :'',//留言日期 结束
        
        start_createDate_format :'',//留言日期 起始 格式化为适合el-date-picker标签的值
        end_createDate_format :'',//留言日期 结束  格式化为适合el-date-picker标签的值

        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });
    const error = reactive({
        start_createDate :'',
        end_createDate :'',
    });

    //查询留言列表
    const queryFeedbackList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/feedback/list',
            method: 'get',
            params: {
                start_createDate :state.start_createDate,
				end_createDate :state.end_createDate,
			    page :state.currentpage
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
			    		let pageView = returnValue.data;
			    		let list = pageView.records;
			    		if(list != null && list.length >0){
			    			state.tableData = list;
			 
			    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
			    			state.currentpage = pageView.currentpage;
							state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
							state.maxresult = pageView.maxresult;
							state.isShowPage = true;//显示分页栏
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

    //分页
    const page = (page:number) => {
        //删除缓存
        store.setCacheNumber();
        router.push({
            path: '/admin/control/feedback/list', 
            query:{
                start_createDate :encodeURIComponent(state.start_createDate),
                end_createDate :encodeURIComponent(state.end_createDate),
                page : page
            }
        });
    }
    //处理多选
    const handleSelectionChange = (val:any) => {
        state.multipleSelection = val;
	}
    //提交表单
    const submitForm = () => {
        //删除缓存
        store.setCacheNumber();

        if(state.start_createDate_format != null && state.start_createDate_format != ''){
            state.start_createDate = dayjs(state.start_createDate_format).format('YYYY-MM-DD HH:mm');
        }else{
            state.start_createDate = '';
        }
        if(state.end_createDate_format != null && state.end_createDate_format != ''){
            state.end_createDate = dayjs(state.end_createDate_format).format('YYYY-MM-DD HH:mm');
        }else{
            state.end_createDate = '';
        }


        router.push({
            path: '/admin/control/feedback/list', 
            query:{ 
                start_createDate :encodeURIComponent(state.start_createDate),
                end_createDate :encodeURIComponent(state.end_createDate),
                page : 1,
                time: new Date().getTime()
            }
        });
    }
    //删除留言
    const deleteFeedback = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
            }
        target.blur();

        if (row) {//选中行
            multipleTable.value!.toggleRowSelection(row,true);
        }
        
        if(state.multipleSelection.length <1){
            ElMessage({
                //duration :0,
                showClose: true,
                message: '至少要选择一行数据',
                type: 'error',
            })
            return;
        }

        ElMessageBox.confirm('此操作将删除该项, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            for(let i=0; i<state.multipleSelection.length; i++){
		    	let rowData:any = state.multipleSelection[i];
		    	formData.append('feedbackId', rowData.id);
		    }
        

            proxy?.$axios({
                url: '/control/feedback/manage?method=delete',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
				    		//删除缓存
                            store.setCacheNumber();
                            ElMessage({
                                showClose: true,
                                message: '删除成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryFeedbackList();
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
            //取消选中行
	        multipleTable.value!.toggleRowSelection(row,false);
        })
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}
		
		if(router.currentRoute.value.query.start_createDate != undefined && router.currentRoute.value.query.start_createDate != ''){
			state.start_createDate_format = decodeURIComponent(router.currentRoute.value.query.start_createDate as string);
			state.start_createDate = state.start_createDate_format;
		}
		if(router.currentRoute.value.query.end_createDate != undefined && router.currentRoute.value.query.end_createDate != ''){
			state.end_createDate_format = decodeURIComponent(router.currentRoute.value.query.end_createDate as string);
			state.end_createDate = state.end_createDate_format;
		}

		queryFeedbackList();
    }) 

</script>