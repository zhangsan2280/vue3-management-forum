//菜单链接标签
export interface MenuLinkTag {
    name: string;//名称
    index: string;//索引
    active: boolean;//是否激活
}
//来源URL
export interface SourceUrl {
    path: string;//路径
    query: any;//查询参数
}

//权限菜单
export interface PermissionMenu {
    name: string;//名称
    url: string;//URL
    methods: string;//请求类型
}

//分页
export interface PageView<T> {
    records: Array<T>;//显示记录集,即分页数据
    pageindex: PageIndex;//页码开始索引和结束索引
    totalpage: string;//总页数
    maxresult: number;//每页显示记录数
    currentpage: number;//当前页
    totalrecord: string;//总记录数
    pagecount: string;//页码显示总数
}
//分页计算页码
export interface PageIndex {
    startindex: string;//分页开始索引
    endindex: string;//分页结束索引
}


//管理员
export interface SysUsers {
    userId: string;//用户id
    userAccount: string;//用户账号
    fullName: string;//姓名
    nickname: string;//呢称
    userPassword: string;//密码 BCrypt(sha256(密码原文))
    userDesc: string;//用户备注
    enabled:boolean;//是否启用
    userDuty:boolean;//用户的职位
    issys:boolean;//是否是超级用户
    securityDigest: string;//安全摘要
    logonUserPermission:boolean;//当前登录用户权限是否拥有本权限
    password: string;//密码
    username: string;//用户名称
    accountNonExpired: boolean;//账号过期
    accountNonLocked: boolean;//账号是否锁定
    credentialsNonExpired: boolean;//凭证是否过期
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
}
//角色表
export interface SysRoles{
    id: string;//Id
    name: string;//名称
    remarks: string;//备注
    logonUserPermission: boolean;//当前登录用户权限是否拥有本权限
    selected: boolean;//是否选中
}
//权限对象(模块权限)
export interface PermissionObject{
    url: string;//URL
    methods: string;//请求对象
    permissionName: string;//权限名称
    module: string;//资源表模块
    permissionId: string;//权限表Id
    remarks: string;//权限表说明
    appendUrl: boolean;//是否附加URL true:是附加URL  false:不是附加URL
    logonUserPermission: boolean;//当前登录用户权限是否拥有本权限
    selected: boolean;//是否选中
}
//模板
export interface Templates{
    id: string;//ID
    name: string;//模板名称
    dirName: string;//模板目录名称
    thumbnailSuffix: string;//缩略图后缀  图片默认名称：templates
    fileName: string;//文件名称
    uses: boolean;//是否使用 **/ //默认true /新建false
    verifyCSRF: boolean;//是否验证CSRF
    introduction: string;//模板简介
}

//布局
export interface Layout{
    id: string;//ID
    name: string;//布局名称
    type:number;//布局类型     1.默认页     3.更多  4.空白页  5.公共页(生成新引用页)  6.公共页(引用版块值)  7.站点栏目详细页
    layoutFile: string;//布局文件
    dirName: string;//模板目录名称
    referenceCode: string;//生成模板引用代码
    accessRequireLogin: boolean;//访问需要登录
    returnData: number;//空白页返回数据     0:html   1: json
    forumData: number;//版块数据   -1:无数据   1:商品   2: 资讯    ‘更多’功能的返回数据
    sort : number;//排序
}
//版块代码节点
export interface ForumCodeNode{
    id: number;//节点Id
    nodeName: string;//节点名称
    childNode: Array<ForumCodeNode>;//子节点
    prefix: string;//版块代码文件名称前缀
    remark: string;//版块代码文件 备注
    pc_lastTime: string;//电脑版最后修改时间
    wap_lastTime: string;//移动版最后修改时间
    displayType: Array<string>;//模板显示类型 （子节点使用）  单层/多层/分页/实体对象/集合
}
//版块
export interface Forum {
    id: number;//Id
    layoutId: string;//布局Id
    name: string;//版块名称
    module: string;//选择版块模板
    displayType: string;//模板显示类型    单层:monolayer  多层:multilayer  分页:page   实体对象:entityBean  集合:collection
    forumType: string;//版块类型
    forumChildType: string;//版块子类型
    referenceCode: string;//生成版块引用代码
    dirName: string;//模板目录名称
    layoutType: number;//布局类型
    layoutFile: string;//布局文件
    queryMode: number;//查询方式   0:数据库   1: lucene索引
    invokeMethod: number;//调用方式  1.引用代码  2.调用对象
}

//站点栏目
export interface Column {
    name: string;//栏目名称
    linkMode: number;//链接方式
    url: string;//URL
    parentId: number;//所属父类Id
    sort: number;//排序
}


//标签
export interface Tag{
    id: string;//Id
    name: string;//标签名称
    sort: number;//排序
    allowRoleViewList: Array<string>;//标签下的话题允许查看的角色名称集合(默认角色除外)
}



//访问用户
export interface SystemUser {
    userId: string;//会员Id
    userName: string;//会员用户名
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    rememberMe: boolean;//记住密码
    openId: string;//第三方用户的唯一标识 例如微信的openid
    loginInterface: number;//登录接口 0.本地 10.微信 50.其他开放平台
}

//用户
export interface User {
    id: string;//会员Id
    userName: string;//会员用户名
    account: string;//账号
    nickname: string;//呢称
    state: number;//用户状态
    email: string;//邮箱地址
    issue: string;//密码提示问题
    registrationDate: string;//注册日期
    point: string;//当前积分
	deposit: string;//当前预存款
    gradeId: string;//等级Id
    gradeName: string;//等级名称
    mobile: string;//绑定手机
    realNameAuthentication: boolean;//是否实名认证
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    userRoleNameList: Array<string>;//话题允许查看的角色名称集合
	type: number;//用户类型 10:本地账号密码用户 20: 手机用户 30: 邮箱用户 40:微信用户 80:其他用户
    allowUserDynamic: boolean;//是否允许显示用户动态

	userVersion: number;//用户版本号
    remarks: string;//备注
    cancelAccountTime: string//注销账号时间
}


//会员等级
export interface UserGrade {
    id: number;//Id
    name: string;//等级名称
    needPoint: string;//等级名称
}

//用户自定义注册功能项
export interface UserCustom {
    id: number;//Id
    name: string;//注册项名称
    required: boolean;//是否必填
    search: boolean;//后台可搜索
    visible: boolean;//是否显示
    chooseType: number;//选框类型  1.输入框 2.单选按钮  3.多选按钮 4.下拉列表  5.文本域textarea 
    fieldFilter: number;//字段过滤方式  0.无  1.只允许输入数字  2.只允许输入字母  3.只允许输入数字和字母  4.只允许输入汉字  5.正则表达式过滤
    size: number;//输入框的宽度
    maxlength: number;//输入框中字符的最大长度
    multiple: boolean;//是否可选择多个选项 true: multiple='multiple'  false:
    selete_size: number;//下拉列表中可见选项的数目
    rows: number;//文本域内的可见行数
    cols: number;//文本域内的可见宽度
    regular: string;//过滤正则表达式
    tip: string;//提示
    sort: number;//排序
    itemValue: Map;//参数值
    userInputValueList : Array<UserInputValue> //用户自定义注册功能项用户输入值
}

//用户自定义注册功能项用户输入值
export interface UserInputValue {
    id: string;//Id
    userId: string;//用户Id
    userCustomId: string;//用户自定义注册功能项表Id
    content: string;//用户输入内容
    options: string;//选项值
}

//角色
export interface UserRole {
    id: string;//Id
    name: string;//名称
    remark: string;//备注
    sort: number;//排序
    defaultRole: boolean;//是否默认角色
    selected: boolean;//是否选中
    validPeriodEnd: string;//有效期结束
}

//用户资源组
export interface UserResourceGroup {
    code: number;//编号
    name: string;//名称
    type: number;//类型 10:直接提交 20:预处理--标签
    tagId: string;//标签Id
    tagName: string;//标签名称
    userResourceList: Array<UserResource>;//资源集合

    index: number;//本参数不是后端返回，仅在前端使用。因为表格使用type="expand"方式展示时，scope.$index获取的索引不连续,所以在数据里直接设置索引
							
}
//用户资源
export interface UserResource{
    code: number;//编号
    name: string;//名称
    resourceGroupCode: number;//资源组编号
    selected: boolean;//选中
}

	

//允许注册账号类型
export interface AllowRegisterAccount {
    local: boolean;//本地账号密码用户
    mobile: boolean;//手机用户
    weChat: boolean;//微信用户
    other: boolean;//其他用户
}



//未读消息
export interface UnreadMessage {
    privateMessageCount: number;//未读私信总数
    systemNotifyCount: number;//未读系统通知总数
    remindCount: number;//未读提醒总数
}

//第三方登录接口
export interface SupportLoginInterface {
    name: string;//名称
    thirdPartyLoginInterfaceId: number;//第三方登录接口Id
    interfaceProduct: number;//接口产品  10.微信公众号  50.其他开放平台
}

//话题
export interface Topic {
    id: string;//Id
    title: string;//标题
    tagId: string;//标签Id
    tagName: string;//标签名称
    content: string;//话题内容
    summary: string;//内容摘要
    postTime: string;//发表时间
    lastReplyTime: string;//最后回复时间
    lastUpdateTime: string;//最后修改时间
    imageInfoList: Array<ImageInfo>;//图片信息集合
    mediaInfoList: Array<MediaInfo>;//媒体文件信息集合
    commentTotal: string;//评论总数
    allow: boolean;//允许评论
    viewTotal: string;//查看总数
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    userInfoStatus: number;//用户信息状态
    userRoleNameList: Array<string>;//用户角色名称集合
    allowRoleViewList: Array<string>;//话题允许查看的角色名称集合(默认角色除外)
    hideTagTypeMap: Map<number,boolean>;//key:内容含有隐藏标签类型  10.输入密码可见  20.评论话题可见  30.达到等级可见 40.积分购买可见 50.余额购买可见  value:当前用户是否已对隐藏内容解锁
    giveRedEnvelopeId: string;//发红包Id
    isStaff: boolean;//是否为员工 true:员工  false:会员
    sort: number;//排序
    essence: boolean;//精华
    status: number;//状态 10.待审核 20.已发布 110.待审核删除 120.已发布删除

    ip: string;//IP
    ipAddress: string;//IP地址

    avatar: string;//base64格式头像
}
//图片信息
export interface ImageInfo {
    path: string;//图片路径
    name: string;//图片名称
}
//媒体文件信息
export interface MediaInfo {
    mediaUrl: string;//媒体文件URL
    cover: string;//封面文件
    thumbnail: string;//缩略图文件
}


//话题取消隐藏
export interface TopicUnhide {
    id: string;//媒体文件URL
    userName: string;//取消隐藏的用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    point: string;//消费积分
    amount: string;//消费金额
    cancelTime: string;//取消隐藏时间
    hideTagType: number;//隐藏标签类型 10:输入密码可见  40:积分购买可见  50:余额购买可见

    avatar: string;//base64格式头像
}


//友情链接
export interface Links {
    id: number;//Id
    name: string;//名称
    website: string;//网址
    sort: number;//排序
    image: string;//图片
    createDate: string;//创建时间
}



//点赞
export interface Like {
    id: string;//Id
    userName: string;//点赞的用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    postUserName: string;//发布话题的用户名称
    addtime: string;//加入时间
    topicId: string;//话题Id
    topicTitle: string;//话题标题

    avatar: string;//base64格式头像
}

//收藏夹
export interface Favorites {
    id: string;//Id
    module: number;//模块 10:话题 20:问题
    userName: string;//点赞的用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    postUserName: string;//发布 话题/问题 的用户名称
    addtime: string;//加入时间
    topicId: string;//话题Id
    topicTitle: string;//话题标题
    questionId: string;//问题Id
    questionTitle: string;//问题标题

    avatar: string;//base64格式头像
}


//评论
export interface Comment {
    id: string;//Id
    isStaff: boolean;//是否是员工
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    userInfoStatus: number;//用户信息状态
    topicId: string;//话题Id
    topicTitle: string;//话题标题
    status: number;//状态 10.待审核 20.已发布 110.待审核用户删除 120.已发布用户删除 100010.待审核员工删除 100020.已发布员工删除
    quoteList: Array<Quote>;//引用集合
    content: string;//评论内容
    postTime: string;//评论时间
    lastUpdateTime: string;//最后修改时间
    userRoleNameList: Array<string>;//用户角色名称集合
    totalReply: number;//总回复数
    replyList: Array<Reply>;//回复集合

    avatar: string;//base64格式头像
}

//话题引用
export interface Quote {
    commentId: string;//评论Id
    isStaff: boolean;//是否是员工
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    userInfoStatus: number;//用户信息状态
    content: string;//回复内容
    userRoleNameList: Array<string>;//用户角色名称集合
}

//话题回复
export interface Reply {
    id: string;//Id
    isStaff: boolean;//是否是员工
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称

    friendReplyId: string;//对方回复Id
    friendReplyIdGroup: string;//对方回复Id组
    isFriendStaff: boolean;//对方是否是员工
    friendUserName: string;//对方用户名称
    friendAccount: string;//对方账号
    friendNickname: string;//对方呢称
    friendAvatarPath: string;//对方头像路径
    friendAvatarName: string;//对方头像名称

    userInfoStatus: number;//用户信息状态
    topicId: string;//话题Id
    topicTitle: string;//话题Id
    content: string;//回复内容
    commentId: string;//评论Id
    postTime: string;//评论时间
    lastUpdateTime: string;//最后修改时间
    status: number;//状态 10.待审核 20.已发布
    userRoleNameList: Array<string>;//用户角色名称集合

    avatar: string;//base64格式头像
}

//问题标签
export interface QuestionTag {
    id: string;//Id
    name: string;//标签名称
    sort: number;//排序
    parentId: string;//所属父类Id
    childNodeNumber: number;//子节点数量
    childTag:Array<QuestionTag>;//子标签
}

//问题
export interface Question {
    id: string;//Id
    title: string;//标题
    questionTagAssociationList: Array<QuestionTagAssociation>;//标签
    content: string;//问题内容
    summary: string;//内容摘要
    appendQuestionItemList: Array<AppendQuestionItem>;//追加内容集合
    postTime: string;//发表时间
    lastAnswerTime: string;//最后回答时间
    lastUpdateTime: string;//最后修改时间
    adoptionAnswerId: string;//采纳的答案Id
    answerTotal: string;//答案总数
    allow: boolean;//允许回答
    viewTotal: string;//查看总数
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    userInfoStatus: number;//用户信息状态
    userRoleNameList: Array<string>;//用户角色名称集合
    isStaff: boolean;//是否为员工 true:员工  false:会员
    sort: number;//排序
    status: number;//状态 10.待审核 20.已发布 110.待审核删除 120.已发布删除
    amount: string;//悬赏金额
    point: string;//悬赏积分
    ip: string;//IP
    ipAddress: string;//IP地址

    avatar: string;//base64格式头像
}
//问题标签关联
export interface QuestionTagAssociation {
    id: string;//Id
    questionTagId: string;//问题标签Id
    questionTagName: string;//问题标签名称
    questionId: string;//问题Id
    userName: string;//用户名称
}
//追加问题项
export interface AppendQuestionItem {
    id: string;//Id
    content: string;//追加内容
    postTime: string;//追加时间
}


//答案
export interface Answer {
    id: string;//Id
    isStaff: boolean;//是否是员工
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    userInfoStatus: number;//用户信息状态
    questionId: string;// 问题Id
    questionTitle: string;//问题标题
    status: number;//状态 10.待审核 20.已发布 110.待审核用户删除 120.已发布用户删除 100010.待审核员工删除 100020.已发布员工删除
    adoption:boolean;//答案是否采纳
    content: string;//答案内容
    postTime: string;//回答时间
    lastUpdateTime: string;//最后修改时间
    userRoleNameList: Array<string>;//用户角色名称集合
    totalReply: number;//总回复数
    answerReplyList: Array<AnswerReply>;//回复集合

    avatar: string;//base64格式头像
}
//答案回复
export interface AnswerReply {
    id: string;//Id
    isStaff: boolean;//是否是员工
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    userInfoStatus: number;//用户信息状态
    userRoleNameList: Array<string>;//用户角色名称集合

    friendReplyId: string;//对方回复Id
    friendReplyIdGroup: string;//对方回复Id组
    isFriendStaff: boolean;//对方是否是员工
    friendUserName: string;//对方用户名称
    friendAccount: string;//对方账号
    friendNickname: string;//对方呢称
    friendAvatarPath: string;//对方头像路径
    friendAvatarName: string;//对方头像名称

    questionId: string;//问题Id
    questionTitle: string;//问题Id
    content: string;//回复内容
    answerId: string;//答案Id
    postTime: string;//回复时间
    lastUpdateTime: string;//最后修改时间
    status: number;//状态 10.待审核 20.已发布 110.待审核用户删除 120.已发布用户删除 100010.待审核员工删除 100020.已发布员工删除
    
    avatar: string;//base64格式头像
}

//搜索结果
export interface SearchResult {
    indexModule: number;//索引模块 10:话题 20：问题
    topic:Topic;//话题
    question :Question;//问题
}

//在线留言
export interface Feedback {
    id: string;//Id
    name: string;//名称
    contact: string;//联系方式
    content: string;//内容
    ip: string;//IP
    ipAddress: string;//IP归属地
    createDate: string;//创建时间
}


//会员卡
export interface MembershipCard {
    id: string;//Id
    name: string;//名称
    subtitle: string;//副标题
    userRoleId: string;//角色Id
    lowestPrice: string;//最低销售价
    highestPrice: string;//最高销售价
    lowestPoint: string;//最低积分
    highestPoint: string;//最高积分
    createDate: string;//创建时间
    introduction: string;//简介
    state: number;//状态 1:上架  2.下架 3.规格下架(本状态不存储) 11. 上架标记删除  12. 下架标记删除
    sort: number;//排序
    specificationList: Array<Specification>;//规格集合
    descriptionTagList: Array<string>;//说明标签集合
}

//规格
export interface Specification {
    id: string;//Id
    specificationName: string;//规格名称
    membershipCardId: string;//会员卡Id
    stock: string;//可用库存量
    stockOccupy: string;//占用库存量(已出售库存量)
    stockStatus: number;//增/减 库存状态   0:不变  1:增加   2:减少
	changeStock: string;//更改库存
    point: string;//支付积分
    marketPrice: string;//市场价
    sellingPrice: string;//销售价
	duration: number;//时长
    unit: number;//时长单位 10.小时 20.日 30.月 40.年
    enable: boolean;//是否启用  true:启用 false:禁用
    sort: number;//排序
}
//会员卡赠送任务
export interface MembershipCardGiftTask {
    id: string;//Id
    name: string;//名称
    userRoleId: string;//角色Id
    userRoleName: string;//用户角色名称
    type: number;//任务类型 10:长期  20:一次性
    createDate: string;//任务创建时间
    restrictionGroup: RestrictionGroup;//限制条件组集合
    expirationDate_start: string;//任务有效期范围起始(本参数只在'长期任务'中有效)  默认：1970-1-1 00:00:00
    expirationDate_end: string;//任务有效期范围结束(本参数只在'长期任务'中有效)  默认：2999-1-1 00:00:00
    enable: boolean;//是否启用(本参数只在'长期任务'中有效)  true:启用 false:禁用 
	duration: number;//赠送时长
    unit: number;//赠送时长单位 10.小时 20.日 30.月 40.年
    version: number;//版本号
}
//限制条件组
export interface RestrictionGroup{
    registrationTime_start: string;//用户注册时间范围起始
    registrationTime_end: string;//用户注册时间范围结束
    totalPoint: string;//活动期间积分达到数量
}

//帮助分类
export interface HelpType {
    id: string;//Id
    name: string;//类别名称
    parentId: string;//所属父类Id
    sort: number;//排序
    childNodeNumber: number;//子节点数量
    parentIdGroup: number;//父Id组
	totalHelp: string;//帮助总数量(显示+回收站) 
    helpQuantity: string;//帮助数量(显示)
    image: string;//图片
    description: string;//描述
    childHelpType: Array<HelpType>;//子节点帮助分类
}
//帮助
export interface Help {
    id: string;//Id
    userName: string;//用户名称
    helpTypeId: string;//帮助分类Id
    helpTypeName: string;//帮助分类名称
	name: string;//帮助名称
    content: string;//帮助内容
    times: string;//发表时间
    visible: boolean;//是否可见
}

//自定义HTML
export interface CustomHTML {
    forumTitle: string;//版块标题
    content: string;//用户自定义HTML内容
}


//用户动态
export interface UserDynamic {
    id: string;//Id
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    module: number;//模块 100.话题  200.评论 300.引用评论 400.评论回复  500.问题 600.答案 700.答案回复
    functionIdGroup: string;//功能Id组 格式：,话题Id,评论Id,回复Id,  或者 ,问题Id,答案Id,答案回复Id
    topicId: string;//话题Id -1表示默认空值
    commentId: string;//评论Id -1表示默认空值
    quoteCommentId: string;//引用评论Id -1表示默认空值
    replyId: string;//回复Id -1表示默认空值
    topicTitle: string;//话题标题
    topicContent: string;//话题内容
    topicViewTotal: string;//话题查看总数
    topicCommentTotal: string;//话题评论总数
    allowRoleViewList: Array<string>;//话题允许查看的角色名称集合(默认角色除外)
    hideTagTypeMap: Map<number,boolean>;//key:内容含有隐藏标签类型  10.输入密码可见  20.评论话题可见  30.达到等级可见 40.积分购买可见 50.余额购买可见  value:当前用户是否已对隐藏内容解锁
    commentContent: string;//评论内容
    quoteCommentContent: string;//引用评论内容
    replyContent: string;//回复内容
    questionId: string;//问题Id -1表示默认空值
    answerId: string;//答案Id -1表示默认空值
    answerReplyId: string;//答案回复Id -1表示默认空值
    questionTitle: string;//问题标题
    questionContent: string;//问题内容
    questionViewTotal: string;//问题查看总数
    questionAnswerTotal: string;//问题回答总数
    answerContent: string;//答案内容
    answerReplyContent: string;//答案回复内容
    postTime: string;//发表时间
    status: number;//状态 10.待审核 20.已发布 110.待审核删除 120.已发布删除 100010.待审核员工删除 100020.已发布员工删除

    avatar: string;//base64格式头像
}



//关注
export interface Follow {
    id: string;//Id
    userName: string;//关注的用户名称
    friendUserName: string;//对方的用户名称
    friendAccount: string;//对方账号
    friendNickname: string;//对方呢称
    friendAvatarPath: string;//对方头像路径
    friendAvatarName: string;//对方头像名称
    addtime: string;//加入时间
   
    avatar: string;//base64格式头像
}

//粉丝
export interface Follower {
    id: string;//Id
    userName: string;//关注的用户名称
    friendUserName: string;//对方的用户名称
    friendAccount: string;//对方账号
    friendNickname: string;//对方呢称
    friendAvatarPath: string;//对方头像路径
    friendAvatarName: string;//对方头像名称
    addtime: string;//加入时间
   
    avatar: string;//base64格式头像
}




//私信
export interface PrivateMessage {
    id: string;//Id
    userId: string;//私信用户Id(虚拟字段)   userId和friendUserId字段值对调
    friendUserId: string;//私信对方用户Id (虚拟字段)
    friendUserName: string;//私信对方用户名称
    friendAccount: string;//私信对方账号
    friendNickname: string;//私信对方呢称
    friendAvatarPath: string;//私信对方头像路径
    friendAvatarName: string;//私信对方头像名称
    senderUserId: string;//发送者用户Id
    receiverUserId: string;//接受者用户Id
    senderUserName: string;//发送者用户名称
    senderAccount: string;//发送者账号
    senderNickname: string;//发送者呢称
    senderAvatarPath: string;//发送者头像路径
    senderAvatarName: string;//发送者头像名称
    messageContent: string;//消息内容
    status: number;//消息状态 10:未读  20:已读  110:未读删除  120:已读删除
    sendTime: string;//发送时间
    readTime: string;//阅读时间

    friendAvatar: string;//对方base64格式头像
    senderAvatar: string;//发送者base64格式头像
}


//提醒
export interface Remind {
    id: string;//Id
    receiverUserId: string;//接收提醒用户Id
    senderUserId: string;//提醒发送用户Id
    senderUserName: string;//提醒发送用户名称
    senderAccount: string;//提醒发送账号
    senderNickname: string;//提醒发送用户呢称
    senderAvatarPath: string;//提醒发送用户头像路径
    senderAvatarName: string;//提醒发送用户头像名称
    typeCode: number;//提醒类型代码编号  10:别人评论了我的话题  20:别人回复了我的话题 30:别人引用了我的评论 40:别人回复了我的评论 50:别人回复了我回复过的评论 60:别人解锁了我的话题 70.别人点赞了我的话题 80.别人关注了我 90.我关注的人发表了话题 100.我关注的人发表了评论 110.我关注的人发表了回复 120:别人回答了我的问题  130:别人回复了我的问题 140:别人回复了我的答案 150:别人回复了我回复过的答案 160:别人回复了我的答案回复   170:我关注的人提了问题  180.我关注的人回答了问题 190.我关注的人发表了答案回复
    status: number;//提醒状态 10:未读  20:已读  110:未读删除  120:已读删除
    sendTimeFormat: string;//发送时间格式化
    readTimeFormat: string;//阅读时间格式化
    sendTime: string;//发送时间
    readTime: string;//阅读时间
    topicId: string;//话题Id
    topicTitle: string;//话题标题
    topicCommentId: string;//我的话题评论Id
    topicReplyId: string;//我的话题回复Id
    friendTopicCommentId: string;//对方的话题评论Id
    friendTopicReplyId: string;//对方的话题回复Id

    questionId: string;//问题Id
    questionTitle: string;//问题标题
    questionAnswerId: string;//我的问题答案Id
    questionReplyId: string;//我的问题回复Id
    friendQuestionAnswerId: string;//对方的问题答案Id
    friendQuestionReplyId: string;//对方的问题回复Id

    senderAvatar: string;//提醒发送者base64格式头像

}

//系统通知
export interface SubscriptionSystemNotify {
    id: string;//Id
    systemNotifyId: string;//系统通知Id
    userId: string;//用户Id
    content: string;//通知内容
    status: number;//消息状态 10:未读  20:已读  110:未读删除  120:已读删除
    sendTime: string;//发送时间
    readTime: string;//阅读时间
}

//会员卡订单
export interface MembershipCardOrder {
    orderId: string;//订单号
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    createDate: string;//订单创建时间
    accountPayable: string;//应付款(实际需要支付的费用)
    accountPoint: string;//应付积分
    paymentAmount: string;//已支付金额
    paymentPoint: string;//已支付积分
    userRoleId: string;//购买的会员卡用户角色Id
    roleName: string;//购买的会员卡用户角色名称
    membershipCardId: string;//购买的会员卡Id
    specificationId: string;//购买的会员卡规格Id
    specificationName: string;//购买的会员卡规格名称
    quantity: number;//购买的会员卡数量
    duration: number;//购买的会员卡有效期时长
    unit: number;//购买的会员卡时长单位 10.小时 20.日 30.月 40.年
}

//支付日志
export interface PaymentLog {
    paymentRunningNumber: string;//支付流水号
    paymentModule: number;//支付模块 1.订单支付   5.用户充值 6.账户提现 70.余额购买话题隐藏内容 80.解锁话题隐藏内容分成 90.悬赏金额 100.采纳答案 110.调整赏金 120.话题发红包 130.话题收红包 140.话题返还红包
    sourceParameterId: String;//来源参数Id    用户Id 话题Id 评论Id 问题Id 答案Id 发红包Id
    interfaceProduct: number;//接口产品  -1:员工操作  0:预存款支付  1.支付宝即时到账  4.支付宝手机网站
    tradeNo: string;//交易号
    operationUserType: number;//操作用户类型  0:系统  1: 员工  2:会员
    operationUserName: string;//操作用户名称
    userName: string;//用户名称
    amountState: number;//金额状态  1:账户存入  2:账户支出
    amount: string;//金额
    times: string;//时间
    remark: string;//备注
}

//在线支付
export interface OnlinePaymentInterface {
    id: number;//Id
    name: string;//名称
    interfaceProduct: number;//接口产品  1.支付宝即时到账   4. 支付宝手机网站
    bankList: Array<Bank>;//银行
}

//银行
export interface Bank {
    code: string;//银行简码
    name: string;//银行名称
    icon: string;//银行图标
    selected: boolean;//选中
}

//发红包
export interface GiveRedEnvelope {
    id: string;//Id
    userId: string;//发红包的用户Id
    userName: string;//发红包的用户名称
    account: string;//发红包的账号
    nickname: string;//发红包的用户呢称
    avatarPath: string;//发红包的用户头像路径
    avatarName: string;//发红包的用户头像名称
    type: number;//类型 10.个人定向红包、20.公共随机红包(随机金额)、30.公共定额红包(固定金额)
    totalAmount: string;//总金额
    singleAmount: string;//单个红包金额 type=30时有值
    giveQuantity: number;//发放数量
    wishes: string;//祝福语
    bindTopicId: string;//绑定话题Id  -1表示空值
    bindTopicTitle: string;//绑定话题标题
    remainingQuantity: number;//剩余数量
    refundAmount: string;//中止领取红包后返还金额
    giveTime: string;//发放时间
    accessUserUnwrap: string;//访问用户是否已拆本红包

    avatar: string;//base64格式头像
}

//收红包
export interface ReceiveRedEnvelope {
    id: string;//Id
    receiveUserId: string;//收红包的用户Id
    receiveUserName: string;//收红包的用户名称
    receiveAccount: string;//收红包的账号
    receiveNickname: string;//收红包的用户呢称
    receiveAvatarPath: string;//收红包的用户头像路径
    receiveAvatarName: string;//收红包的用户头像名称
    giveRedEnvelopeId: string;//发红包Id
    giveUserId: string;//发红包的用户Id
    giveUserName: string;//发红包的用户名称
    giveAccount: string;//发红包的账号
    giveNickname: string;//发红包的用户呢称
    giveAvatarPath: string;//发红包的用户头像路径
    giveAvatarName: string;//发红包的用户头像名称
    receiveTime: string;//收取时间
    amount: string;//红包金额

    receiveAvatar: string;//收红包的用户base64格式头像
    giveAvatar: string;//发红包的用户base64格式头像
}

//积分日志
export interface PointLog {
    id: string;//Id
    module: number;//模块 100.话题  200.评论  300.回复 400.积分解锁话题隐藏内容 500.会员卡订单支付 600.账户充值 700.问题 800.答案 900.答案回复 1000.悬赏积分 1100.采纳答案 1200.调整赏金
    parameterId: String;//参数Id    话题Id ,评论Id,回复Id,订单Id
    operationUserType: number;//操作用户类型  0:系统  1: 员工  2:会员
    operationUserName: string;//操作用户名称
    operationAccount: string;//操作用户账号
    userName: string;//用户名称
    pointState: number;//积分状态  1:账户存入  2:账户支出
    point: string;//积分
    times: string;//时间
    remark: string;//备注
}

//奖励积分信息
export interface RewardPointInfo {
    topic_rewardPoint: string;//发表话题奖励积分
    comment_rewardPoint: string;//发表评论奖励积分
    reply_rewardPoint: string;//发表回复奖励积分
    question_rewardPoint: string;//提交问题奖励积分
    answer_rewardPoint: string;//提交答案奖励积分
    answerReply_rewardPoint: string;//提交答案回复奖励积分
}

//登录日志
export interface UserLoginLog {
    id: string;//Id
    userId: string;//用户Id
    userName: string;//用户名称
    typeNumber: number;//类型编号 10:登录 20:续期
    logonTime: string;//登录时间
    ip: string;//登录IP
    ipAddress: string;//IP归属地
}

//举报分类
export interface ReportType  {
    id: string;//Id
    name: string;//分类名称
    sort: number;//排序
    parentId: string;//所属父类Id
    childNodeNumber: number;//子节点数量
    childType:Array<ReportType>;//子分类
    giveReason: boolean;//是否需要说明理由
}

//允许注册账号类型
export interface AllowRegisterAccount {
    local: boolean;//本地账号密码用户
    mobile: boolean;//手机用户
    email: boolean;//邮箱用户
    weChat: boolean;//微信用户
    other: boolean;//其他用户
}

//编辑器标签
export interface EditorTag {
    fontname: boolean;//字体
    fontsize: boolean;//文字大小
    forecolor: boolean;//文字颜色
    hilitecolor: boolean;//文字背景
    bold: boolean;//粗体
    italic: boolean;//斜体
    underline: boolean;//下划线
    removeformat: boolean;//删除格式
    link: boolean;//超级链接
    unlink: boolean;//取消超级链接
    justifyleft: boolean;//左对齐
    justifycenter: boolean;//居中
    justifyright: boolean;//右对齐
    insertorderedlist: boolean;//编号
    insertunorderedlist: boolean;//项目符号
    code: boolean;//代码
    emoticons: boolean;//插入表情
    image: boolean;//允许上传图片
    imageFormat: Array<string>;//允许上传图片格式
    imageSize: string;//允许上传图片大小
    file: boolean;//允许上传文件
    fileFormat: Array<string>;//允许上传文件格式
    fileSize: string;//允许上传文件大小
    embedVideo: boolean;//允许嵌入视频
    uploadVideo: boolean;//允许上传视频
    videoFormat: Array<string>;//允许上传视频格式
    videoSize: string;//允许上传视频大小
    hidePassword: boolean;//输入密码可见
    hideComment: boolean;//评论话题可见
    hideGrade: boolean;//达到等级可见
    hidePoint: boolean;//积分购买可见
    hideAmount: boolean;//余额购买可见
    fullscreen: boolean;//全屏显示

    mention: boolean;//提及
    ai: boolean;//人工智能
    
}
//系统节点参数
export interface SystemNode {
    maxMemory: string;//分配最大内存
    totalMemory: string;//已分配内存
    freeMemory: string;//已分配内存中的剩余空间
    usableMemory: string;//空闲内存
}
//过滤词
export interface FilterWord  {
    wordNumber: number;//过滤词数量
    size: string;//词库大小
    lastModified: string;//词库最后修改时间
    beforeWordList: Array<string>;//前3个词
}
//升级系统
export interface UpgradeSystem{
    id: string;//ID 当前版本
    oldSystemVersion: string;//旧系统版本
    updatePackageVersion: string;//升级包版本
    runningStatus: number;//运行状态   10:开始复制文件  15:迁移旧模板文件  20:完成复制文件  30:开始删除文件  40:完成删除文件   完成状态:9999
    interruptStatus: number;//中断状态 0:正常 1:错误 2:待重启
    upgradeTime: string;//升级时间
    upgradeLogList: Array<UpgradeLog>;//
    updatePackageName: string;//升级包文件名称
    updatePackageTime: string;//升级包上传时间
    updatePackageFirstDirectory: string;//升级包第一级目录名称
    explanation: string;//说明
    sort: string;//排序 格式： 4位年 + 2位月 + 2位日 + 2位时 + 2位分
    version: number;//版本号
}
//升级日志
export interface UpgradeLog{
    time: string;//时间
    content: string;//内容
    grade: number;//级别 1:正常  2:错误
}
//SendService
export interface SendService{
    interfaceProduct: number;//接口产品 1.阿里大于  10.云片
    serviceId: number;//服务Id 1.绑定手机  10.营销广告
    serviceName: string;//服务名称
    alidayu_signName: string;//阿里大于短信签名
    alidayu_templateCode: string;//阿里大于短信模板代码
    alidayu_variable: Map<string,string>;//阿里大于支持变量 key:变量字段  value:备注
    serviceName: string;//服务名称
}

//举报分类
export interface ReportType {
    id: string;//Id
    name: string;//分类名称
    parentId: string;//所属父类Id
    childType: Array<ReportType>;//子分类
    sort: number;//排序
    giveReason:boolean;//是否需要说明理由
    childNodeNumber: number;//子节点数量
    parentIdGroup: number;//父Id组
}

//举报
export interface Report{
    id: string;//Id
    userId: string;//用户Id
    userName: string;//用户名称
    account: string;//账号
    nickname: string;//呢称
    avatarPath: string;//头像路径
    avatarName: string;//头像名称
    staffAccount: string;//处理举报的员工账号
    reportTypeId: string;//举报分类Id
    reportTypeName: string;//举报分类名称
    parameterId: string;//参数Id
    extraParameterId: string;//扩展参数Id
    module: number;//模块
    reason: string;//举报理由
    processResult: string;//处理结果
    remark: string;//备注
    imageInfoList: Array<ImageInfo>;//图片信息集合
    postTime: string;//举报时间
    ip: string;//IP
    ipAddress: string;//IP归属地
    processCompleteTime: string;//处理完成时间
    status: number;//处理状态
    version: number;//版本号
}
