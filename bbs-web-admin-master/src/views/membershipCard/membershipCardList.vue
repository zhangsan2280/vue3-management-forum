<!-- 会员卡列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/membershipCard/manage?method=add*','get')" @click="$router.push({path: '/admin/control/membershipCard/manage/add'});">添加会员卡</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column type="selection" v-if="false"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" align="center" width="160"></el-table-column>
                <el-table-column label="销售价" align="center" width="180">
                    <template #default="scope">
                        <span v-if="scope.row.lowestPrice == scope.row.highestPrice">{{scope.row.lowestPrice}}</span>
                        <span v-if="scope.row.lowestPrice != scope.row.highestPrice">{{scope.row.lowestPrice}} - {{scope.row.highestPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="积分" align="center" width="180">
                    <template #default="scope">
                        <span v-if="scope.row.lowestPoint == scope.row.highestPoint">{{scope.row.lowestPoint}}</span>
                        <span v-if="scope.row.lowestPoint != scope.row.highestPoint">{{scope.row.lowestPoint}} - {{scope.row.highestPoint}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否上架" align="center" width="100">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.state == 1 || scope.row.state == 11" class="tag-wrapper">上架</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.state == 2 || scope.row.state == 12" type="danger" class="tag-wrapper">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/membershipCard/manage?method=edit*','get')" @click="$router.push({path: '/admin/control/membershipCard/manage/edit', query:{ membershipCardId : scope.row.id,page:($route.query.page != undefined ? $route.query.page:'')}})">修改</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/membershipCard/manage?method=delete*','post')" @click="deleteMembershipCard($event,scope.row)">删除</el-button>
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
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询会员卡列表
    const queryMembershipCardList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/membershipCard/list',
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
            path: '/admin/control/membershipCard/list', 
            query:{
                page : page
            }
        });
    }

    //处理多选
    const handleSelectionChange = (val:any) => {
        state.multipleSelection = val;
    }


    //删除会员卡
    const deleteMembershipCard = (event:any,row:any) => {
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
		    	
            formData.append('membershipCardId',row.id);
        

            proxy?.$axios({
                url: '/control/membershipCard/manage?method=delete',
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
				    		queryMembershipCardList();
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

		queryMembershipCardList();

    }) 
</script>