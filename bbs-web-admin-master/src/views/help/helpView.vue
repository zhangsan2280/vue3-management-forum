<!-- 帮助查看 -->
<template>
    <div class="main">
        <div class="navbar">
            <!-- 返回上级节点 -->
            <el-button type="primary" plain @click="$router.push({path: state.sourceUrlObject.path, query:state.sourceUrlObject.query})">返回</el-button>
        </div>
        <div class="helpViewModule" v-if="state.help != undefined && state.help != null && Object.keys(state.help).length>0">
            <div class="help-wrap">
                <div class="helpTag">
                    <span class="tag">{{state.help.helpTypeName}}</span>
                </div>
                <div class="operat">
                    <el-link class="item" :disabled="!verifyPermissionMenu('/control/help/manage?method=edit&*','get')" href="javascript:void(0);" @click="$router.push({path: '/admin/control/help/manage/edit', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),helpView_beforeUrl:($route.query.helpView_beforeUrl != undefined ? $route.query.helpView_beforeUrl:''),helpId :state.help.id, page:($route.query.page != undefined ? $route.query.page:''), helpPage:($route.query.page != undefined ? $route.query.page:'')}})">修改</el-link>
                    <el-link class="item" :disabled="!verifyPermissionMenu('/control/help/manage?method=delete*','post')" href="javascript:void(0);" @click="deleteHelp(state.help.id)">删除</el-link>
                </div>
                <div class="head">
                    <div class="title">
                        {{state.help.name}}
                    </div>
                    <div class="helpInfo clearfix" >
                        <div class="userName" title="员工名称">
                            {{state.help.userName}}
                        </div>
                        <div class="postTime" title="发表时间">{{state.help.times}}</div>
                        <div class="rightTag" >
                            <div class="statusTagInfo">
                                <span class="red-tag" v-if="state.help.visible == false" title="帮助状态">员工删除</span>		
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main" :ref="'help_'+state.help.id">
                    <RenderTemplate :html="state.help.content"></RenderTemplate>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'helpView',
    beforeRouteEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        //上级路由编码
        if(to.query.helpView_beforeUrl == undefined || to.query.helpView_beforeUrl==''){//前一个URL
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
			
			
			let newFullPath = updateURLParameter(to.fullPath,'helpView_beforeUrl',encrypt);
			
			to.fullPath = newFullPath;
			
			let paramGroup = to.query;
			paramGroup.helpView_beforeUrl = encrypt;
			to.query = paramGroup;
		}
        next()
    }
}
</script>

<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onMounted,reactive } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { NavigationGuardNext, RouteLocationNormalized, useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { processErrorInfo,getLanguageClassName, updateURLParameter,verifyPermissionMenu } from '@/utils/tool';
    import { SourceUrl, Help } from '@/types';
    import { enc} from 'crypto-js';
    import Hls from 'hls.js';
    import DPlayer from 'dplayer';
    import { escapeHtml, escapeVueHtml } from '@/utils/escape';
    import Prism from "prismjs";
    import { nativeQueryVideoRedirect } from '@/utils/http';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        id:'',
        help:{} as Help,
        
        playerIdList: [] as Array<string>,//视频播放Id列表
		playerObjectList: [] as Array<any>,//视频播放对象集合
        playerHlsList: [] as Array<any>,//视频播放流对象集合
		playerNodeList: [] as Array<any>,//视频节点对象集合

        sourceUrlObject:{} as SourceUrl,//来源URL对象
    });

    //查询帮助
    const queryHelp = () => {
        state.help = {} as Help;


        proxy?.$axios({
            url: '/control/help/manage',
            method: 'get',
            params: {
                method : 'view',
			    helpId : state.id,
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        let help = returnValue.data;
			    		
			    		//清空播放器
						clearVideoPlayer();
								
								
								
						//处理自定义标签
						let contentNode = document.createElement("div");
						contentNode.innerHTML = help.content;
								
						bindNode(contentNode);
						help.content = escapeVueHtml(contentNode.innerHTML);
								
								
						state.help = help;
									
                        nextTick(()=>{
                            setTimeout(function() {
                                renderVideoPlayer();//渲染视频播放器
                            }, 30);

                            //渲染代码
                            let topicRefValue = proxy?.$refs['help_'+state.id];
                            if(topicRefValue != undefined){
                                renderBindNode(topicRefValue); 
                            }
                        });
						
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

    //递归绑定节点参数
    const bindNode = (node:any) => {
        
        
        //先找到子节点
        let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
                //处理图片
                if(childNode.nodeName.toLowerCase() == "img" ){
                    let src = childNode.getAttribute("src");
                    
                    childNode.removeAttribute("src");//将原节点src属性删除，防止多请求一次
                
                    let html = '';
                    let style = '';
                    if(childNode.getAttribute("width") != null){//如果是表情，表情图不放大
                        style = 'style="width: '+childNode.getAttribute("width")+'; height: '+childNode.getAttribute("height")+'"';
                        html = '<el-image src="'+store.apiUrl+src+'" '+style+' loading="lazy" ></el-image>';
                    }else{
                    
                        html = '<el-image src="'+src+'" '+style+' :preview-src-list=["'+src+'"] lazy hide-on-click-modal ></el-image>';
                    }
                    //创建要替换的元素
                //	let html = '<el-image src="'+src+'" '+style+' lazy></el-image>';
                //	let html = '<el-image src="'+src+'" '+style+' :preview-src-list=["http://127.0.0.1:8080/cms/common/tttttt/templates.jpg"] lazy hide-on-click-modal ></el-image>';
                    
                
                
                //	let html = '<el-image src="backstage/images/null.gif" lazy></el-image>';
                    let placeholder = document.createElement('div');
                    placeholder.innerHTML = html;
                    let node = placeholder.childNodes[0];
                //	node.setAttribute("src",src);
                    childNode.parentNode.replaceChild(node,childNode);//替换节点	 
                }
                
                //处理表格 (解决Chrome内核浏览器DPI缩放比例高于100%时部分边框变粗问题，需要CSS配合)
                if(childNode.nodeName.toLowerCase() == "table" ){
                    childNode.removeAttribute("border");
                    childNode.removeAttribute("bordercolor");
                }


                
                //处理视频标签
                if(childNode.nodeName.toLowerCase() == "player" ){
                    
                    let id = "player_"+random+"_"+i;
                    childNode.setAttribute("id",id);//设置Id
                    state.playerIdList.push(id);	
                }

                //处理下载
                if(childNode.nodeName.toLowerCase() == "a" ){
                    let href = childNode.getAttribute("href")
                    let title = childNode.innerText;
                    let linkType = childNode.getAttribute("linkType")
                    //let startUrl = store.apiUrl+"fileDowload?jump=";
                    if(linkType == "download"  && href != ""){
                        childNode.setAttribute("class","download");
                        let downloadHtml ='<Download class="link-icon"></Download>'+escapeHtml(title);
                        childNode.innerHTML =downloadHtml;
                    }
                }

                
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){
                    let pre_html = childNode.innerHTML;
                    let class_val = childNode.className;
                    let lan_class = "";
                    
                    let class_arr = new Array();
                    class_arr = class_val.split(' ');
                    
                    for(let k=0; k<class_arr.length; k++){
                        let className = class_arr[k].trim();
                        
                        if(className != null && className != ""){
                            if (className.lastIndexOf('lang-', 0) === 0) {
                                lan_class = className;
                                break;
                            }
                        }
                    }
                    
                    childNode.className = "line-numbers "+getLanguageClassName(lan_class);
                    childNode.setAttribute("data-prismjs-copy","复制");
                    childNode.setAttribute("data-prismjs-copy-error","按Ctrl+C复制");
                    childNode.setAttribute("data-prismjs-copy-success","复制成功");


                    let nodeHtml = "";

                    //删除code节点
                    let preChildNodeList = childNode.childNodes;
                    for(let p = 0;p < preChildNodeList.length;p++){
                        let preChildNode = preChildNodeList[p];
                        if(preChildNode.nodeName.toLowerCase() == "code" ){
                            nodeHtml += preChildNode.innerHTML;
                            preChildNode.parentNode.removeChild(preChildNode);
                        }
                        
                    }
                    
                    let dom = document.createElement('code');
                    dom.className = "line-numbers "+getLanguageClassName(lan_class);
                    dom.innerHTML=nodeHtml;
                    
                   
                    childNode.appendChild(dom);
                
                }
                
                bindNode(childNode);

                
            }
        }
    }


    //递归渲染绑定节点
    const renderBindNode = (node:any) => {	
         //先找到子节点
         let nodeList = node.childNodes;
        for(let i = 0;i < nodeList.length;i++){
            //childNode获取到到的节点包含了各种类型的节点
            //但是我们只需要元素节点  通过nodeType去判断当前的这个节点是不是元素节点
            let childNode = nodeList[i];
            let random = Math.random().toString().slice(2);
            //判断是否是元素节点。如果节点是元素(Element)节点，则 nodeType 属性将返回 1。如果节点是属性(Attr)节点，则 nodeType 属性将返回 2。
            if(childNode.nodeType == 1){
                //处理代码标签
                if(childNode.nodeName.toLowerCase() == "pre" ){
                    Prism.highlightAllUnder(childNode);
                }
                renderBindNode(childNode);
            }
        }
    }

    //清空播放器
    const clearVideoPlayer = () => {
        for(let i=0; i< state.playerObjectList.length; i++){
            let playerObject = state.playerObjectList[i];
            
            playerObject.destroy();//销毁播放器
        }
        for(let i=0; i< state.playerHlsList.length; i++){
            let hls = state.playerHlsList[i];
            hls.destroy();//销毁视频流
        }
        state.playerObjectList.length = 0;//清空数组
        state.playerHlsList.length = 0;//清空数组
        state.playerIdList.length = 0;//清空数组
        state.playerNodeList.length = 0;//清空数组
    }

    //渲染视频播放器
    const renderVideoPlayer = () => {
        
        for(let i=0; i< state.playerIdList.length; i++){
            let playerId = state.playerIdList[i];
            let url = document.getElementById(playerId)?.getAttribute("url");
            let cover = document.getElementById(playerId)?.getAttribute("cover");//封面
            let thumbnail = document.getElementById(playerId)?.getAttribute("thumbnail");//缩略图
            
            let dp = null;
            if(url == ""){//如果视频处理中
                dp = new DPlayer({
                    container: document.getElementById(playerId),//播放器容器元素
                    screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                    
                    video: {
                        
                    }
                });
                let dom = document.createElement('div');
                dom.innerHTML="<div class='dplayer-process'><div class='box'><div class='prompt'>视频处理中，请稍后再刷新</div></div></div>";
                document.getElementById(playerId)?.appendChild(dom);
            }else{

                if(cover != undefined && cover != "" && thumbnail != undefined && thumbnail != ""){//切片视频
                    let hls = null;
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url,
                            pic: cover,//视频封面
                            thumbnails: thumbnail,//视频预览图
                            type: 'customHls',
                            customType: {
                                customHls: function (video:any, player:any) {
                                    hls = new Hls();
                                    hls.loadSource(video.src);
                                    hls.attachMedia(video);
                                    hls.config.xhrSetup = (xhr, url) => {
                                        if(url.startsWith(store.apiUrl+"videoRedirect?")){//如果访问视频重定向页
                                            //如果使用重定向跳转时会自动将标头Authorization发送到seaweedfs，seaweedfs会报501错误 A header you provided implies functionality that is not implemented
                                            //这里发送X-Requested-With标头到后端，让后端返回需要跳转的地址
                                            let videoRedirectDate = {} as any;
                                            nativeQueryVideoRedirect(url,function(date:any){
                                                videoRedirectDate = date;
                                            });

                                            if(videoRedirectDate != null && Object.keys(videoRedirectDate).length>0 && videoRedirectDate.redirect != ''){
                                                //告诉hls重新发送ts请求
                                                xhr.open("GET", videoRedirectDate.redirect, true);//用重定向后的地址请求
                                                //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                            }
                                        }else{
                                            // 请求ts的url 添加参数 props.fileid
                                            //url = url + "?t=" + props.fileid;
                                            // 这一步必须 告诉hls重新发送ts请求
                                            xhr.open("GET", url, true);
                                            //xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                                        }
                                    };
                                },
                            },
                        }
                    });
                    state.playerHlsList.push(hls);
                }else{
                    dp = new DPlayer({
                        container: document.getElementById(playerId),//播放器容器元素
                        screenshot: false,//开启截图，如果开启，视频和视频封面需要开启跨域
                        
                        video: {
                            url: url
                        }
                    });
                }
                
            }
            state.playerObjectList.push(dp);
        }
        
        
        //添加播放器节点数据
        if(state.playerObjectList.length >0){
            
            for(let i=0; i< state.playerIdList.length; i++){
                let playerId = state.playerIdList[i];
                let node = document.getElementById(playerId);//节点对象
                state.playerNodeList.push(node);
            }
        }
        
    }

    //删除帮助
    const deleteHelp = (helpId:string) => {
        ElMessageBox.confirm('此操作将删除该帮助, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('helpId', helpId);

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
                                message: '操作成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })

                            router.push({
				    			path: state.sourceUrlObject.path, 
				    			query:state.sourceUrlObject.query
							});
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
        .catch((error) => {
            console.log(error);
        });
    }

   

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

    
        if(router.currentRoute.value.query.helpId != undefined && router.currentRoute.value.query.helpId != ''){
			state.id = router.currentRoute.value.query.helpId as string;
		}
		
		//上级路由解码
		if(router.currentRoute.value.query.helpView_beforeUrl != undefined && router.currentRoute.value.query.helpView_beforeUrl != ''){
			let parsedWordArray = enc.Base64url.parse(router.currentRoute.value.query.helpView_beforeUrl as string);
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
		queryHelp();
    }) 

    
</script>
<style scoped lang="scss">
/* 帮助查看 */
.helpViewModule{
    .help-wrap{
        background: #fff;
        position: relative;
        .helpTag{
            padding-top:15px;
            margin-left:10px;
            .tag{
                display: inline-block;
                font-size: 14px;
                line-height: 14px;
                padding: 6px 8px 6px 8px;
                margin-right: 5px;
                border-radius: 3px;
                color: #555;
                background-color: #f5f5f6;
                position:relative;
            }
        }
        .operat{
            position: absolute;
            top: 18px;
            right: 10px;
            .item{
                margin-left: 10px;
                line-height: 24px;
            }
        }
        .head{
            height: auto;
            padding:15px 10px 5px 10px;
            .title{
                color:#303133;
                font-size:24px;
                border:none;
                line-height:34px; 
                margin:9px 0 18px 0;
            }
            .helpInfo{
                color: #909399;
                font-size: 14px;
                .userName{
                    float: left;
                }
                .postTime{
                    float: left;
                    margin-left: 20px;
                }
                .rightTag{
                    float: right;
                    position: relative;
                    top: 0px;
                    .statusTagInfo{
                        position: absolute;right:0px; top: -12px;white-space: nowrap;
                    }
                }
                .green-tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    border-radius: 3px;
                    color:#67C23A;
                    background-color:#e1f3d8;
                    margin-left: 6px;
                }
                .orange-tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    border-radius: 3px;
                    color:#E6A23C;
                    background-color:#faecd8;
                    margin-left: 6px;
                }
                .red-tag{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 14px;
                    padding: 6px 8px 6px 8px;
                    border-radius: 3px;
                    color:#F56C6C;
                    background-color:#fde2e2;
                    margin-left: 6px;
                }
            }
        }
        :deep(.main) {
            margin: 0px 10px 10px 10px;
            padding-top:10px;
            padding-bottom:15px;
            min-height: 80px;
            font-size: 15px;
            line-height: 1.8;
            color: #222;
            border-top: 1px solid #f1f1f1;
            word-wrap:break-word;
            a{
                font-size: 15px;
                line-height: 1.8;
                color: #26a2ff;
            }
            i {
                font-style:normal;
            }
            p{word-wrap:break-word;}
            /* 自动换行 */
            pre{
                white-space:pre-wrap;
                code{/*连续字母数字换行*/
                    word-break: break-all;
                }
            }
            img{
                max-width:100%;height:auto;border:none;background:none;padding:0;vertical-align: sub;
            }
            .el-image[style*="width: 32px; height: 32px;"]{
                top: 3px;
            }
            iframe{
                width:100%; height: 550px;padding:10px 0px; 
            }
            video{
                width:100%; height: 550px;padding:10px 0px; outline:none;
            }
            .download{
                color: #1890ff;
                margin: 0 5px 0 5px;
                cursor: pointer;
                .link-icon {
                    position: relative;
                    top: 4px;
                    margin-right: 2px;
                    color:#1890ff;
                    width: 20px; height: 20px;
                }
            }
            table {
                width: 100%;
                th {
                    font-weight: 600
                }
                td,
                th {
                    border: 1px solid #E5E6EB;
                    padding: 6px 13px
                }
                tr {
                    background-color: #fff;
                    border-top: 1px solid #E5E6EB;
                    &:nth-child(2n) {
                        background-color: #F7F8FA;
                    }
                }
            }
            ol{
                li{ 
                    list-style-type:decimal;
                    list-style-position:inside;
                }
            }
            ul{
                li{ 
                    margin-left:20px;
                    list-style-type:disc;
                }
            }
            player{
                display: block;
                margin-top: 8px;
                height: 576px;
            }
            .dplayer-process {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 99;
                .box{
                    position: relative;
                    width: 100%;
                    height: 100%;
                    .prompt{
                        width: 250px;
                        height: 80px;
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        padding :0px 30px;
                        border-radius :3px;
                        color: #fff;
                        line-height: 80px;
                        font-size: 20px;
                        background-color:rgb(0,0,0);
                        opacity:0.7;
                        filter:alpha(opacity=70);
                        text-align: center;
                    }
                }
            }
        }



    }
    .el-link--default{
        color: #909399 !important;
        &:hover {
            color: #409EFF !important;
        }
    }
    .el-link--default.is-disabled{
        color: #dedfe0 !important;
        cursor: not-allowed !important;
    }
}
</style>