// AJAX请求
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import {ElLoading, ElMessage, ElMessageBox} from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'
import createRouter from '@/router'
import debounce from "lodash/debounce";
import pinia from '@/store/store'
import {useStore} from '@/store'
import { storeToRefs } from 'pinia';
import { createJumpAttribute} from '@/utils/jumpProcess';

const store = useStore(pinia)

//loading对象
let loadingInstance :LoadingInstance | null;
//loading当前正在请求的数量
let needLoadingRequestCount: number = 0;

//显示loading
const showLoading = (target:string | HTMLElement | undefined, mask:boolean=true) => {
	//解决加载图标抖动问题. 关闭时loading对象可能还存在，但needLoadingRequestCount已经变成0.避免这种情况下会重新创建loading
	if (needLoadingRequestCount === 0 && !loadingInstance) {
		loadingInstance = ElLoading.service({
		   // lock: mask ? true :false,//加载时全屏幕锁定
		   //   text: '加载中...',
		   // fullscreen: mask ? true :false,//全屏遮罩
		  //  target: target || "document.body",
		    background: mask ? 'rgba(255, 255, 255, 0.5)' :'rgba(255, 255, 255, 0)',
		    customClass : mask ? '' :'loading-noOverlay-custom'//遮罩层
		});
	}
	needLoadingRequestCount++;
}
//隐藏loading
const hideLoading = () => {
	needLoadingRequestCount--;
	needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
	if (needLoadingRequestCount === 0) {
		//关闭loading
		toHideLoading();
	}
}

//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
let toHideLoading = debounce(()=>{
	if(loadingInstance){
		loadingInstance.close();
		loadingInstance = null;
	}
}, 300);



//MessageBox当前正在显示的数量
let needMessageBoxRequestCount: number = 0;

//显示MessageBox
const showMessageBox = (message: string) => {
    if (needMessageBoxRequestCount === 0) {//只显示第一个
        ElMessageBox.alert(message, '通知', {
            showClose: false,
            showConfirmButton: false,
        });
    }
    needMessageBoxRequestCount++;
}




const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // 定义请求超时时间
    timeout: 20000,
    // 请求带上 cookie
    withCredentials: true,
    // 定义消息头
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        post: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    //设置csrf请求头。前后端分离使用localStorage保存登录状态时可以不配置xsrf
	xsrfCookieName : 'XSRF-TOKEN',
	xsrfHeaderName : 'X-XSRF-TOKEN'
})
export default axiosInstance

//请求拦截器
axiosInstance.interceptors.request.use((config: any) => {
    if (config.headers === undefined) {
        config.headers = {};
    }


    //判断当前请求是否设置了不显示Loading
    if(config.showLoading !== false){
        showLoading(config.loadingTarget as string | HTMLElement,config.loadingMask as boolean);
    }
    if (config.method === 'get' && config.timestamp !== false){
        if(config.params != undefined){
            //增加时间戳
            Object.assign(config.params, { //如果get请求本身带有参数，给options.params 再添加一个key值_t,值为时间戳
                _t: new Date().getTime(),
            })
        }else{
            config.params={_t: new Date().getTime()}
        }
    }

    //从sessionStorage中获取登录令牌
	let oauth2Token = window.sessionStorage.getItem('oauth2Token');
	if(oauth2Token != null){
		let oauth2Object = JSON.parse(oauth2Token);
		// 让每个请求携带会话token  ['Authorization']
        config?.headers?.set('Authorization','')
		config.headers['Authorization'] = 'Bearer '+oauth2Object.access_token;//如果将过期的access_token提交到后端让令牌提取器解析，会返回401错误。注意:不需要登录后才能查看的页面不要携带本参数，如登录页和刷新令牌页不要提交此参数，目前无需登录的页面携带了本参数的请求由后端过滤去掉
	}
	

    return config
  },
  (error: any) => {
    //判断当前请求是否设置了不显示Loading
    if(error.config.showLoading !== false){
        hideLoading();
    }

    return Promise.resolve(error)
});


let isRefreshing:boolean = false // 标记是否正在刷新 token
let requests: ((sessionToken: any) => void)[] = [] // 存储待重发请求的数组

//响应拦截器
axiosInstance.interceptors.response.use((response: AxiosResponse) => {
        if (response.config.headers === undefined) {
            response.config.headers = {};
        }
    
      //  console.log("响应拦截器 ",createRouter.currentRoute.value);

            
        //判断当前请求是否设置了不显示Loading
        if(response.config.showLoading !== false){
            hideLoading();
        }  
  
        return response;
    },
  // 请求失败
    (error: any) => {
        if(error.response){
            switch (error.response.status) {
                case 400: 
                    ElMessage({
                        duration :0,
                        showClose: true,
                        message: '请求无效（400）',
                        type: 'error',
                    })
                    break;
                case 401: 
                    if(!error.config.url.includes('/admin/refreshToken')){//如果不是请求会话续期
                        const { config } = error;
                            
                        if (!isRefreshing) {
                            let newAccessToken = "";
                            isRefreshing = true;
                            return refreshToken().then(res=> {
                                if(res){
                                    let result: any = res.data;
                                    
                                    if(result){
                                        let returnValue = JSON.parse(res.data);
                                        if(returnValue.code === 200){//成功
								    		let oauth2Object = returnValue.data;
            
                                            //手动添加标头 解决响应拦截器重试请求报is not a valid HTTP header field value错误https://github.com/axios/axios/issues/5143
                                            const originalConfig = error.config; 
                                            originalConfig!.headers = { ...originalConfig!.headers };

                                            // 让每个请求携带会话token  ['Authorization']
                                            config.headers['Authorization'] = 'Bearer '+oauth2Object.access_token;
                                            //写入sessionStorage中
                                            window.sessionStorage.setItem('oauth2Token', JSON.stringify(oauth2Object));
                                            newAccessToken = oauth2Object.access_token;
                                            // token 刷新后将数组的方法重新执行
                                            //requests.forEach((cb) => cb(oauth2Object.access_token));
                                            //requests = []; // 重新请求完清空
                                            return axiosInstance(config)	
								    	}else if(returnValue.code === 500){//错误
								    		//删除会话token
											window.sessionStorage.removeItem('oauth2Token');
                                            ElMessage({
                                                showClose: true,
                                                message: '身份验证会话已过期，请重新登录',
                                                type: 'error',
                                            })
											
											if(createRouter.currentRoute.value.path =="/admin/login"){
                                                createRouter.push({
                                                    path : '/admin/login'
                                                });
                                            }else{
                                                   
                                                if(error.config.method == "post"){ //直接执行post请求后未登录跳转后不会新增浏览历史记录
                                                    createRouter.push({
                                                        path : '/admin/login',
                                                        query:{
                                                            jumpUrl :createJumpAttribute()
                                                        }
                                                    });
                                                }else{
                                                    createRouter.replace({
                                                        path : '/admin/login',
                                                        query:{
                                                            jumpUrl :createJumpAttribute()
                                                        }
                                                    });
                                                }
                                                
                                            }
								    		
								    	}
                                    }
                                }
                            }).catch(err => {
                                
                                //如果refreshToken()没读取到参数
                               //删除会话token
								window.sessionStorage.removeItem('oauth2Token');
                                createRouter.push({
                                    path : '/admin/login'
                                });
                                
                                //判断当前请求是否设置了不显示Loading
                                if(error.config.showLoading !== false){
                                    hideLoading();
                                }
                                return Promise.reject(err)
                            }).finally(() => {
                                if(requests.length >0 && newAccessToken != null && newAccessToken != ''){
                                    // token 刷新后将数组的方法重新执行
                                    requests.forEach((cb) => cb(newAccessToken));
                                    requests = []; // 重新请求完清空
                                   
                                }
                                isRefreshing = false;
                                //判断当前请求是否设置了不显示Loading
                                if(error.config.showLoading !== false){
                                    hideLoading();
                                }
                            });
                        }else {
                            // 返回未执行 resolve 的 Promise
                            return new Promise(resolve => {
                                // 用函数形式将 resolve 存入，等待刷新后再执行
                                requests.push(sessionToken => {
                                    config.headers['Authorization'] = 'Bearer '+sessionToken;
                                    resolve(axiosInstance(config))
                                });
                                if(error.config.showLoading !== false){;
                                    hideLoading();
                                }
                            })
                        }

                    }else{
                        //删除会话token
						window.sessionStorage.removeItem('oauth2Token');
                        ElMessage({
                            showClose: true,
                            message: '请求刷新令牌出错，请重新登录',
                            type: 'error',
                        })
                        createRouter.push({
                            path : '/admin/login'
                        });
                    }
                    break;
                case 403: 
                    ElMessage({
                        showClose: true,
                        message: '拒绝访问'+(error.response.headers.message != undefined ? '（'+decodeURIComponent(error.response.headers.message)+'）' :""),//XSRF-TOKEN验证未通过:Invalid CSRF Token 'null' was found on the request parameter '_csrf' or header 'X-XSRF-TOKEN'； 会员角色没有访问当前URL的权限:没有权限访问
                        type: 'error',
                    })
                    break;
                case 404: 
                    ElMessage({
                        duration :0,
                        showClose: true,
                        message: '找不到您尝试加载的网页（404）'+error.response.config.url,
                        type: 'error',
                    })
                    break;	
                case 500: 
                    ElMessage({
                        duration :0,
                        showClose: true,
                        message: '服务器错误（500）',
                        type: 'error',
                    })
                    break;	
                default: 
                    ElMessage({
                        duration :0,
                        showClose: true,
                        message: '请求错误（'+error.response.status+'）',
                        type: 'error',
                    })
            }
        }else{
            //网络连接失败
            //ElMessage({
            //   duration :0,
            //    showClose: true,
            //    message: '请求失败（'+error.code+'：'+error.message+'）',
            //    type: 'error',
            //})
        }
        
        //判断当前请求是否设置了不显示Loading
        if(error.config.showLoading !== false){
            hideLoading();
        }
        return Promise.reject(error.response);
});


//会话续期
export let refreshToken = function(){
	//刷新 access_token 的接口
	let formData = new FormData();

	
	//从sessionStorage中获取登录令牌
	let oauth2Token = window.sessionStorage.getItem('oauth2Token');
	if(oauth2Token != null){
		let oauth2Object = JSON.parse(oauth2Token);
	    formData.append('refresh_token',oauth2Object.refresh_token);
	}else{
	//	return new Promise(function (resolve) {});
		return Promise.reject("Token参数不存在");
	}

	return axiosInstance({
	    method: 'post',
	    url: '/admin/refreshToken',
	    data: formData,
	    headers: {
	      	'showLoading': false,//是否显示图标
	      	'loadingMask':false// 是否显示遮罩层
	    }
	});
	//.then(function (response) {
	//	return Promise.resolve(response);

	//});
};

//原生ajax查询视频重定向（在Hls.js监听事件里调用axios会发生错误，这里用原生方法代替）
export let nativeQueryVideoRedirect = (url:string,callback:any) =>{
    let xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open('GET', url , false);//同步
    xmlhttp.setRequestHeader("X-Requested-With","XMLHttpRequest");//标记报头为AJAX

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4) {//readystate 
            if(xmlhttp.status == 200){
                let result = xmlhttp.responseText;
                if(result != ""){
                    let date = JSON.parse(result);
                    callback(date);
                }
            }
        }
    };
    xmlhttp.send(null);
};
