<!-- 用户列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="state.visible == 'false'" @click="$router.push({path: '/admin/control/user/list', query:{ visible : 'true'}})">返回</el-button>
            <el-button type="primary" plain v-if="state.visible == 'true' && verifyPermissionMenu('/control/user/manage?method=add*','get')" @click="$router.push({path: '/admin/control/user/manage/add', query:{ page:($route.query.page != undefined ? $route.query.page:'')}});">添加会员</el-button>
            <el-button type="primary" plain v-if="state.visible == 'true'" @click="$router.push({path: '/admin/control/user/list', query:{ visible : 'false'}})">回收站</el-button>
            <el-button type="primary" plain v-if="state.visible == 'false' && verifyPermissionMenu('/control/user/manage?method=reduction*','post')" @click="reductionUser($event)">还原</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/user/manage?method=delete*','post')" @click="deleteUser($event,undefined)">批量删除</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" stripe empty-text="没有内容">
                <el-table-column type="selection" ></el-table-column>
                <el-table-column label="账号" align="center">
                    <template #default="scope">
                        
                        <div class="multipleInfo-wrapper" >
                            <div>{{scope.row.account}}</div>
                            <div class="multipleInfo-wrapper-blue" v-if="scope.row.type ==20">
                                手机号{{scope.row.mobile}}
                            </div>
                            <div class="multipleInfo-wrapper-green" v-if="scope.row.type !=20 && scope.row.mobile !=null && scope.row.mobile !='' ">
                                绑定手机{{scope.row.mobile}}
                            </div>
                            <el-tag effect="dark"  v-if="scope.row.cancelAccountTime !='-1'" type="danger" class="tag-wrapper">已注销</el-tag>
                        </div>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="呢称" align="center" ></el-table-column>
                <el-table-column label="头像" align="center" min-width="100">
                    <template #default="scope">
                        
                        <div class="user-avatar-wrapper" >
                            <div class="avatar-badge" v-if="scope.row.avatarName == null || scope.row.avatarName == ''">
                                <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                            </div>
                            <div class="avatar-badge" v-if="scope.row.avatarName != null && scope.row.avatarName != ''">
                                <el-avatar :size="48" :src="scope.row.avatarPath+'100x100/'+scope.row.avatarName"></el-avatar>
                            </div>
                        </div>
                        
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="110">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.type==10" type="warning" class="tag-wrapper">账号密码用户</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.type==20" class="tag-wrapper" >手机用户</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.type==30" type="info" class="tag-wrapper" >邮箱用户</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.type==40" type="success" class="tag-wrapper" >微信用户</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.type==80" class="tag-wrapper-purple" >其他用户</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="point" label="积分" align="center" ></el-table-column>
                <el-table-column prop="gradeName" label="会员等级" align="center" width="100"></el-table-column>
                <el-table-column prop="registrationDate" label="注册日期" align="center" width="160"></el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.state == 1" type="success" class="tag-wrapper">启用</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.state == 2" type="info" class="tag-wrapper">停用</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.state ==11" type="warning" class="tag-wrapper">启用时删除</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.state ==12" type="danger" class="tag-wrapper">停用时删除</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/user/manage?method=show*','get')" @click="$router.push({path: '/admin/control/user/manage/show', query:{ id : scope.row.id}})">查看</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/user/manage?method=edit*','get')" @click="$router.push({path: '/admin/control/user/manage/edit', query:{ id : scope.row.id}})">修改</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/user/manage?method=delete*','post')" @click="deleteUser($event,scope.row)">删除</el-button>
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
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';
    import { UserFilled } from '@element-plus/icons-vue'


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()


    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        visible :'true',//是否显示 true:未删除用户 false:已删除用户
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });

    

    //查询用户列表
    const queryUserList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/user/list',
            method: 'get',
            params: {
                visible :state.visible,
			    page :  state.currentpage
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
			    		let topicList = pageView.records;
			    		if(topicList != null && topicList.length >0){
			    			state.tableData = topicList;
			 
			    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
			    			state.currentpage = pageView.currentpage;
							state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
							state.maxresult = pageView.maxresult;
							state.isShowPage = true;//显示分页栏
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
            path: '/admin/control/user/list', 
            query:{visible : state.visible,page : page}
        });
    }

    //删除用户
    const deleteUser = (event:any,row:any) => {
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
                formData.append('userId', rowData.id);
            }
            formData.append('visible', state.visible);

        

            proxy?.$axios({
                url: '/control/user/manage?method=delete',
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
				    		queryUserList();
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

    //处理多选
    const handleSelectionChange = (val:any) => {
        state.multipleSelection = val;
	}

    //还原用户
    const reductionUser = (event:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        if(state.multipleSelection.length <1){
            ElMessage({
                //duration :0,
                showClose: true,
                message: '至少要选择一行数据',
                type: 'error',
            })
            return;
        }

        ElMessageBox.confirm('此操作将还原该用户, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            for(let i=0; i<state.multipleSelection.length; i++){
                let rowData:any = state.multipleSelection[i];
                formData.append('userId', rowData.id);
            }
		    	

            proxy?.$axios({
                url: '/control/user/manage?method=reduction',
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
                                message: '还原成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryUserList();
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

        if(router.currentRoute.value.query.visible != undefined && router.currentRoute.value.query.visible != ''){
			state.visible = router.currentRoute.value.query.visible as string;
		}
		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}
		//初始化
		queryUserList();
    }) 

</script>