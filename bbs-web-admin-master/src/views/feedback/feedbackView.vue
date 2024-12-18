<!-- 留言查看 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: state.sourceUrlObject.path, query:state.sourceUrlObject.query})">返回</el-button>
        </div>
        <div class="data-view" >
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">称呼：</div></el-col>
                <el-col :span="20"><div class="content">{{state.feedback.name}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">留言时间：</div></el-col>
                <el-col :span="20"><div class="content">{{state.feedback.createDate}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">IP：</div></el-col>
                <el-col :span="20"><div class="content">{{state.feedback.ipAddress}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">联系方式：</div></el-col>
                <el-col :span="20"><div class="content">{{state.feedback.contact}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">内容：</div></el-col>
                <el-col :span="20"><div class="content">{{state.feedback.content}}</div></el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'feedbackView',
    beforeRouteEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        //上级路由编码
        if(to.query.beforeUrl == undefined || to.query.beforeUrl==''){//前一个URL
			let parameterObj:any = new Object;
			parameterObj.path = from.path;
			let query = from.query;
			for(let q in query){
				query[q] = encodeURIComponent(query[q] as string);
			}
			
			parameterObj.query = query;
			//将请求参数转为base62
			let wordArray = enc.Utf8.parse(JSON.stringify(parameterObj));
            let encrypt = enc.Base64url.stringify(wordArray);
			
			
			let newFullPath = updateURLParameter(to.fullPath,'beforeUrl',encrypt);
			
			to.fullPath = newFullPath;
			
			let paramGroup = to.query;
			paramGroup.beforeUrl = encrypt;
			to.query = paramGroup;
		
		}
        next()
    }
}
</script>

<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { NavigationGuardNext, RouteLocationNormalized, useRouter } from 'vue-router';
    import { processErrorInfo, updateURLParameter } from '@/utils/tool';
    import { Feedback, SourceUrl } from '@/types';
    import { enc} from 'crypto-js';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        feedbackId:'',
        feedback:{} as Feedback,
        
        sourceUrlObject:{} as SourceUrl,//来源URL对象
    });


    //查询留言
    const queryFeedback = () => {
        //清空内容
        state.feedback = {} as Feedback;


        proxy?.$axios({
            url: '/control/feedback/manage',
            method: 'get',
            params: {
                method : 'view',
			    feedbackId : state.feedbackId,
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
			    		state.feedback = returnValue.data;
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


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        if(router.currentRoute.value.query.feedbackId != undefined && router.currentRoute.value.query.feedbackId != ''){
			state.feedbackId = router.currentRoute.value.query.feedbackId as string;
		}
		//上级路由解码
		if(router.currentRoute.value.query.beforeUrl != undefined && router.currentRoute.value.query.beforeUrl != ''){
			let parsedWordArray = enc.Base64url.parse(router.currentRoute.value.query.beforeUrl as string);
            let decrypt = parsedWordArray.toString(enc.Utf8);
			
			let decryptObject = JSON.parse(decrypt);
			
			let query = decryptObject.query;
			for(let q in query){
				query[q] = decodeURIComponent(query[q]);
			}
			state.sourceUrlObject = {
				path : decryptObject.path,
				query :query
			}
		}
		
		//初始化
		queryFeedback();
    }) 

</script>