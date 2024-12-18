<!-- 帮助列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="state.visible == 'false'" @click="$router.push({path: '/admin/control/help/list', query:{ visible : 'true'}})">返回</el-button>
            <el-button type="primary" plain v-if="state.visible == 'false' && verifyPermissionMenu('/control/help/manage?method=reduction*','post')" @click="reductionHelp($event)">还原</el-button>
            <el-button type="primary" plain v-if="state.visible == 'true' && verifyPermissionMenu('/control/help/manage?method=add&*','get')" @click="$router.push({path: '/admin/control/help/manage/add', query:{ visible : 'true',page:($route.query.page != undefined ? $route.query.page:'')}})">添加帮助</el-button>
            <el-button type="primary" plain v-if="state.visible == 'true'" @click="$router.push({path: '/admin/control/help/list', query:{ visible : 'false'}})">回收站</el-button>
            <el-button type="primary" plain v-if="state.visible == 'true' && verifyPermissionMenu('/control/help/manage?method=move*','post')" @click="moveUI($event)">移动</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/help/manage?method=delete*','post')" @click="deleteHelp($event,undefined)">批量删除</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" stripe empty-text="没有内容">
                <el-table-column type="selection" ></el-table-column>
                <el-table-column prop="name" label="帮助名称" min-width="200">
                    <template #default="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="helpTypeName" label="分类名称" align="center" min-width="80"></el-table-column>
                <el-table-column label="发布员工" align="center" width="150">
                    <template #default="scope">
                        <div class="avatar-wrapper">
                            <el-badge value="员工" type="warning" class="avatar-badge">
                                <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                            </el-badge>
                            <div class="avatar-text">{{scope.row.userName}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="times" label="发布时间" align="center" width="150"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/help/manage?method=view&*','get')" @click="store.setCacheNumber();$router.push({path: '/admin/control/help/manage/view', query:{helpId : scope.row.id, visible : ($route.query.visible != undefined ? $route.query.visible:''),page : ($route.query.page != undefined ? $route.query.page:'')}})">查看</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/help/manage?method=delete*','post')" @click="deleteHelp($event,scope.row)">删除</el-button>
                            </el-button-group>
                        </div>
                    </template>
                
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper" v-if="state.isShowPage">
                <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
            </div>
        </div>
        
        <div class="data-form" >
            <el-dialog title="选择分类" v-model="state.move.helpType_form">
                <div class="dialog-nav-breadcrumb">
                    <el-breadcrumb :separator-icon="ArrowRight">
                        <el-breadcrumb-item @click="queryHelpTypeList(1,'')">全部标签</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(value, key) in state.move.navigation" @click="queryHelpTypeList(1,String(key))">{{value}}</el-breadcrumb-item>
                        
                    </el-breadcrumb>
                </div>
                <div class="dialog-data-table" >
                    <el-table :data="state.move.tableData" @cell-click="cellExpandRow" :show-header="false" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                        <el-table-column label="选择" align="right" width="50">
                            <template #default="scope">
                                <el-radio v-model="state.move.helpTypeId" @click.native.prevent="radioClickEvent($event)" v-if="scope.row.childNodeNumber ==0" :label="scope.row.id" >&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column label="分类名称">
                            <template #default="scope">
                                <el-icon class="icon icon-folder" v-if="scope.row.childNodeNumber >0"><Folder /></el-icon>
                                <el-icon class="icon icon-file" v-if="scope.row.childNodeNumber ==0"><Document /></el-icon>{{scope.row.name}}
                            </template>


                        </el-table-column>
                    </el-table>
                    <div class="pagination-wrapper" v-if="state.move.isShowPage">
                        <el-pagination background  @current-change="move_page" :current-page="state.move.currentpage"  :page-size="state.move.maxresult" layout="total, prev, pager, next,jumper" :total="state.move.totalrecord"></el-pagination>
                    </div>
                </div>
            </el-dialog>
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
    import { UserFilled,ArrowRight } from '@element-plus/icons-vue'

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        visible :'true',//是否显示 true:未删除帮助 false:已删除帮助
        multipleSelection: [],
        
        move:{
            helpTypeId: '',
            tableData: [],//表格内容
            parentId : '',//父Id
            totalrecord : 0, //总记录数
            currentpage : 1, //当前页码
            totalpage : 1, //总页数
            maxresult: 12, //每页显示记录数
            isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
            helpType_form:false,//是否显示问题标签表单
            navigation: '',
        },
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询帮助列表
    const queryHelpList = () => {
        //清空内容
        state.tableData = []; 

        proxy?.$axios({
            url: '/control/help/list',
            method: 'get',
            params: {
                visible :state.visible,
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
			    		let helpList = pageView.records;
			    		if(helpList != null && helpList.length >0){
			    			state.tableData = helpList;
			 
			    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
			    			state.currentpage = pageView.currentpage;
							state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
							state.maxresult = pageView.maxresult;
							state.isShowPage = true;//显示分页栏
			    		}
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
            path: '/admin/control/help/list', 
            query:{ visible : state.visible,page : page}
        });
    }

    //处理多选
    const handleSelectionChange = (val:any) => {
	    state.multipleSelection = val;
	}

    //移动UI
    const moveUI = (event:any) => {
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
        
        state.move.helpType_form = true;
        loadHelpType();
        
    }
    //空的点击事件  不写上本方法点击cellExpandRow时会运行两次
    const radioClickEvent = (event:any) => {
        
    }

    //点击单元格选择
    const cellExpandRow = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="选择"){
            if(row.childNodeNumber ==0){
                ElMessageBox.confirm('此操作将选中的项移动到[ '+row.name+' ], 是否继续?',{
                    // type: 'warning',
                    cancelButtonText: "取消",
                    confirmButtonText: '确定'
                })
                .then(() => {

                    let formData = new FormData();
                    for(let i=0; i<state.multipleSelection.length; i++){
                        let rowData:any = state.multipleSelection[i];
                        formData.append('helpId', rowData.id);
                    }
                    formData.append('helpTypeId', row.id);
                

                    proxy?.$axios({
                        url: '/control/help/manage?method=move',
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
                                        message: '移动成功',
                                        type: 'success',
                                        onClose: ()=>{
                                            
                                        }
                                    })
                                    state.move.helpType_form = false;
                                
                                    //删除缓存
                                    store.setCacheNumber();
                                    queryHelpList();
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
        }else if(column.label=="分类名称"){
            if(row.childNodeNumber >0){
                state.move.parentId = row.id;
                queryHelpTypeList(1,row.id);
            }
        }
    }

    //加载帮助分类
    const loadHelpType = () => {
        
        state.move.helpType_form = true;
        state.move.helpTypeId = "";
        //清空数据
        state.move.totalrecord = 0;//服务器返回的long类型已转为String类型
        state.move.currentpage = 1;
        state.move.totalpage = 1;//服务器返回的long类型已转为String类型
        state.move.maxresult = 12;
        state.move.isShowPage = false;//显示分页栏
        state.move.parentId = '';
        
        queryHelpTypeList(1,'');
    }

    //分页
    const move_page = (page:number) => {
        queryHelpTypeList(page, state.move.parentId);
    }

    //查询分类
    const queryHelpTypeList = (page:number,parentId:string) => {
        state.move.tableData = [];
		state.move.navigation = '';
			
		state.move.parentId = parentId;

        proxy?.$axios({
            url: '/control/helpType/manage',
            method: 'get',
            params: {
                method : 'helpTypePageSelect_move',
                parentId : parentId,
                page : page
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
			    			if(key == "pageView"){
			    				let typeView = mapData[key];
					    		let typeList = typeView.records;
					    		if(typeList != null && typeList.length >0){
					    			state.move.tableData = typeList;
					 
					    			state.move.totalrecord = parseInt(typeView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.move.currentpage = typeView.currentpage;
									state.move.totalpage = parseInt(typeView.totalpage);//服务器返回的long类型已转为String类型
									state.move.maxresult = typeView.maxresult;
									state.move.isShowPage = true;//显示分页栏
					    		}
			    			}else if(key == "navigation"){
			    				state.move.navigation = mapData[key];
			    			}
			    		}
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }
  
    //删除帮助
    const deleteHelp = (event:any,row:any) => {
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
                formData.append('helpId', rowData.id);
            }
        

            proxy?.$axios({
                url: '/control/help/manage?method=delete',
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
				    		queryHelpList();
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

    //还原帮助
    const reductionHelp = (event:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();


        ElMessageBox.confirm('此操作将还原该项, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    for(let i=0; i<state.multipleSelection.length; i++){
                let rowData:any = state.multipleSelection[i];
                formData.append('helpId', rowData.id);
            }
        

            proxy?.$axios({
                url: '/control/help/manage?method=reduction',
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
				    		queryHelpList();
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
			state.currentpage =  parseInt(router.currentRoute.value.query.page as string);
		}

		queryHelpList();
    }) 

</script>