<template>
    <el-config-provider :locale="localLanguage">
        <router-view></router-view> 
    </el-config-provider>
</template>

<script setup lang="ts">
  import { getCurrentInstance, ComponentInternalInstance, onMounted} from 'vue'
  import pinia from '@/store/store'
  import {useStore} from '@/store'
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  //国际化 -- 指定显示中文
  import localLanguage from 'element-plus/lib/locale/lang/zh-cn'//中文
import { AxiosResponse } from 'axios';
  const route = useRoute();


  const store = useStore(pinia);
  const {permissionMenuList:store_permissionMenuList} = storeToRefs(store)

  const { proxy } = getCurrentInstance() as ComponentInternalInstance;


 
  //查询文件存储系统
  const queryManageFramework = () => {
        
        proxy?.$axios({
            url: '/control/manage/index',
            method: 'get',
            params:  {
            }
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        let mapData = returnValue.data;
                        for(let key in mapData){
							if(key == "fileStorageSystem"){
                                let fileStorageSystem = mapData[key];
                                store.setFileStorageSystem(fileStorageSystem)
                            }else if(key == "permissionMenuList"){
                                let permissionMenuList = mapData[key];
                                store_permissionMenuList.value = permissionMenuList
                            }
                        }
                      
                    }else if(returnValue.code === 500){//错误
                        
                        
                    }
                }
            }
        }).catch((error: any) =>{
            console.log(error);
        });
    }


    onMounted(() => {
       
        queryManageFramework();

        
    }) 


</script>

