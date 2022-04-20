import React, { useEffect,useRef,useState } from 'react'
import { View,Image,Text,Switch,Input,ScrollView } from '@tarojs/components'
import Taro , { useDidHide } from '@tarojs/taro'
import './index.scss'
import {selectMessageList} from '../../../messageListSlice'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../../service/api'
import { selectCurrentMessage } from '../../../currentMessageSlice'
import reverseTime from '../../../utils/reverseTime'
import './index.config'
export default function Chat() {
    // 用于消息传输
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    // 会话列表 用于筛选会话号
    const messageList = useSelector(selectMessageList)
    // 所有聊天信息
    const [allMessages,setAllMessages] = useState([])
    // 商品基本信息
    const [basicInfo,setBasicInfo] = useState({})
    // 实时接收到的消息
    const currentMessage = useSelector(selectCurrentMessage)
    // 会话窗口至底
    const [toBottom,setToBottom] = useState(0)
    // 会议id
    const [currentConversationId,setCurrentConversationId] = useState()
    // 控制会话界面有滚动动画
    // 为了防止首次加载数据强制置底所设置...接收消息后能平滑过渡
    const [controlScrollWithAnimation,setControlScrollWithAnimation] = useState(false)
    // const [controlSticky,setControlSticky] = useState({bottom:'0px'})
    const inputRef = useRef('')
    // 组件隐藏时清空所有内容，防止新的聊天界面出现之前聊天界面的闪烁问题
    useDidHide(()=>{
        // setAllMessages([])
    })
    useEffect(()=>{
        // Taro中设置节点需要定时器
        // setTimeout(()=>{
        //     const chatbody = document.getElementsByClassName('chat-content')[0];
        //     const query = Taro.createSelectorQuery();
        //     query.select('.chat-content').fields({
        //         dataset: true,
        //         size: true,
        //         scrollOffset: true,
        //         properties: ['scrollX', 'scrollY'],
        //         computedStyle: ['margin', 'backgroundColor'],
        //         context: true,
        //     }, (res)=>{
        //         console.log(res)
        //         console.log(chatbody)
        //         setToBottom(res.scrollHeight)
        //     }).exec()
        // },0)
    },[])

    // 记录很有意思的一次对于需求（工具栏固定于键盘上方）的心路历程
    // 首先想到的是直接通过键盘把整个页面向上顶起，和产品沟通后这个做法便不可行，产品要求固定header和商品信息
    // 接着便想要手动获取键盘高度，然后修改工具栏的位置，但是延迟过高，对用户不友好，便作为保留方案，
    // 之后使用KeyboardAccessory这个专门针对于工具栏的组件，效果能达到最佳用户体验，即工具栏动态固定于键盘之上，且将顶部固定
    // 但是组件内部当且仅当支持coverview和coverimage（这里后面还有坑），设置各种手段都没法显示input，最后发现input不能嵌入
    // 于是便考虑通过coverview模拟一个input，但是模拟出来的input除了外观像input，input的大部分需求都无法满足，
    // 包括键入中文时拼音无法进入待行区，无法选中输入的文字等等，因此也决定果断放弃，最后打算使用获取键盘高度，单一修改input高度
    // 工具栏模拟input外观，接着获取到高度，动态挪移真实input覆盖模拟input，这比起保留方案来说用户体验会很不错，但是问题在于coverview
    // 会覆盖所有内容（之前的坑），包括动态挪上去的input，input的z-index拉满都不行，因此便放弃使用KeyboardAccessory，决定第二天向产品反馈（此时已是2022/4/3 凌晨两点）
    // 第二天上午和产品反馈了一下，给出了对于保留方案的优化方案，通过记录用户键盘高度，加速工具栏跳跃延迟，但是我还说了针对小手机工具栏跳跃后聊天界面可能所剩无几！
    // 我提出的方案是键盘弹起时隐藏商品信息，但是产品同学和视觉的同学一商量，好家伙，要求修改之前所有的顶部，要自定义之前全部的顶部
    // 这下难度就大了，之前的页面为了图方便，很少有进行组件化区分，这下几乎要强拆所有的headers了，重写通信逻辑了 T_T

    useEffect(()=>{
        // let socketMsgQueue = [
        //     {
        //         "toId":5,
        //         "entityType":3,
        //         "entityId":42,
        //         "content":"你好uid5"
        //     }
        // ]
        // let socketOpen = false
        // socketOpen = true
        // for (let i = 0; i < socketMsgQueue.length; i++){
        //     sendSocketMessage(JSON.stringify(socketMsgQueue[i]))
        // }
        
    },[])
    // const inputContentChange = (event)=>{
    //     setInputContent(event.detail.value)
    //     console.log(event.detail.value)
    // }
    // const inputFocus = (event)=>{
    //     setControlSticky({bottom:`${event.detail.height}px`})
    // }
    // const inputBlur = ()=>{
    //     setControlSticky({bottom:'0px'})
    // }
    useEffect(()=>{
        eventChannel.on('goodItem',async(res)=>{
            const goodInfo = res.item
            setBasicInfo(goodInfo)
            console.log(messageList)
            console.log(goodInfo)
            console.log(goodInfo.goods_id)
            console.log(goodInfo.entityType)
            console.log(goodInfo.owner.uid)
            Taro.setNavigationBarTitle({title:goodInfo.owner.name})
            // 遍历所有会话列表，判断是否为首次通信
            for(let i = messageList.length - 1;i>=0;i--){
                // 使用实体类型+商品id+商家id作为判断条件，没有结果则表明为首次聊天
                // 若有结果则查询历史记录,没有则在发送消息时存储会话id
                if(
                    messageList[i].entityInfo.entityId===goodInfo.goods_id&&  //货品id
                    messageList[i].entityInfo.entityType===goodInfo.entityType&&  //实体类型 3 二手市场
                    messageList[i].entityInfo.owner.uid===goodInfo.owner.uid   //商家id
                ){


                    console.log(messageList[i].conversationId)
                    // 缓存当前会话id
                    setCurrentConversationId(messageList[i].conversationId)
                    const messages = await api.get(`/message/list/${messageList[i].conversationId}`)
                    // 用于动态获取填充内容后聊天界面的滚动高度并将窗口移至底部
                    const query = Taro.createSelectorQuery();

                    query.select('.chat-content').fields({
                        dataset: true,
                        size: true,
                        scrollOffset: true,
                        properties: ['scrollX', 'scrollY'],
                        computedStyle: ['margin', 'backgroundColor'],
                        context: true,
                    }, async(res)=>{
                        console.log(res)
                        console.log(messages)
                        // 修改聊天信息
                        setAllMessages(messages.data.data.reverse())
                        // 无痛修改窗口高度至底
                        // 这里有坑infinity不行，只能设置一个大值了T_T
                        setToBottom(100000000)
                        
                        // 设置全部消息已读
                        await api.post('/message/read',{conversationId:messageList[i].conversationId,targetId:messageList[i].entityInfo.owner.uid})
                        .then(res=>{
                            console.log(res)
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                        setTimeout(()=>{
                            // 首次接收数据之后，允许接收到消息后平滑置底（防止首次接收到数据后出现大面积滚动）
                            setControlScrollWithAnimation(true)
                        },1000)
                    }).exec()
                    break;
                }
            }
        })
    },[])
    // 接收到消息，重新请求消息列表，并强制更新视图层，使会话置底
    useEffect(async()=>{
        console.log()
        if(currentMessage.fromUser&&basicInfo.owner)
        // 临时模拟currentMessage.fromUser.uid为3 临时uid为3
        if(currentMessage.fromUser.uid===basicInfo.owner.uid||currentMessage.fromUser.uid===3){
            console.log(allMessages)
            console.log(currentMessage)
            // 判断是否为初次聊天，初次聊天没有会话id，需要使用服务器返回的会话id，初次进入会话如果聊过天可直接使用会话id
            const conversationId = currentConversationId?currentConversationId:currentMessage.conversationId
            // const messages = await api.get(`/message/list/${conversationId}`)
            // console.log(messages)
            // setAllMessages(messages.data.data.reverse())
            setAllMessages([...allMessages,currentMessage])
            // 强制更新视图层... T_T
            setToBottom(toBottom-1)

            // 设置全部消息已读
            await api.post('/message/read',{conversationId:currentConversationId,targetId:basicInfo.owner.uid})
            .then(res=>{
                console.log(res)
            })
            .catch(err=>{
                console.log(err)
            })

            // Taro.showToast({
            //     title:'你有一条新消息',
            //     icon:'none'
            // })
        }
    },[currentMessage])

    const sendMessage = ()=>{
        console.log(inputRef.current.value)
        console.log(basicInfo)
        // 消息内容
        const msg = JSON.stringify({
            "toId":basicInfo.owner.uid,
            "entityType":basicInfo.entityType,
            "entityId":basicInfo.goods_id,
            "content":`${inputRef.current.value}`
        })
        // 发送消息
        Taro.sendSocketMessage({
            data:msg,
            complete:(res)=>{
                console.log(res)
            }
        })
        // 清空键盘待行区
        inputRef.current.value = ''
    }

    // 发送图片
    const sendPhoto = ()=>{
        Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:  async(res) => {
                console.log(res.tempFilePaths[0])
                const token = await api.get('/picture/upload-token')
                    .then(res=>{
                            const token = res.data.data.token
                            console.log(token)
                            return token
                        })
                await Taro.uploadFile({
                    url:'http://up-z2.qiniup.com',
                    name:'file',
                    filePath:res.tempFilePaths[0],
                    formData:{
                        token:token,
                        file:res.tempFilePaths[0]
                    },
                    success:(res)=>{
                        const hashString = JSON.parse(res.data).hash
                        console.log(hashString)
                        const msg = JSON.stringify({
                            "toId":basicInfo.owner.uid,
                            "entityType":basicInfo.entityType,
                            "entityId":basicInfo.goods_id,
                            "content":`__image__http://cdn.chongyouyizhan.xyz/${hashString}`
                        })
                        // 发送消息
                        Taro.sendSocketMessage({
                            data:msg,
                            complete:(res)=>{
                                console.log(res)
                            }
                        })
                    }
                })
                
            }

        })
    }
    // 全屏图片
    const goImageDetail = (url)=>{
        return(()=>{
            Taro.previewImage({
                urls:[url],
                success:(res)=>{
                    console.log(res)
                }
            })
        })
    }
    // 出售货品
    const saleBtnChange = (event)=>{
        console.log(basicInfo.goods_id)
        console.log(basicInfo.owner.uid)

        if(event.detail.value){
            api.post('/market/sold',{goods_id:basicInfo.goods_id,targetId:basicInfo.owner.uid},'application/x-www-form-urlencoded')
                .then(res=>{
                    console.log(res)
                })
        }
        else{
            api.delete('/market/sold',{goods_id:basicInfo.goods_id,targetId:basicInfo.owner.uid},'application/x-www-form-urlencoded')
                .then(res=>{
                    console.log(res)
                })
        }
        console.log(event.detail.value)
    }
    return (
        <View>
            <View className='chat-outer'>
                {/* <View className="chat-header-outer">
                    <View className="chat-header">
                        <Image src='https://s4.ax1x.com/2022/03/03/bG7UaQ.png' className='chat-header-btn'></Image>
                        <Text>
                            18-网络信息安全与信息法-赵…
                        </Text>
                    </View>
                </View> */}
                {/* <View className="chat-goodinfo-outer"> */}
                
                    <View className="chat-goodinfo">
                        <View className="chat-goodinfo-left">
                            <Image src={basicInfo.images&&basicInfo.images.length!==0?basicInfo.images[0].medium:''} mode='aspectFill'></Image>
                        </View>
                        <View className="chat-goodinfo-right">
                            <View className="chat-goodinfo-title">
                                {basicInfo.title}
                            </View>
                            <View className="chat-goodinfo-secondline">
                                <Text className="price">
                                    ¥{basicInfo.price}
                                </Text>
                                <View className="chat-goodinfo-operate">
                                    <Text>
                                        标记为已出售给他
                                    </Text>
                                    <Switch
                                        color="#0062FF"
                                        onChange={saleBtnChange}
                                    ></Switch>

                                </View>
                            </View>
                        </View>
                    </View>
                {/* </View> */}
                <ScrollView 
                    className="chat-content"
                    scrollY
                    scrollWithAnimation={controlScrollWithAnimation}
                    scrollTop={toBottom}
                >

                {
                    // 对方发来的消息，使用商品/订单主人id和消息列表中id进行判断是对方消息还是自己消息
                    allMessages.map((item,index)=>{
                        // 这里的判断条件等登录写完修改 是错误的
                        // 要用用户自己的uid和fromUser.uid进行判断
                        if(basicInfo.owner.uid===item.fromUser.uid){
                            return(
                                <View className="chat-content-others">
                                    <View className="chat-content-time">
                                        {
                                            reverseTime(item.createTime)
                                        }
                                    </View>
                                    <View className="chat-content-others-message">
                                        <View className="chat-content-others-message-left">
                                            <Image src='https://jdc.jd.com/img/200' className="chat-content-others-message-avator"></Image>
                                        </View>
                                        <View className="chat-content-others-message-right">
                                            <View className="chat-content-others-bubble">
                                                {
                                                    item.content.includes('__image__')?
                                                    <Image src={item.content.substring(9)} onClick={goImageDetail(item.content.substring(9))}></Image>
                                                    :
                                                    item.content
                                                }
                                            </View>
                                            <View className="chat-content-others-message-state">
                                                {/* 此界面内对方的消息任何情况都已读 */}
                                                已读

                                                {
                                                    // item.status===1?
                                                    // '已读'
                                                    // :
                                                    // '未读'
                                                }
                                                
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        else{
                            return(
                                <View className="chat-content-mine">
                                    <View className="chat-content-time">
                                        {
                                            reverseTime(item.createTime)
                                        }
                                    </View>
                                    <View className="chat-content-my-message">
                                        <View className="chat-content-my-message-left">
                                            <View className="chat-content-my-bubble">
                                                {
                                                    item.content.includes('__image__')?
                                                    <Image src={item.content.substring(9)} onClick={goImageDetail(item.content.substring(9))}></Image>
                                                    :
                                                    item.content
                                                }
                                            </View>
                                            <View className="chat-content-my-message-state">
                                                {
                                                    item.status===1?
                                                    '已读'
                                                    :
                                                    '未读'
                                                }
                                            </View>
                                        </View>
                                        <View className="chat-content-my-message-right">
                                            <Image src='https://jdc.jd.com/img/200' className="chat-content-my-message-avator"></Image>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                        
                        
                    })
                }


                    
                    
                    
                    {/* <View className="chat-content-my-message">
                        <View className="chat-content-time">
                            11-24 12:43
                        </View>
                        <View className="chat-content-my-message">
                            <View className="chat-content-my-message-left">
                                <View className="chat-content-my-bubble">
                                    <Image src='https://s1.ax1x.com/2022/04/03/q7o39K.png' mode='aspectFill'></Image>
                                </View>
                                <View className="chat-content-my-message-state">
                                    已读
                                </View>
                            </View>
                            <View className="chat-content-my-message-right">
                                <Image src='https://jdc.jd.com/img/200' className="chat-content-my-message-avator"></Image>
                            </View>
                        </View>
                    </View> */}
                </ScrollView>
                <View className="chat-sticky-toolbox-outer">
                    <View className="chat-sticky-toolbox">
                        <Image src='https://s1.ax1x.com/2022/04/02/qoHBNt.png' className='chat-sticky-toolbox-camera-btn' onClick={sendPhoto}></Image>
                        {/* 受控组件 */}
                        <Input 
                            className="chat-sticky-toolbox-input" 
                            placeholder='聊点什么呢'
                            ref={inputRef}
                            onConfirm={sendMessage}
                            // adjust-position={false}
                            // holdKeyboard={true}
                            // onFocus={inputFocus}
                            // onBlur={inputBlur}
                        >
                            {/* <KeyboardAccessory className="chat-sticky-toolbox-inner-outer">
                                <CoverView className="chat-sticky-toolbox-inner">
                                    <CoverImage src='https://s1.ax1x.com/2022/04/02/qoHBNt.png' className='chat-sticky-toolbox-camera-btn-inner'></CoverImage> */}
                                    {/* 模拟输入框 */}
                                    {/* <CoverView className="chat-sticky-toolbox-input-inner"> */}
                                        {/* {inputContent} */}
                                    {/* </CoverView>
                                    <CoverView className="chat-sticky-toolbox-send-btn-inner">
                                        发送
                                    </CoverView>
                                </CoverView>
                            </KeyboardAccessory> */}
                        </Input>
                        <View className="chat-sticky-toolbox-send-btn" onClick={sendMessage}>
                            发送
                        </View>
                    </View>
                </View>
            </View>
            {/* <Textarea holdKeyboard className='chat-sticky-toolbox'>
            <KeyboardAccessory className="container" style={{ height: '50px',width:'100%' }} >
                        </KeyboardAccessory>
            </Textarea> */}
        </View>
    )
}
