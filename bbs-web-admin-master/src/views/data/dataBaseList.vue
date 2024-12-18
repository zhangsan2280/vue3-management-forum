<!-- 数据库备份/还原列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/dataBase/manage?method=backup*','get')" @click="$router.push({path: '/admin/control/dataBase/manage/backup'});">数据备份</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="fileName" label="文件名称" align="center" ></el-table-column>
                <el-table-column prop="fileSize" label="文件大小" align="center" width="200"></el-table-column>
                <el-table-column prop="version" label="数据库版本" align="center" width="200"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/dataBase/manage?method=reset&*','get')" @click="$router.push({path: '/admin/control/dataBase/manage/reset', query:{ dateName : scope.row.fileName}});">还原</el-button>
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
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElTable } from 'element-plus';
    import { verifyPermissionMenu } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
		multipleSelection: [],
    });
    //查询数据库备份/还原列表
    const queryDataBaseList = () => {
        //清空内容
        state.tableData = [];

        proxy?.$axios({
            url: '/control/dataBase/list',
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
			    		state.tableData = returnValue.data;
			    	}else if(returnValue.code === 500){//错误
			    		
			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        queryDataBaseList();
    }) 

</script>