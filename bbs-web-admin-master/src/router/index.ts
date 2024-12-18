import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'
import pinia from '@/store/store'
import {useStore} from '@/store'

const routes = [
    {path : '/admin/control/manage/index',component: () => import('@/views/index.vue'),
        children: [//嵌套一级子路由
            {path : '/admin/control/manage/home',component: () => import('@/views/home.vue'), name:'home',meta: {index:'0-000000-0',title:'首页',cacheNumber:'0'}}, //首页
            {path : '/admin/control/topic/list',component: () => import('@/views/topic/topicList.vue'), name:'topicList',meta: {index:'1-100100-1',title:'话题列表',cacheNumber:'0'}},//话题列表
            {path : '/admin/control/topic/manage/view',component : () => import('@/views/topic/topicView.vue'),name:'topicView',meta: {parent:'1-100100-1',title:'话题内容',}},//话题内容
            {path : '/admin/control/topic/manage/add',component : () => import('@/views/topic/addTopic.vue'),name:'addTopic',meta: {parent:'1-100100-1',title:'添加话题'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'topicList'){//如果来自话题列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加话题
            {path : '/admin/control/topic/topicUnhideList',component : () => import('@/views/topic/topicUnhideList.vue'),name:'topicUnhideList',meta: {parent:'1-100100-1',title:'解锁隐藏内容用户',}},//解锁隐藏内容用户
            {path : '/admin/control/tag/list',component : () => import('@/views/topic/tagList.vue'),name:'tagList',meta: {index:'1-100100-2',title:'标签列表',cacheNumber:'0'}},//标签列表
           
            {path : '/admin/control/tag/manage/add',component : () => import('@/views/topic/addTag.vue'),name:'addTag',meta: {parent:'1-100100-2',title:'添加标签'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'tagList'){//如果来自标签列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加标签
            {path : '/admin/control/tag/manage/edit',component : () => import('@/views/topic/editTag.vue'),name:'editTag',meta: {parent:'1-100100-2',title:'修改标签'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'tagList'){//如果来自标签列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改标签
            {path : '/admin/control/topic/allAuditTopic',component : () => import('@/views/topic/allAuditTopic.vue'), name:'allAuditTopic',meta: {index:'1-100100-3',title:'全部待审核话题',cacheNumber:'0'}},//全部待审核话题
            {path : '/admin/control/topic/allAuditComment',component : () => import('@/views/topic/allAuditComment.vue'), name:'allAuditComment',meta: {index:'1-100100-4',title:'全部待审核评论',cacheNumber:'0'}},//全部待审核评论
            {path : '/admin/control/topic/allAuditReply',component : () => import('@/views/topic/allAuditReply.vue'), name:'allAuditReply',meta: {index:'1-100100-5',title:'全部待审核回复',cacheNumber:'0'}},//全部待审核回复
            {path : '/admin/control/topic/search',component : () => import('@/views/topic/topicSearch.vue'), name:'topicSearch',meta: {index:'1-100100-6',title:'话题搜索',cacheNumber:'0'}},//话题搜索
             
            
            {path : '/admin/control/question/list',component : () => import('@/views/question/questionList.vue'), name:'questionList',meta: {index:'1-100200-1',title:'问题列表',cacheNumber:'0'}},//问题列表
            
            {path : '/admin/control/question/manage/view',component : () => import('@/views/question/questionView.vue'),name:'questionView', meta: {parent:'1-100200-1',title:'问题内容',}},//问题内容
           
            {path : '/admin/control/question/manage/add',component : () => import('@/views/question/addQuestion.vue'),name:'addQuestion',meta: {parent:'1-100200-1',title:'添加问题'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'questionList'){//如果来自问题列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加问题
            {path : '/admin/control/questionTag/list',component : () => import('@/views/question/questionTagList.vue'), name:'questionTagList',meta: {index:'1-100200-2',title:'问题标签列表',cacheNumber:'0'}},//问题标签列表
            {path : '/admin/control/questionTag/manage/add',component : () => import('@/views/question/addQuestionTag.vue'),name:'addQuestionTag',meta: {parent:'1-100200-2',title:'添加问题标签'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'questionTagList'){//如果来自标签列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加问题标签
            {path : '/admin/control/questionTag/manage/edit',component : () => import('@/views/question/editQuestionTag.vue'),name:'editQuestionTag',meta: {parent:'1-100200-2',title:'修改问题标签'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'questionTagList'){//如果来自标签列表,则删除缓存
                         store.setCacheNumber()
                    }
                    next();
                }
            },//修改问题标签
            {path : '/admin/control/question/allAuditQuestion',component : () => import('@/views/question/allAuditQuestion.vue'), name:'allAuditQuestion',meta: {index:'1-100200-3',title:'全部待审核问题',cacheNumber:'0'}},//全部待审核问题
            {path : '/admin/control/question/allAuditAnswer',component : () => import('@/views/question/allAuditAnswer.vue'), name:'allAuditAnswer',meta: {index:'1-100200-4',title:'全部待审核答案',cacheNumber:'0'}},//全部待审核答案
            {path : '/admin/control/question/allAuditAnswerReply',component : () => import('@/views/question/allAuditAnswerReply.vue'), name:'allAuditAnswerReply',meta: {index:'1-100200-5',title:'全部待审核回复',cacheNumber:'0'}},//全部待审核回复
            {path : '/admin/control/question/search',component : () => import('@/views/question/questionSearch.vue'), name:'questionSearch',meta: {index:'1-100200-6',title:'问题搜索',cacheNumber:'0'}},//问题搜索
            
            
            {path : '/admin/control/feedback/list',component : () => import('@/views/feedback/feedbackList.vue'), name:'feedbackList',meta: {index:'1-100300-1',title:'留言列表',cacheNumber:'0'}},//留言列表
            {path : '/admin/control/feedback/manage/view',component : () => import('@/views/feedback/feedbackView.vue'),name:'feedbackView',meta: {parent:'1-100300-1',title:'留言查看'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'feedbackList'){//如果来自留言列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//留言查看
            {path : '/admin/control/links/list',component :  () => import('@/views/links/linksList.vue'), name:'linksList',meta: {index:'1-100400-1',title:'友情链接列表',cacheNumber:'0'}},//友情链接列表
            {path : '/admin/control/links/manage/add',component :  () => import('@/views/links/addLinks.vue'),name:'addLinks',meta: {parent:'1-100400-1',title:'添加友情链接'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'linksList'){//如果来自友情链接列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加友情链接
            {path : '/admin/control/links/manage/edit',component : () => import('@/views/links/editLinks.vue'),name:'editLinks',meta: {parent:'1-100400-1',title:'修改友情链接'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'linksList'){//如果来自友情链接列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改友情链接
            
            {path : '/admin/control/user/search',component : () => import('@/views/user/userSearch.vue'), name:'userSearch',meta: {index:'2-200100-1',title:'会员搜索',cacheNumber:'0'}},//会员搜索
            {path : '/admin/control/user/list',component : () => import('@/views/user/userList.vue'), name:'userList',meta: {index:'2-200100-2',title:'会员列表',cacheNumber:'0'}},//会员列表
            {path : '/admin/control/user/manage/show',component : () => import('@/views/user/userShow.vue'),name:'userShow',meta: {parent:'2-200100-2',title:'用户查看'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userList' || from.name == 'userSearch'){//如果来自会员列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//用户查看

            {path : '/admin/control/user/manage/add',component : () => import('@/views/user/addUser.vue'),name:'addUser',meta: {parent:'2-200100-2',title:'添加会员'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userList'){//如果来自会员列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加会员
            {path : '/admin/control/user/manage/edit',component : () => import('@/views/user/editUser.vue'),name:'editUser',meta: {parent:'2-200100-2',title:'修改会员'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userList'){//如果来自会员列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员
            {path : '/admin/control/user/manage/allTopic',component :() => import('@/views/user/allTopic.vue'),name:'allTopic',meta: {parent:'2-200100-2',title:'发表的话题'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userShow'){//如果来自用户查看,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//发表的话题
            {path : '/admin/control/user/manage/allComment',component : () => import('@/views/user/allComment.vue'),name:'allComment',meta: {parent:'2-200100-2',title:'发表的评论'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userShow'){//如果来自用户查看,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//发表的评论
            {path : '/admin/control/user/manage/allReply',component : () => import('@/views/user/allReply.vue'),name:'allReply',meta: {parent:'2-200100-2',title:'发表的回复'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userShow'){//如果来自用户查看,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//发表的回复
            {path : '/admin/control/user/manage/allQuestion',component : () => import('@/views/user/allQuestion.vue'),name:'allQuestion',meta: {parent:'2-200100-2',title:'发表的话题'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userShow'){//如果来自用户查看,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//发表的问题
            {path : '/admin/control/user/manage/allAnswer',component : () => import('@/views/user/allAnswer.vue'),name:'allAnswer',meta: {parent:'2-200100-2',title:'发表的评论'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userShow'){//如果来自用户查看,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//发表的答案
            {path : '/admin/control/user/manage/allAnswerReply',component : () => import('@/views/user/allAnswerReply.vue'),name:'allAnswerReply',meta: {parent:'2-200100-2',title:'发表的回复'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userShow'){//如果来自用户查看,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//发表的答案回复
             
            {path : '/admin/control/privateMessage/manage/privateMessageList',component : () => import('@/views/message/privateMessageList.vue'), name:'privateMessageList',meta: {parent:'2-200100-2',title:'私信列表'}},//私信列表
            {path : '/admin/control/privateMessage/manage/privateMessageChatList',component : () => import('@/views/message/privateMessageChatList.vue'), name:'privateMessageChatList',meta: {parent:'2-200100-2',title:'私信对话列表'}},//私信对话列表
            {path : '/admin/control/systemNotify/manage/subscriptionSystemNotifyList',component : () => import('@/views/message/subscriptionSystemNotifyList.vue'), name:'subscriptionSystemNotifyList',meta: {parent:'2-200100-2',title:'订阅系统通知列表'}},//订阅系统通知列表
            {path : '/admin/control/remind/manage/remindList',component : () => import('@/views/message/remindList.vue'), name:'remindList',meta: {parent:'2-200100-2',title:'提醒列表'}},//提醒列表
            {path : '/admin/control/favorite/list',component : () => import('@/views/favorite/favoriteList.vue'), name:'favoriteList',meta: {parent:'2-200100-2',title:'收藏夹列表'}},//收藏夹列表
            {path : '/admin/control/topicFavorite/list',component : () => import('@/views/favorite/topicFavoriteList.vue'), name:'topicFavoriteList',meta: {parent:'2-200100-2',title:'话题收藏夹列表'}},//话题收藏夹列表
            
            {path : '/admin/control/questionFavorite/list',component : () => import('@/views/favorite/questionFavoriteList.vue'), name:'questionFavoriteList',meta: {parent:'2-200100-2',title:'问题收藏夹列表'}},//问题收藏夹列表
            {path : '/admin/control/like/list',component : () => import('@/views/like/likeList.vue'), name:'likeList',meta: {parent:'2-200100-2',title:'点赞列表'}},//点赞列表
            {path : '/admin/control/topicLike/list',component :  () => import('@/views/like/topicLikeList.vue'), name:'topicLikeList',meta: {parent:'2-200100-2',title:'话题点赞列表'}},//话题点赞列表
            {path : '/admin/control/questionLike/list',component :  () => import('@/views/like/questionLikeList.vue'), name:'questionLikeList',meta: {parent:'2-200100-2',title:'问题点赞列表'}},//问题点赞列表
            
            {path : '/admin/control/follow/list',component : () => import('@/views/follow/followList.vue'), name:'followList',meta: {parent:'2-200100-2',title:'关注列表'}},//关注列表
            {path : '/admin/control/follower/list',component : () => import('@/views/follow/followerList.vue'), name:'followerList',meta: {parent:'2-200100-2',title:'粉丝列表'}},//粉丝列表
           
            {path : '/admin/control/membershipCard/manage/membershipCardOrderList',component : () => import('@/views/membershipCard/userMembershipCardOrderList.vue'), name:'userMembershipCardOrderList',meta: {parent:'2-200100-2',title:'用户会员卡订单列表'}},//用户会员卡订单列表

            {path : '/admin/control/membershipCardGiftTask/list',component : () => import('@/views/membershipCard/membershipCardGiftTaskList.vue'), name:'membershipCardGiftTaskList',meta: {index:'2-200200-3',title:'会员卡赠送任务列表',cacheNumber:'0'}},//会员卡赠送任务列表
            {path : '/admin/control/membershipCardGiftTask/manage/view',component : () => import('@/views/membershipCard/membershipCardGiftTaskView.vue'), name:'membershipCardGiftTaskView',meta: {parent:'2-200200-3',title:'会员卡赠送任务'}},//会员卡赠送任务
            {path : '/admin/control/membershipCardGiftTask/manage/add',component : () => import('@/views/membershipCard/addMembershipCardGiftTask.vue'),name:'addMembershipCardGiftTask',meta: {parent:'2-200200-3',title:'添加会员卡赠送任务'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'membershipCardGiftTaskList'){//如果来自会员卡赠送任务列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加会员卡赠送任务
            {path : '/admin/control/membershipCardGiftTask/manage/edit',component : () => import('@/views/membershipCard/editMembershipCardGiftTask.vue'),name:'editMembershipCardGiftTask',meta: {parent:'2-200200-3',title:'修改会员卡赠送任务'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'membershipCardGiftTaskList'){//如果来自会员卡赠送任务列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员卡赠送任务
            {path : '/admin/control/membershipCardGiftTask/manage/membershipCardGiftItemList',component : () => import('@/views/membershipCard/membershipCardGiftItemList.vue'), name:'membershipCardGiftItemList',meta: {index:'2-200200-3',title:'获赠用户列表',cacheNumber:'0'}},//查询会员卡赠送项(获赠用户)
           
            {path : '/admin/control/redEnvelope/giveRedEnvelope/list',component : () => import('@/views/redEnvelope/giveRedEnvelopeList.vue'), name:'giveRedEnvelopeList',meta: {parent:'2-200100-2',title:'发红包列表'}},//发红包列表
            {path : '/admin/control/redEnvelope/redEnvelopeAmountDistribution/list',component : () => import('@/views/redEnvelope/redEnvelopeAmountDistributionList.vue'), name:'redEnvelopeAmountDistributionList',meta: {parent:'2-200100-2',title:'发红包金额分配'}},//发红包金额分配
            {path : '/admin/control/redEnvelope/receiveRedEnvelope/list',component : () => import('@/views/redEnvelope/receiveRedEnvelopeList.vue'), name:'receiveRedEnvelopeList',meta: {parent:'2-200100-2',title:'收红包列表'}},//收红包列表
            
            {path : '/admin/control/pointLog/list',component : () => import('@/views/user/pointLogList.vue'), name:'pointLogList',meta: {parent:'2-200100-2',title:'积分日志列表'}},//积分日志列表
            {path : '/admin/control/pointLog/manage/show',component : () => import('@/views/user/pointLogShow.vue'), name:'pointLogShow',meta: {parent:'2-200100-2',title:'积分日志详细'}},//积分日志详细
            {path : '/admin/control/paymentLog/list',component : () => import('@/views/payment/paymentLogList.vue'), name:'paymentLogList',meta: {parent:'2-200100-2',title:'支付日志列表'}},//支付日志列表
            {path : '/admin/control/paymentLog/manage/show',component : () => import('@/views/payment/paymentLogShow.vue'), name:'paymentLogShow',meta: {parent:'2-200100-2',title:'支付日志详细'}},//支付日志详细
            {path : '/admin/control/userLoginLog/list',component : () => import('@/views/user/userLoginLogList.vue'), name:'userLoginLogList',meta: {parent:'2-200100-2',title:'登录日志列表'}},//登录日志列表
            
            
            {path : '/admin/control/userRole/list',component : () => import('@/views/user/userRoleList.vue'), name:'userRoleList',meta: {index:'2-200100-3',title:'会员角色',cacheNumber:'0'}},//会员角色
            {path : '/admin/control/userRole/manage/add',component : () => import('@/views/user/addUserRole.vue'),name:'addUserRole',meta: {parent:'2-200100-3',title:'添加会员角色'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userRoleList'){//如果来自会员角色列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加会员角色
            {path : '/admin/control/userRole/manage/edit',component : () => import('@/views/user/editUserRole.vue'),name:'editUserRole',meta: {parent:'2-200100-3',title:'修改会员角色'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userRoleList'){//如果来自会员角色列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员角色
            
            {path : '/admin/control/userGrade/list',component : () => import('@/views/user/userGradeList.vue'), name:'userGradeList',meta: {index:'2-200100-4',title:'会员等级',cacheNumber:'0'}},//会员等级
            {path : '/admin/control/userGrade/manage/add',component : () => import('@/views/user/addUserGrade.vue'),name:'addUserGrade',meta: {parent:'2-200100-4',title:'添加会员等级'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userGradeList'){//如果来自会员等级列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加会员等级
            {path : '/admin/control/userGrade/manage/edit',component : () => import('@/views/user/editUserGrade.vue'),name:'editUserGrade',meta: {parent:'2-200100-4',title:'修改会员等级'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userGradeList'){//如果来自会员等级列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员等级
           
            {path : '/admin/control/userCustom/list',component : () => import('@/views/user/userCustomList.vue'), name:'userCustomList',meta: {index:'2-200100-5',title:'会员注册项',cacheNumber:'0'}},//会员注册项
            {path : '/admin/control/userCustom/manage/add',component : () => import('@/views/user/addUserCustom.vue'),name:'addUserCustom',meta: {parent:'2-200100-5',title:'添加会员注册项'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userCustomList'){//如果来自会员注册项列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加会员注册项
            {path : '/admin/control/userCustom/manage/edit',component : () => import('@/views/user/editUserCustom.vue'),name:'editUserCustom',meta: {parent:'2-200100-5',title:'修改会员注册项'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'userCustomList'){//如果来自会员注册项列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员注册项
            {path : '/admin/control/disableUserName/list',component : () => import('@/views/user/disableUserNameList.vue'), name:'disableUserNameList',meta: {index:'2-200100-6',title:'会员注册禁止用户名称',cacheNumber:'0'}},//会员注册禁止用户名称
            {path : '/admin/control/disableUserName/manage/add',component : () => import('@/views/user/addDisableUserName.vue'),name:'addDisableUserName',meta: {parent:'2-200100-6',title:'添加会员注册禁止用户名称'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'disableUserNameList'){//如果来自会员注册禁止用户名称列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员注册禁止用户名称
            {path : '/admin/control/disableUserName/manage/edit',component : () => import('@/views/user/editDisableUserName.vue'),name:'editDisableUserName',meta: {parent:'2-200100-6',title:'修改会员注册禁止用户名称'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'disableUserNameList'){//如果来自会员注册禁止用户名称列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员注册禁止用户名称
            
            {path : '/admin/control/membershipCard/list',component : () => import('@/views/membershipCard/membershipCardList.vue'), name:'membershipCardList',meta: {index:'2-200200-1',title:'会员卡列表',cacheNumber:'0'}},//会员卡列表
            {path : '/admin/control/membershipCard/manage/add',component : () => import('@/views/membershipCard/addMembershipCard.vue'),name:'addMembershipCard',meta: {parent:'2-200200-1',title:'添加会员卡'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'membershipCardList'){//如果来自会员卡列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加会员卡
            {path : '/admin/control/membershipCard/manage/edit',component : () => import('@/views/membershipCard/editMembershipCard.vue'),name:'editMembershipCard',meta: {parent:'2-200200-1',title:'修改会员卡'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'membershipCardList'){//如果来自会员卡列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改会员卡
            {path : '/admin/control/membershipCardOrder/list',component : () => import('@/views/membershipCard/membershipCardOrderList.vue'), name:'membershipCardOrderList',meta: {index:'2-200200-2',title:'会员卡订单列表',cacheNumber:'0'}},//会员卡订单列表
            
            
            {path : '/admin/control/staff/list',component : () => import('@/views/staff/staffList.vue'), name:'staffList',meta: {index:'2-200300-1',title:'员工列表',cacheNumber:'0'}},//员工列表
            {path : '/admin/control/staff/manage/addStaff',component : () => import('@/views/staff/addStaff.vue'),name:'addStaff',meta: {parent:'2-200300-1',title:'添加员工'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'staffList'){//如果来自员工列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加员工
            {path : '/admin/control/staff/manage/editStaff',component : () => import('@/views/staff/editStaff.vue'),name:'editStaff',meta: {parent:'2-200300-1',title:'修改员工'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'staffList'){//如果来自员工列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改员工
            {path : '/admin/control/staff/manage/editSelfInfo',component : () => import('@/views/staff/editSelfInfo.vue'),name:'editSelfInfo',meta: {parent:'2-200300-1',title:'修改员工自身信息'}},//修改员工自身信息
            {path : '/admin/control/staffLoginLog/list',component : () => import('@/views/staff/staffLoginLogList.vue'),name:'staffLoginLogList',meta: {parent:'2-200300-1',title:'员工登录日志'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'staffList'){//如果来自员工列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//员工登录日志
            {path : '/admin/control/roles/list',component : () => import('@/views/staff/rolesList.vue'), name:'rolesList',meta: {index:'2-200300-2',title:'角色列表',cacheNumber:'0'}},//角色列表
            {path : '/admin/control/acl/manage/addRoles',component : () => import('@/views/staff/addRoles.vue'),name:'addRoles',meta: {parent:'2-200300-2',title:'添加角色'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'rolesList'){//如果来自角色列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加角色
            {path : '/admin/control/acl/manage/editRoles',component : () => import('@/views/staff/editRoles.vue'),name:'editRoles',meta: {parent:'2-200300-2',title:'修改角色'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'rolesList'){//如果来自角色列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改角色
            
            {path : '/admin/control/helpType/list',component : () => import('@/views/help/helpTypeList.vue'),name:'helpTypeList',meta: {index:'3-300100-1',title:'帮助分类',cacheNumber:'0'}},//帮助分类
            {path : '/admin/control/helpType/manage/add',component : () => import('@/views/help/addHelpType.vue'),name:'addHelpType',meta: {parent:'3-300100-1',title:'添加帮助分类'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'helpTypeList'){//如果来自帮助分类列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加帮助分类
            {path : '/admin/control/helpType/manage/edit',component : () => import('@/views/help/editHelpType.vue'),name:'editHelpType',meta: {parent:'3-300100-1',title:'修改帮助分类'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'helpTypeList'){//如果来自帮助分类列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改帮助分类
            {path : '/admin/control/helpType/manage/merger',component : () => import('@/views/help/mergerHelpType.vue'),name:'mergerHelpType',meta: {parent:'3-300100-1',title:'合并帮助分类'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'helpTypeList'){//如果来自帮助分类列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//合并帮助分类
            {path : '/admin/control/help/list',component : () => import('@/views/help/helpList.vue'), name:'helpList',meta: {index:'3-300100-2',title:'帮助列表',cacheNumber:'0'}},//帮助列表
            {path : '/admin/control/help/manage/view',component : () => import('@/views/help/helpView.vue'),name:'helpView',meta: {parent:'3-300100-2',title:'帮助内容',}},//帮助内容
            
            {path : '/admin/control/help/manage/add',component : () => import('@/views/help/addHelp.vue'),name:'addHelp',meta: {parent:'3-300100-2',title:'添加帮助'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'helpList'){//如果来自帮助列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加帮助
            {path : '/admin/control/help/manage/edit',component : () => import('@/views/help/editHelp.vue'),name:'editHelp',meta: {parent:'3-300100-2',title:'修改帮助'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'helpList'){//如果来自帮助列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改帮助
            
            {path : '/admin/control/template/list',component : () => import('@/views/template/templateList.vue'),name:'templateList',meta: {index:'3-300200-1',title:'模板列表',cacheNumber:'0'}},//模板列表
            {path : '/admin/control/template/manage/add',component : () => import('@/views/template/addTemplate.vue'),name:'addTemplate',meta: {parent:'3-300200-1',title:'添加模板'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'templateList'){//如果来自模板列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加模板
            {path : '/admin/control/template/manage/edit',component : () => import('@/views/template/editTemplate.vue'),name:'editTemplate',meta: {parent:'3-300200-1',title:'修改模板'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'templateList'){//如果来自模板列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改模板
            {path : '/admin/control/template/manage/importTemplateList',component : () => import('@/views/template/importTemplateList.vue'),name:'importTemplateList',meta: {parent:'3-300200-1',title:'导入模板列表'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'templateList'){//如果来自模板列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//导入模板列表
           
            {path : '/admin/control/forumCode/list',component : () => import('@/views/forumCode/forumCodeList.vue'),name:'forumCodeList',meta: {parent:'3-300200-1',title:'版块代码'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'templateList'){//如果来自模板列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//版块代码
            {path : '/admin/control/resource/list',component : () => import('@/views/template/resourceList.vue'),name:'resourceList',meta: {parent:'3-300200-1',title:'资源列表'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'templateList'){//如果来自模板列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//资源列表
             
            {path : '/admin/control/layout/list',component : () => import('@/views/template/layoutList.vue'),name:'layoutList',meta: {parent:'3-300200-1',title:'布局列表'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'templateList'){//如果来自模板列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//布局列表
            {path : '/admin/control/layout/manage/add',component : () => import('@/views/template/addLayout.vue'),name:'addLayout',meta: {parent:'3-300200-1',title:'添加布局'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'layoutList'){//如果来自布局列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加布局
            {path : '/admin/control/layout/manage/editLayout',component : () => import('@/views/template/editLayout.vue'),name:'editLayout',meta: {parent:'3-300200-1',title:'修改布局'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'layoutList'){//如果来自布局列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改布局
            {path : '/admin/control/layout/manage/editLayoutCode',component : () => import('@/views/template/editLayoutCode.vue'),name:'editLayoutCode',meta: {parent:'3-300200-1',title:'布局代码编辑'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'layoutList'){//如果来自布局列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//布局代码编辑
            
            {path : '/admin/control/column/manage/list',component : () => import('@/views/template/columnList.vue'),name:'columnList',meta: {parent:'3-300200-1',title:'栏目列表'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'templateList'){//如果来自模板列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//栏目列表
            
            {path : '/admin/control/forum/list',component : () => import('@/views/template/forumList.vue'),name:'forumList',meta: {parent:'3-300200-1',title:'版块列表'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'layoutList'){//如果来自布局列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//版块列表
            {path : '/admin/control/forum/manage/add',component : () => import('@/views/template/addForum.vue'),name:'addForum',meta: {parent:'3-300200-1',title:'添加版块'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'forumList'){//如果来自版块列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加版块
            {path : '/admin/control/forum/manage/edit',component : () => import('@/views/template/editForum.vue'),name:'editForum',meta: {parent:'3-300200-1',title:'修改版块'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'forumList'){//如果来自版块列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改版块
            
            {path : '/admin/control/pageView/list',component : () => import('@/views/statistic/pageViewList.vue'), name:'pageViewList',meta: {index:'4-400100-1',title:'浏览量列表',cacheNumber:'0'}},//浏览量列表
            
            {path : '/admin/control/filePackage/list',component : () => import('@/views/filePackage/filePackageList.vue'), name:'filePackageList',meta: {index:'4-400200-1',title:'压缩文件列表',cacheNumber:'0'}},//压缩文件列表
            {path : '/admin/control/filePackage/manage/package',component : () => import('@/views/filePackage/package.vue'),name:'package',meta: {parent:'4-400200-1',title:'压缩文件打包'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'filePackageList'){//如果来自压缩文件列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//压缩文件打包
            
            {path : '/admin/control/systemNotify/list',component : () => import('@/views/message/systemNotifyList.vue'), name:'systemNotifyList',meta: {index:'4-400300-1',title:'系统通知列表',cacheNumber:'0'}},//系统通知列表
            {path : '/admin/control/systemNotify/manage/add',component : () => import('@/views/message/addSystemNotify.vue'), name:'addSystemNotify',meta: {parent:'4-400300-1',title:'添加系统通知'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'systemNotifyList'){//如果来自系统通知列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加系统通知
            {path : '/admin/control/systemNotify/manage/edit',component : () => import('@/views/message/editSystemNotify.vue'), name:'editSystemNotify',meta: {parent:'4-400300-1',title:'修改系统通知'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'systemNotifyList'){//如果来自系统通知列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改系统通知
            
            {path : '/admin/control/topicUnhidePlatformShare/list',component : () => import('@/views/platformShare/topicUnhidePlatformShareList.vue'), name:'topicUnhidePlatformShareList',meta: {index:'4-400400-1',title:'解锁话题隐藏内容分成',cacheNumber:'0'}},//解锁话题隐藏内容分成
            {path : '/admin/control/questionRewardPlatformShare/list',component : () => import('@/views/platformShare/questionRewardPlatformShareList.vue'), name:'questionRewardPlatformShareList',meta: {index:'4-400400-2',title:'问答悬赏平台分成',cacheNumber:'0'}},//问答悬赏平台分成
           
            {path : '/admin/control/reportType/list',component : () => import('@/views/report/reportTypeList.vue'), name:'reportTypeList',meta: {index:'4-400600-1',title:'举报分类列表',cacheNumber:'0'}},//举报分类列表
            {path : '/admin/control/reportType/manage/add',component : () => import('@/views/report/addReportType.vue'),name:'addReportType',meta: {parent:'4-400600-1',title:'添加举报分类'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'reportTypeList'){//如果来自举报分类列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加举报分类
            {path : '/admin/control/reportType/manage/edit',component : () => import('@/views/report/editReportType.vue'),name:'editReportType',meta: {parent:'4-400600-1',title:'修改举报分类'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'reportTypeList'){//如果来自举报分类列表,则删除缓存
                         store.setCacheNumber()
                    }
                    next();
                }
            },//修改举报分类
            {path : '/admin/control/report/list',component : () => import('@/views/report/reportList.vue'), name:'reportList',meta: {index:'4-400600-2',title:'举报列表',cacheNumber:'0'}},//举报列表
            {path : '/admin/control/report/manage/edit',component : () => import('@/views/report/editReport.vue'),name:'editReport',meta: {parent:'4-400600-2',title:'修改举报'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'reportList'){//如果来自举报列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改举报
            {path : '/admin/control/topicReport/list',component : () => import('@/views/report/topicReportList.vue'), name:'topicReportList',meta: {parent:'4-400600-2',title:'话题举报列表'}},//话题举报列表
            {path : '/admin/control/questionReport/list',component : () => import('@/views/report/questionReportList.vue'), name:'questionReportList',meta: {parent:'4-400600-2',title:'问答举报列表'}},//问答举报列表
            {path : '/admin/control/userReport/list',component : () => import('@/views/report/userReportList.vue'), name:'userReportList',meta: {parent:'4-400600-2',title:'用户举报列表'}},//用户举报列表
            
            {path : '/admin/control/systemSetting/manage/edit',component : () => import('@/views/setting/editSystemSetting.vue'), name:'editSystemSetting',meta: {index:'5-500100-1',title:'基本设置',cacheNumber:'0'}},//基本设置
            {path : '/admin/control/systemSetting/manage/maintainData',component : () => import('@/views/setting/maintainData.vue'), name:'maintainData',meta: {index:'5-500100-2',title:'维护数据',cacheNumber:'0'}},//维护数据
            {path : '/admin/control/filterWord/manage/view',component : () => import('@/views/setting/viewFilterWord.vue'), name:'viewFilterWord',meta: {index:'5-500100-3',title:'敏感词',cacheNumber:'0'}},//敏感词 
            {path : '/admin/control/dataBase/list',component : () => import('@/views/data/dataBaseList.vue'), name:'dataBaseList',meta: {index:'5-500100-4',title:'数据库备份/还原',cacheNumber:'0'}},//数据库备份/还原
            {path : '/admin/control/dataBase/manage/backup',component : () => import('@/views/data/dataBackup.vue'), name:'dataBackup',meta: {parent:'5-500100-4',title:'数据库备份'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'dataBaseList'){//如果来自数据库备份/还原列表,则删除缓存
                         store.setCacheNumber()
                    }
                    next();
                }
            },//数据备份列表
            {path : '/admin/control/dataBase/manage/reset',component : () => import('@/views/data/dataReset.vue'), name:'dataReset',meta: {parent:'5-500100-4',title:'数据库还原'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'dataBaseList'){//如果来自数据库备份/还原列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//数据还原列表
            
            {path : '/admin/control/systemSetting/manage/nodeParameter',component : () => import('@/views/setting/nodeParameter.vue'), name:'nodeParameter',meta: {index:'5-500100-5',title:'服务器节点参数',cacheNumber:'0'}},//服务器节点参数
            {path : '/admin/control/upgrade/manage/upgradeSystemList',component :  () => import('@/views/upgrade/upgradeSystemList.vue'), name:'upgradeSystemList',meta: {index:'5-500100-6',title:'升级',cacheNumber:'0'}},//升级
            
            {path : '/admin/control/onlinePaymentInterface/list',component : () => import('@/views/payment/onlinePaymentInterfaceList.vue'), name:'onlinePaymentInterfaceList',meta: {index:'5-500200-1',title:'在线支付接口',cacheNumber:'0'}},//在线支付接口
            {path : '/admin/control/onlinePaymentInterface/manage/add',component : () => import('@/views/payment/addOnlinePaymentInterface.vue'), name:'addOnlinePaymentInterface',meta: {parent:'5-500200-1',title:'添加在线支付接口'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'onlinePaymentInterfaceList'){//如果来自在线支付接口列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加在线支付接口
            {path : '/admin/control/onlinePaymentInterface/manage/edit',component : () => import('@/views/payment/editOnlinePaymentInterface.vue'), name:'editOnlinePaymentInterface',meta: {parent:'5-500200-1',title:'修改在线支付接口'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'onlinePaymentInterfaceList'){//如果来自在线支付接口列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改在线支付接口
            {path : '/admin/control/smsInterface/list',component : () => import('@/views/sms/smsInterfaceList.vue'), name:'smsInterfaceList',meta: {index:'5-500300-1',title:'短信接口列表',cacheNumber:'0'}},//短信接口列表
            {path : '/admin/control/smsInterface/manage/add',component : () => import('@/views/sms/addSmsInterface.vue'), name:'addSmsInterface',meta: {parent:'5-500300-1',title:'添加短信接口'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'smsInterfaceList'){//如果来自短信接口列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加短信接口
            {path : '/admin/control/smsInterface/manage/edit',component : () => import('@/views/sms/editSmsInterface.vue'), name:'editSmsInterface',meta: {parent:'5-500300-1',title:'修改短信接口'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'smsInterfaceList'){//如果来自短信接口列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改短信接口
            {path : '/admin/control/sendSmsLog/list',component : () => import('@/views/sms/sendSmsLogList.vue'), name:'sendSmsLogList',meta: {index:'5-500300-2',title:'短信发送错误日志',cacheNumber:'0'}},//短信发送错误日志
            
           
            
            {path : '/admin/control/thirdPartyLoginInterface/list',component : () => import('@/views/thirdParty/thirdPartyLoginInterfaceList.vue'), name:'thirdPartyLoginInterfaceList',meta: {index:'5-500500-1',title:'第三方登录接口列表',cacheNumber:'0'}},//第三方登录接口列表
            {path : '/admin/control/thirdPartyLoginInterface/manage/add',component : () => import('@/views/thirdParty/addThirdPartyLoginInterface.vue'), name:'addThirdPartyLoginInterface',meta: {parent:'5-500400-1',title:'添加第三方登录接口'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'thirdPartyLoginInterfaceList'){//如果来自第三方登录接口列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加第三方登录接口
            {path : '/admin/control/thirdPartyLoginInterface/manage/edit',component : () => import('@/views/thirdParty/editThirdPartyLoginInterface.vue'), name:'editThirdPartyLoginInterface',meta: {parent:'5-500400-1',title:'修改第三方登录接口'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'thirdPartyLoginInterfaceList'){//如果来自第三方登录接口列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//修改第三方登录接口
            
            
            {path : '/admin/control/thumbnail/list',component : () => import('@/views/thumbnail/thumbnailList.vue'), name:'thumbnailList',meta: {index:'5-500700-1',title:'缩略图列表',cacheNumber:'0'}},//缩略图列表
            {path : '/admin/control/thumbnail/manage/add',component : () => import('@/views/thumbnail/addThumbnail.vue'), name:'addThumbnail',meta: {parent:'5-500700-1',title:'添加缩略图裁剪尺寸'},
                beforeEnter: (to:any, from:any, next:any) => {
                    const store = useStore(pinia);
                    if(from.name == 'thumbnailList'){//如果来自缩略图列表,则删除缓存
                        store.setCacheNumber()
                    }
                    next();
                }
            },//添加缩略图裁剪尺寸
            
        ]
    },

    {path : '/admin/login',name: 'login', component: () => import('@/views/login.vue')},//登录

    // {path : '/:pathMatch(.*)*', redirect:{name:'homeRoute'}}//其余路由重定向至后台首页。 用redirect : '/admin/control/manage/home'方式控制台会有警告
    { path: '/:pathMatch(.*)*', redirect: (to: any) => {

        
        return { name: 'home' };//重定向的 字符串路径/路径对象
    }}



];   
   
   
   
   /** 
    {
        path: '/admin/login',//管理后台登录
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    

    

    
//    {path : '/:pathMatch(.*)*', redirect:{name:'index'}}//其余路由重定向至首页。
    { path: '/:pathMatch(.*)*', redirect: (to: any) => {

        return { name: 'login' };//重定向的 字符串路径/路径对象
    }},
    
]**/


//监听.el-main窗口
let resizeObserver:any = null;
let validFullPath_scrollTop:any = 0;
if(window.ResizeObserver){
	resizeObserver = new ResizeObserver(entries => {
		for (let entry of entries) {
		    const cr = entry.contentRect;
		    if(cr.height >250){
		    	resizeObserver.unobserve(document.querySelector(".main"));//停止对指定目标的监听
		    	
		    	document.querySelector(".el-main")!.scrollTop = validFullPath_scrollTop;
		    	
		   }
		}
	});
}
let scrollBehavior = function (to:any, from:any, savedPosition:any) {
	if (savedPosition) {
		// savedPosition仅适用于popstate导航。
		return savedPosition;
	} else {
        const store = useStore(pinia);
		if(document.querySelector(".el-main")){//默认滚动到顶部
			document.querySelector(".el-main")!.scrollTop = 0;
			validFullPath_scrollTop = 0;
		}
		
		let validFullPath:any = null;//有效的
		A:for (let [key,value] of store.historyPath){
			if(value != null && value.length >0){//fullPathList
				for(let i=value.length-1;i>=0;i--){
					let fullPath = value[i];
					if(to.fullPath == fullPath.url){
						validFullPath = fullPath;
						break A;
					}
				}
			}
		}
		
		let to_path_index = '';//to参数路径索引
		let to_path_index_root = false;//to参数路径索引是否为根节点
		let from_path_index = '';//from参数路径索引
		let from_path_index_root = false;//from参数路径索引是否为根节点
		
		for(let i=0; i<routes.length; i++){
			let children = routes[i].children;
			if(children != null && children.length){
				for(let j=0; j<children.length; j++){
				   let route_children:any = children[j];
				   if(route_children.path == to.path){
					   if(route_children.meta.index != undefined){
						   to_path_index = route_children.meta.index;
						   to_path_index_root = true;
					   }else{
						   to_path_index = route_children.meta.parent;
						   to_path_index_root = false;
					   }
				   }
				   if(route_children.path == from.path){
					   if(route_children.meta.index != undefined){
						   from_path_index = route_children.meta.index;
						   from_path_index_root = true;
					   }else{
						   from_path_index = route_children.meta.parent;
						   from_path_index_root = false;
					   }
				   }
			   }
		   }   
		}
		
		//只有详细页返回列表页或不同标签页切换，才执行滚动
		if((from_path_index == to_path_index && from_path_index_root == false && to_path_index_root == true) || (from_path_index != to_path_index)){
			if(validFullPath != null){
				if(document.querySelector(".el-main")){
					nextTick(()=>{
						validFullPath_scrollTop = validFullPath.scrollTop;
						if(resizeObserver != null && document.querySelector(".main")){
							resizeObserver.observe(document.querySelector(".main"));
						}
					});
				}
			}
			
		}
	}
};

export default createRouter({
 //   history: createWebHistory('/admin/'),
    history: createWebHistory(),
    scrollBehavior : scrollBehavior, //记住页面的滚动位置 html5模式适用
    routes
})