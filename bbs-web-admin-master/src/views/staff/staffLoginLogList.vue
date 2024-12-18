<!-- 登录日志列表 -->
<template>
    <div class="main staffLoginLogModule">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/staff/list', query:{ page:($route.query.staffPage != undefined ? $route.query.staffPage:'')}})">返回</el-button>
        </div>
        <div class="headInfo">
            <div class="title">{{state.currentStaff.userAccount}}</div>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="ip" label="登录IP" align="center" width="280"></el-table-column>
                <el-table-column prop="ipAddress" label="IP归属地" align="center" ></el-table-column>
                <el-table-column prop="logonTime" label="登录时间" align="center" width="200"></el-table-column>
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
    import { SysUsers } from '@/types';
import { processErrorInfo } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        currentStaff :{} as SysUsers,//当前员工
        
        userId :'',
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询登录日志列表
    const queryStaffLoginLogList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/staffLoginLog/list',
            method: 'get',
            params: {
                userId :state.userId,
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
                        let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "currentStaff"){
			    				state.currentStaff = mapData[key];
			    				
			    			}else if(key == "pageView"){
			    				let pageView = mapData[key];
			    				let list = pageView.records;
					    		if(list != null && list.length >0){
					    			state.tableData = list;
					 
					    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.currentpage = pageView.currentpage;
									state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
									state.maxresult = pageView.maxresult;
									state.isShowPage = true;//显示分页栏
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


    //分页
    const page = (page:number) => {
        //删除缓存
        store.setCacheNumber();
        router.push({
            path: '/admin/control/staffLoginLog/list', 
            query:{ 
                userId :state.userId,
                staffPage:(router.currentRoute.value.query.staffPage != undefined ? router.currentRoute.value.query.staffPage:''),
                page : page
            }
        });
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        if(router.currentRoute.value.query.userId != undefined && router.currentRoute.value.query.userId != ''){
			state.userId = router.currentRoute.value.query.userId as string;
			
		}
        if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}

		queryStaffLoginLogList();
    }) 
</script>
<style scoped lang="scss">
/** 员工登录日志 **/
.staffLoginLogModule{
	padding-bottom: 70px;
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
}
</style>