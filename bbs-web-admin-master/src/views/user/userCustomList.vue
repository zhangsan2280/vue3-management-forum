<!-- 用户自定义注册功能项列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/userCustom/manage?method=add*','get')" @click="$router.push({path: '/admin/control/userCustom/manage/add'});">添加会员注册项</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="name" label="注册项名称" align="center" ></el-table-column>
                <el-table-column prop="name" label="选项框" align="center" >
                    <template #default="scope">
                        <el-input v-model="state.input" placeholder="请输入内容" v-if="scope.row.chooseType==1" ></el-input>
                        <el-radio v-model="state.radio" v-if="scope.row.chooseType==2" ></el-radio>
                        <el-checkbox v-model="state.checked" v-if="scope.row.chooseType==3" ></el-checkbox>
                        <el-select v-model="state.value" placeholder="请选择" v-if="scope.row.chooseType==4"></el-select>
                        <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="state.textarea" v-if="scope.row.chooseType==5"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="tip" label="提示" align="center" ></el-table-column>
                <el-table-column label="注册项类型" align="center" >
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.chooseType==1" type="warning" class="tag-wrapper">输入框</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.chooseType==2" type="warning" class="tag-wrapper" >单选按钮</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.chooseType==3" type="warning" class="tag-wrapper" >多选按钮</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.chooseType==4" type="warning" class="tag-wrapper" >下拉列表</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.chooseType==5" type="warning" class="tag-wrapper" >文本域</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示" align="center" width="80">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.visible==true" type="success" class="tag-wrapper">显示</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.visible==false" type="danger" class="tag-wrapper" >隐藏</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="70"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/userCustom/manage?method=edit*','get')" @click="$router.push({path: '/admin/control/userCustom/manage/edit', query:{ id : scope.row.id}})">修改</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/userCustom/manage?method=delete*','post')" @click="deleteUserCustom($event,scope.row)">删除</el-button>
                            </el-button-group>
                        </div>
                    </template>
                
                </el-table-column>
            </el-table>
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

        input:'',
        radio: true,
		checked: true,
        value:'',
        textarea:''
    });


    //查询用户自定义注册功能项列表
    const queryUserCustomList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/userCustom/list',
            method: 'get',
            params: {
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
                        let userCustomList = returnValue.data;
			    		if(userCustomList != null && userCustomList.length >0){
			    			state.tableData = userCustomList;
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

    //删除用户自定义注册功能项
    const deleteUserCustom = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();


        ElMessageBox.confirm('此操作将删除该项, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    formData.append('id', row.id);

        

            proxy?.$axios({
                url: '/control/userCustom/manage?method=delete',
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
				    		queryUserCustomList();
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

		queryUserCustomList();

    }) 
</script>