<!-- 短信接口列表 -->
<template>
    <div class="main">
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="接口产品" align="center" width="150">
                    <template #default="scope">
                        <span v-if="scope.row.interfaceProduct == 1">阿里云通信</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送服务" align="center" width="150">
                    <template #default="scope">
                        <span v-if="scope.row.serviceId == 1">绑定手机</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="发送时间" align="center" width="170"></el-table-column>
                <el-table-column prop="platformUserId" label="平台用户Id" align="center" min-width="170"></el-table-column>
                <el-table-column prop="mobile" label="手机" align="center" width="100"></el-table-column>
                <el-table-column prop="code" label="状态码" align="center" width="200"></el-table-column>
                <el-table-column prop="message" label="状态码描述" align="center"></el-table-column>
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
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElTable } from 'element-plus';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        enable:[] as Array<boolean>,
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询短信接口列表
    const querySendSmsLogList = () => {
        //清空内容
        state.tableData = []; 
		state.enable = [];

        proxy?.$axios({
            url: '/control/sendSmsLog/list',
            method: 'get',
            params: {
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
			    			for(let i=0; i<list.length; i++){
			    				state.enable.push(list[i].enable);
			    			}
			    			
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
            path: '/admin/control/sendSmsLog/list', 
            query:{ page : page}
        });
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}

		querySendSmsLogList();
    }) 
</script>