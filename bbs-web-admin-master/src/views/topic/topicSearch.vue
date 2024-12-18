<!-- 话题搜索 -->
<template>
    <div class="main">
        <div class="search">
            <el-form :inline="true" label-width="auto" @keyup.enter.native="submitForm">
                <el-form-item :error="error.dataSource" >
                    <el-tooltip content="选择数据源" placement="top">
                        <el-radio-group v-model="state.dataSource" >
                            <el-radio-button :label="1">全文索引</el-radio-button>
                            <el-radio-button :label="2">数据库</el-radio-button>
                        </el-radio-group>
                    </el-tooltip>
                </el-form-item>
                <el-form-item :error="error.keyword">
                    <el-tooltip content="不限制请留空" placement="top">
                        <el-input v-model.trim="state.keyword" maxlength="50" :clearable="true" placeholder="关键词"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-tooltip content="不限制请留空" placement="top">
                <el-form-item :error="error.tagId">
                    <el-select v-model="state.tagIdGroup" size="large" @focus="queryTagList" @change="selectedTag" multiple  no-match-text="还没有标签" placeholder="选择标签">
                        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                </el-tooltip>
                <el-form-item :error="error.account" style="width: 180px;">
                    <el-tooltip content="不限制请留空" placement="top">
                        <el-input v-model.trim="state.account" maxlength="30" :clearable="true" placeholder="账号"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-tooltip content="不限制请留空" placement="top">
                    <el-form-item :error="error.start_postTime" >
                        <el-date-picker v-model="state.start_postTime_format" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="发表话题起始时间" ></el-date-picker>
                    </el-form-item>
                </el-tooltip>
                <el-tooltip content="不限制请留空" placement="top">
                    <el-form-item :error="error.end_postTime" >
                        <el-date-picker v-model="state.end_postTime_format" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="发表话题结束时间"></el-date-picker>
                    </el-form-item>
                </el-tooltip>
                <el-form-item >
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" >搜索</el-button>
                </el-form-item>
                
            </el-form>
        </div> 
    
        <div class="navbar" >
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/topic/manage?method=reduction*','post')" @click="reductionTopic($event)">批量还原</el-button>
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/topic/manage?method=delete*','post')" @click="deleteTopic($event,undefined)">批量删除</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" stripe empty-text="没有内容">
                <el-table-column type="selection" ></el-table-column>
                <el-table-column prop="title" label="话题标题" min-width="190">
                    <template #default="scope">
                        <span v-html="scope.row.title"></span>
                        <span class="essence" v-if="scope.row.essence == true">精华</span>
                        <span class="top" v-if="scope.row.sort >0">置顶</span>
                        <span v-if="scope.row.giveRedEnvelopeId != null && scope.row.giveRedEnvelopeId != ''" class="redEnvelope">红包</span>
                    </template>
                </el-table-column>
                <el-table-column prop="tagName" label="标签名称" align="center" min-width="80"></el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.status==10" class="tag-wrapper">待审核</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==20" type="success" class="tag-wrapper" >已发布</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==110" type="info" class="tag-wrapper" >待审核删除</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==120" type="warning" class="tag-wrapper" >已发布删除</el-tag>
                    </template>
                
                </el-table-column>
                <el-table-column label="允许评论" align="center" width="80">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.allow==true" type="success" class="tag-wrapper">允许</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.allow==false" type="danger" class="tag-wrapper" >禁止</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="会员/员工" align="center" min-width="120">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p v-if="scope.row.nickname != null && scope.row.nickname != ''">呢称: {{scope.row.nickname}}</p>
                                <p>账号: {{scope.row.account}}</p>
                            </template>
                            <template #reference v-if="scope.row.isStaff == false">
                                <div class="avatar-wrapper" >
                                    <div class="avatar-badge" v-if="scope.row.avatarName == null || scope.row.avatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </div>
                                    <div class="avatar-badge" v-if="scope.row.avatarName != null && scope.row.avatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.avatarPath+'100x100/'+scope.row.avatarName"></el-avatar>
                                    </div>
                                    
                                    <div class="avatar-text">{{scope.row.account}}</div>
                                </div>
                            </template>
                            
                            <template #reference v-if="scope.row.isStaff == true">
                                <div class="avatar-wrapper">
                                    <el-badge value="员工" type="warning" class="avatar-badge" v-if="scope.row.avatarName == null || scope.row.avatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </el-badge>
                                    <el-badge value="员工" type="warning" class="avatar-badge" v-if="scope.row.avatarName != null && scope.row.avatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.avatarPath+'100x100/'+scope.row.avatarName"></el-avatar>
                                    </el-badge>
                                    <div class="avatar-text">{{scope.row.account}}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="postTime" label="发布时间" align="center" width="160"></el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="80"></el-table-column>
                <el-table-column label="操作" align="center" min-width="120">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/topic/manage?method=view*','get')" @click="store.setCacheNumber();$router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.id}})">查看</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/topic/manage?method=delete*','post')" @click="deleteTopic($event,scope.row)">删除</el-button>
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
    import dayjs from "dayjs"
 
    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        dataSource :1,//数据源
        keyword :'',//关键词
        tagId :'',//标签Id
        tagName :'',//标签名称
        account :'',//账号
        start_postTime :'',//发表日期 起始
        end_postTime :'',//发表日期 结束
        
        start_postTime_format :'',//发表日期 起始 格式化为适合el-date-picker标签的值
        end_postTime_format :'',//发表日期 结束  格式化为适合el-date-picker标签的值
        
        isAllowLoadTagGroup:true,//是否允许加载标签组
        tagIdGroup :[],//标签Id组
        loading :false,//是否正在从远程获取数据
        options: [] as Array<OptionsItem>,//Select 选择器标签数据

        tableData: [],//表格内容
        multipleSelection: [],
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });

    const error = reactive({
        dataSource :'',
        keyword :'',
        tagId :'',
        account :'',
        start_postTime :'',
        end_postTime :'',
    });

    //查询话题列表
    const queryTopicList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/topic/search',
            method: 'get',
            params: {
                dataSource :state.dataSource,//数据源
                keyword :state.keyword,
                tagId :state.tagId,
                tagName : state.tagName,
                account :state.account,
                start_postTime :state.start_postTime,
                end_postTime :state.end_postTime,
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
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});
				    		
			    		
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
            path: '/admin/control/topic/search', 
            query:{
                dataSource :state.dataSource,//数据源
                keyword :encodeURIComponent(state.keyword),
                tagId :state.tagId,
                tagName :encodeURIComponent(state.tagName),
                account :encodeURIComponent(state.account),
                start_postTime :encodeURIComponent(state.start_postTime),
                end_postTime :encodeURIComponent(state.end_postTime),
                page : page
            }
        });
    }

    
    //提交表单
    const submitForm = () => {
        //删除缓存
        store.setCacheNumber();

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        if(state.start_postTime_format != null && state.start_postTime_format != ''){
            state.start_postTime = dayjs(state.start_postTime_format).format('YYYY-MM-DD HH:mm');
        }else{
            state.start_postTime = '';
        }
        if(state.end_postTime_format != null && state.end_postTime_format != ''){
            state.end_postTime = dayjs(state.end_postTime_format).format('YYYY-MM-DD HH:mm');
        }else{
            state.end_postTime = '';
        }
			
        router.push({
            path: '/admin/control/topic/search', 
            query:{ 
                dataSource :state.dataSource,//数据源
                keyword :encodeURIComponent(state.keyword),
                tagId :state.tagId,
                tagName : encodeURIComponent(state.tagName),
                account :encodeURIComponent(state.account),
                start_postTime :encodeURIComponent(state.start_postTime),
                end_postTime :encodeURIComponent(state.end_postTime),
                page : 1,
                time: new Date().getTime()
            }
        });
    }


    //查询标签
    const queryTagList = () => {
        if(!state.isAllowLoadTagGroup){
            return;
        }

        proxy?.$axios({
            url: '/control/tag/manage',
            method: 'get',
            params: {
                method : 'allTag'
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            state.isAllowLoadTagGroup = false;
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		state.options = [];
			    		let tagList = returnValue.data;
			    		if(tagList != null && tagList.length >0){
			    			for(let i=0; i<tagList.length; i++){
			    				let tag = tagList[i];
				    			let obj:any =new Object();
				    	    	obj.value = tag.id;
				    	    	obj.label = tag.name;
				    	    	state.options.push(obj);
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

    //选中标签
    const selectedTag = (val:any) => {
        //因为只允许选中一个，所以将已选择的清空
        if (Object.keys(state.tagIdGroup).length >1) {
            state.tagIdGroup.shift();//从Array 头部移除元素
        }
        
        state.tagId = val[0];
        
        for(let option in state.options){
            if(state.options[option].value == state.tagId){
                state.tagName = state.options[option].label;
                break;
            }
        }
    }

    //处理多选
    const handleSelectionChange = (val:any) => {
        state.multipleSelection = val;
    }

    //删除话题
    const deleteTopic = (event:any,row:any) => {
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


        ElMessageBox.confirm('此操作将删除该话题, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            for(let i=0; i<state.multipleSelection.length; i++){
                let rowData:any = state.multipleSelection[i];
                formData.append('topicId', rowData.id);
            }

        

            proxy?.$axios({
                url: '/control/topic/manage?method=delete',
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
				    		queryTopicList();
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

     //还原话题
     const reductionTopic = (event:any) => {
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

        ElMessageBox.confirm('此操作将还原该话题, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
            for(let i=0; i<state.multipleSelection.length; i++){
                let rowData:any = state.multipleSelection[i];
                formData.append('topicId', rowData.id);
            }
        

            proxy?.$axios({
                url: '/control/topic/manage?method=reduction',
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
                                message: '还原成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryTopicList();
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

          
        if(router.currentRoute.value.query.dataSource != undefined && router.currentRoute.value.query.dataSource != ''){
			state.dataSource = parseInt(router.currentRoute.value.query.dataSource as string);
		}
		
		if(router.currentRoute.value.query.keyword != undefined && router.currentRoute.value.query.keyword != ''){
			state.keyword = decodeURIComponent(router.currentRoute.value.query.keyword as string);
		}
		if(router.currentRoute.value.query.account != undefined && router.currentRoute.value.query.account !=''){
			state.account = decodeURIComponent(router.currentRoute.value.query.account as string);
		}
		if(router.currentRoute.value.query.start_postTime != undefined && router.currentRoute.value.query.start_postTime != ''){
			state.start_postTime_format = decodeURIComponent(router.currentRoute.value.query.start_postTime as string);
			state.start_postTime = state.start_postTime_format;
		}
		if(router.currentRoute.value.query.end_postTime != undefined && router.currentRoute.value.query.end_postTime != ''){
			state.end_postTime_format = decodeURIComponent(router.currentRoute.value.query.end_postTime as string);
			state.end_postTime = state.end_postTime_format;
		}
		if(router.currentRoute.value.query.tagId != undefined && router.currentRoute.value.query.tagId != ''){
			state.tagId = router.currentRoute.value.query.tagId as string;
			state.tagName = decodeURIComponent(router.currentRoute.value.query.tagName as string);
			state.tagIdGroup.push(state.tagId as never);
			let obj:any =new Object();
			obj.value = state.tagId;
			obj.label = state.tagName;
			state.options.push(obj);
		}
		
		
        state.currentpage = (router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != '') ? parseInt(router.currentRoute.value.query.page as string) :1;
        

		   
		
		queryTopicList();
    }) 

</script>