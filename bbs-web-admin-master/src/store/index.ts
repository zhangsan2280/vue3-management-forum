import { PermissionMenu, SystemUser } from "@/types";
import { defineStore } from "pinia";
import createRouter from '@/router'
import * as extension from "@/utils/extension";
const extensionFunction = extension;

 /**
  * 定义容器并导出
  * 参数一: 容器ID, 唯一, Pinia 会把所有的容器挂载到根容器
  * 参数二: 选项对象
  * 返回值: 函数, 调用的时候要空参调用, 返回容器实例
  */
export const useStore = defineStore('main', {
     /**
      * 类似组件的 data, 用于存储全局的的状态
      * 注意:
      *    1.必须是函数, 为了在服务端渲染的时候避免交叉请求导致的数据交叉污染
      *    2.必须是箭头函数, 为了更好的 TS 类型推导
      */
     state: () => {
         return {
            apiUrl: import.meta.env.VITE_API_URL,//后端地址
            
            transparentImage:'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',//透明1像素图片

            fileStorageSystem : 0, //文件存储系统 0.本地系统 10.SeaweedFS 20.MinIO 30.阿里云OSS
            
			permissionMenuList:[] as Array<PermissionMenu>,//权限菜单
			
            windowBrowseStatus :new Map(),//窗口浏览状态  key:导航索引 value:{isRecordPath:true,step:0}     isRecordPath:是否记录路径  step:步长 0为没有执行"前进/后退"命令
            historyPath :new Map(),//历史路径记录  key:导航索引 value: 浏览URL全路径集合
            
            cacheComponents: [] as any,//keepAlive缓存组件
         }
     },
     /**
      * 类似组件的 computed, 用来封装计算属性, 具有缓存特性
      */
     getters: {
        getCacheComponents: function (state) {
            return state.cacheComponents;
        },
		//keep-alive缓存key
		getCacheKey: function () {
			let cacheNumber = "";
			
			//当前窗口索引
		    let currentWindowIndex = "";
		    
		    let _linkTag = window.sessionStorage.getItem('linkTag');
			if(_linkTag != null){
				let linkTag = JSON.parse(_linkTag);
				for(let i=0; i<linkTag.length; i++){
		    		let _tag = linkTag[i];
		    		if(_tag.active){//如果已激活
		    			currentWindowIndex = _tag.index;
		    			break;
		    		}
				}
			}
			
			let routes =  createRouter.getRoutes();
			
			for(let i=0; i<routes.length; i++){
				let _children = routes[i].children;
				if(_children != null && _children.length){
					for(let j=0; j<_children.length; j++){
					   let _route_children:any = _children[j];
					  
					   if(_route_children.meta.index == currentWindowIndex){
							cacheNumber = _route_children.meta.cacheNumber;
					   }
				   }
			   }   
			}
			return currentWindowIndex+"::"+cacheNumber+"::"+createRouter.currentRoute.value.fullPath;
		},
		
		//后台管理框架--左侧菜单栏链接
		allLinkList: function (state) {
			let arr = new Array();
            let routes =  createRouter.getRoutes();
			for(let i=0; i<routes.length; i++){
				let _children = routes[i].children;
				if(_children != null && _children.length){
					for(let j=0; j<_children.length; j++){
					   let _route_children = _children[j];
					   arr.push(_route_children);
				   }
			   }   
			}
			return arr;
		},
      
    },
    /**
      * 类似组件的 methods, 封装业务逻辑, 修改state
      * 注意: 里面的函数不能定义成箭头函数(函数体中会用到this)
      */
    actions: {
        //设置文件存储系统
		setFileStorageSystem : function (fileStorageSystem:number) {
			this.fileStorageSystem = fileStorageSystem;
		},

        //设置缓存组件
        setCacheComponents: function (name:string) {
            if(!this.cacheComponents.contains(name)){
                this.cacheComponents.push(name);
            }
        },
		//删除缓存组件
        deleteCacheComponents: function (name:string) {
			let index = this.cacheComponents.indexOf(name);
            if(index != -1){
				this.cacheComponents.splice(index, 1); 
            }
        },
        //设置缓存编号
		setCacheNumber : function () {
			//当前窗口索引
		    let currentWindowIndex = "";
		    
		    let _linkTag = window.sessionStorage.getItem('linkTag');
			if(_linkTag != null){
				let linkTag = JSON.parse(_linkTag);
				for(let i=0; i<linkTag.length; i++){
		    		let _tag = linkTag[i];
		    		if(_tag.active){//如果已激活
		    			currentWindowIndex = _tag.index;
		    			break;
		    		}
				}
			}
            let routes =  createRouter.getRoutes();
			for(let i=0; i<routes.length; i++){
				let _children = routes[i].children;
				if(_children != null && _children.length){
					for(let j=0; j<_children.length; j++){
					   let _route_children:any = _children[j];
					   if(_route_children.meta.index == currentWindowIndex){
							_route_children.meta.cacheNumber = new Date().getTime();
					   }
				   }
			   }   
			}
		},


        //添加历史路径记录
        addHistoryPath:  function (object:any){
            this.historyPath.set(object.key,object.value);
        },
        //删除历史路径记录 index:当前窗口导航索引
        deleteHistoryPath: function (index:string){
            
            this.historyPath.delete(index);
            
        },
        //清空历史路径记录
        clearHistoryPath:  function (){
            this.historyPath.clear();		
        },

        //添加窗口浏览状态
        addWindowBrowseStatus:  function (object:any){	
            this.windowBrowseStatus.set(object.key,object.value);
        },
        //删除窗口浏览状态 index:当前窗口导航索引
        deleteWindowBrowseStatus:  function (index:string){
            this.windowBrowseStatus.delete(index);
        },
        //清空窗口浏览状态
        clearWindowBrowseStatus:  function (){
            this.windowBrowseStatus.clear();		
        },

 
    }
})
