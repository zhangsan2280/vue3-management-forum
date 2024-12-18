<!-- 服务器节点参数 -->
<template>
    <div class="main">
        <div class="data-view" >
            <el-row :gutter="10" type="flex">
                <el-col :span="8"><div class="name">服务器时间：</div></el-col>
                <el-col :span="16"><div class="content" v-if="state.clock != undefined && state.clock != null && Object.keys(state.clock).length>0">{{state.clock.format('YYYY-MM-DD HH:mm:ss')}}</div></el-col>
            </el-row>
            
            <el-row :gutter="10" type="flex">
                <el-col :span="8"><div class="name">分配最大内存：</div></el-col>
                <el-col :span="16"><div class="content">{{state.systemNode.maxMemory}}MB <span class="data-help" >-Xmx 当前虚拟机实例从操作系统可分配到的最大内存</span></div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="8"><div class="name">已分配内存：</div></el-col>
                <el-col :span="16"><div class="content">{{state.systemNode.totalMemory}}MB <span class="data-help" >-Xms 当前虚拟机实例已经从操作系统占用的内存</span></div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="8"><div class="name">已分配内存中的剩余空间：</div></el-col>
                <el-col :span="16"><div class="content">{{state.systemNode.freeMemory}}MB</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="8"><div class="name">空闲内存：</div></el-col>
                <el-col :span="16"><div class="content">{{state.systemNode.usableMemory}}MB <span class="data-help" >当前虚拟机实例从操作系统分配到的最大内存中的剩余空间</span></div></el-col>
            </el-row>
            
            <el-row :gutter="10" type="flex">
                <el-col :span="8"><div class="name">缓存服务器：</div></el-col>
                <el-col :span="16"><div class="content">{{state.cacheName}}</div></el-col>
            </el-row>
            
            <el-row :gutter="10" type="flex" v-for="cacheStatus in state.memcached_cacheStatusList">
                <el-col :span="8"><div class="name">服务器地址：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.serviceAddress}}</div></el-col>
                <el-col :span="8"><div class="name">当前已使用的内存容量：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_bytes}}</div></el-col>
                <el-col :span="8"><div class="name">服务器本次启动以来，曾存储的Item总个数：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_total_items}}</div></el-col>
                <el-col :span="8"><div class="name">MemCached服务版本：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_version}}</div></el-col>
                <el-col :span="8"><div class="name">MemCached服务器架构：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_pointer_size}}</div></el-col>
                <el-col :span="8"><div class="name">服务器当前时间：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_time}}</div></el-col>
                <el-col :span="8"><div class="name">允许服务支配的最大内存容量：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_limit_maxbytes}}</div></el-col>
                <el-col :span="8"><div class="name">服务器本次启动以来，读取的数据量：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_bytes_read}}</div></el-col>
                <el-col :span="8"><div class="name">服务器本次启动以来，写入的数据量：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_bytes_written}}</div></el-col>
                <el-col :span="8"><div class="name">服务器本次启动以来，总共运行时间：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_uptime}}</div></el-col>
                <el-col :span="8"><div class="name">当前存储的Item个数：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_curr_items}}</div></el-col>
                <el-col :span="8"><div class="name">服务器本次启动以来，执行Get命令总次数：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_cmd_get}}</div></el-col>
                <el-col :span="8"><div class="name">服务器本次启动以来，执行Set命令总次数：</div></el-col>
                <el-col :span="16"><div class="content">{{cacheStatus.memCached_cmd_set}}</div></el-col>
            </el-row>
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, onUnmounted} from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { processErrorInfo } from '@/utils/tool';
    import { SystemNode } from '@/types';
    import dayjs from "dayjs"
    import utc from "dayjs/plugin/utc"
    import timezone from "dayjs/plugin/timezone"
    dayjs.extend(utc)
    dayjs.extend(timezone)

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        systemNode:{} as SystemNode,
		cacheName:'',
		memcached_cacheStatusList:{} as any,
        timer:null as any,
        clock:{} as any,
    });

    //查询浏览量列表
    const queryNodeParameter = () => {
        
        state.systemNode = {} as SystemNode;


        proxy?.$axios({
            url: '/control/systemSetting/manage',
            method: 'get',
            params: {
                method : 'nodeParameter',
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
			    			if(key == "systemNode"){
			    				state.systemNode = mapData[key];
			    			
			    			}else if(key == "memcached_cacheStatusList"){
			    				state.memcached_cacheStatusList = mapData[key];
			    			}else if(key == "ehCache_cacheStatusList"){
			    				let ehCache_cacheStatusList = mapData[key];
			    			}else if(key == "cacheName"){
			    				state.cacheName = mapData[key];
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

    //查询服务器时间
    const queryServerTime = () => {
        let start = new Date().getTime(); // 开始时间

        proxy?.$axios({
            url: '/admin/currentTime',
            method: 'get',
            params: {
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let timeData = JSON.parse(result);

                    let end = new Date().getTime(); // 结束时间
					//请求数据返回时长
					let time = Math.floor((end - start)/2);
					
					

					//服务器时间戳
					let serverDate = parseInt(timeData.currentTime)+time;
					
					
                    state.clock = dayjs(serverDate).utcOffset(timeData.timezoneOffset);
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

        //初始化
		queryNodeParameter();
		queryServerTime();

        state.timer = setInterval(() => {
            if(state.clock != undefined && state.clock != null && Object.keys(state.clock).length>0){
                state.clock = state.clock.add(1, 'second')//增加1秒
            }
        },1000);
    }) 

   
    onUnmounted(()=>{
        if(state.timer){
            clearInterval(state.timer)
            state.timer = null;
        } 
    });

</script>