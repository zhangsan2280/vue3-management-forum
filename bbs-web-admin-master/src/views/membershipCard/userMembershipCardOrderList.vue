<!-- 用户会员卡订单列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/user/manage/show', query:{ id : $route.query.id,beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">返回</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="orderId" label="订单号" align="center" width="170"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" align="center" width="170"></el-table-column>
                <el-table-column prop="paymentAmount" label="已支付金额" align="center" width="120"></el-table-column>
                <el-table-column prop="paymentPoint" label="已支付积分" align="center" width="120"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center" ></el-table-column>
                <el-table-column prop="specificationName" label="规格名称" align="center" ></el-table-column>
                <el-table-column prop="quantity" label="数量" align="center" width="80"></el-table-column>
                <el-table-column label="时长" align="center" >
                    <template #default="scope">
                        {{scope.row.duration}}
                        <span v-if="scope.row.unit ==10">小时</span>
                        <span v-if="scope.row.unit ==20">日</span>
                        <span v-if="scope.row.unit ==30">月</span>
                        <span v-if="scope.row.unit ==40">年</span>
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
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElTable } from 'element-plus';
    import { User } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        currentUser :{} as User,//当前用户
        
        id :'',
        userName :'',//用户名称
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询用户会员卡订单列表
    const queryUserMembershipCardOrderList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/membershipCard/manage',
            method: 'get',
            params: {
                method:"membershipCardOrderList",
                id :state.id,
                userName :state.userName,
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
			    			if(key == "currentUser"){
			    				state.currentUser = mapData[key];
			    				
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
            path: '/admin/control/membershipCard/manage/membershipCardOrderList', 
            query:{ 
                id:state.id,
                userName :encodeURIComponent(state.userName),
                beforeUrl:(router.currentRoute.value.query.beforeUrl != undefined ? router.currentRoute.value.query.beforeUrl:''),
                page : page
            }
        });
    }

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

       
        if(router.currentRoute.value.query.id != undefined && router.currentRoute.value.query.id != ''){
			state.id = router.currentRoute.value.query.id as string;
			
		}
		if(router.currentRoute.value.query.userName != undefined && router.currentRoute.value.query.userName != ''){
			state.userName = decodeURIComponent(router.currentRoute.value.query.userName as string);
			
		}
		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}


		queryUserMembershipCardOrderList();

    }) 
</script>