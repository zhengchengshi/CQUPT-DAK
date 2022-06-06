import Taro,{useDidShow} from '@tarojs/taro';
import { useEffect, useState } from 'react';
import { View,Image,Text } from '@tarojs/components';
import api from '../../../../service/api';
import './index.scss'

export default function GoodDetail() {
    const pages = Taro.getCurrentPages()
    const current = pages[pages.length - 1]
    const [pageId,setPageId] = useState()
    const eventChannel = current.getOpenerEventChannel()
    const [goodInfo,setGoodInfo] = useState({})
    const [judgeStateArr,setJudgeStateArr] = useState([])
    const collect = ()=>{
        if(goodInfo.isCollect===true){
            setGoodInfo({...goodInfo,isCollect:false})
            api.delete('/market/favorites',{"goods_id":pageId},"application/x-www-form-urlencoded")
                .then(res=>{
                    console.log(res)
                })
        }
        else{
            setGoodInfo({...goodInfo,isCollect:true})
            api.post('/market/favorites',{"goods_id":pageId},"application/x-www-form-urlencoded")
                .then(res=>{
                    console.log(res)
                })
        }
        // api.delete('/market/favorites',{goods_id:1},"application/x-www-form-urlencoded}")
        //     .then(res=>{
        //         console.log(res)
        //     })
    }
    const goback = ()=>{
        Taro.reLaunch({
            url:'../../../market/market'
        })
    }
    const goChat = ()=>{
        Taro.navigateTo({
            url:'../../chat/index',
            success:(res)=>{
                // 传输商品信息和实体类型(3表二手市场)给聊天组件
                res.eventChannel.emit('goodItem',{item:{...goodInfo,entityType:3}})
            }
        })
    }
    const imgOnload = (index)=>{
        return((event)=>{
            if(event.detail.width>event.detail.height){
                const temporaryArr = [...judgeStateArr]
                temporaryArr[index] = true
                setJudgeStateArr([...temporaryArr])
            }
            else{
                const temporaryArr = [...judgeStateArr]
                temporaryArr[index] = false
                setJudgeStateArr([...temporaryArr])
            }
        })
    }
    useEffect(()=>{
        // 要获取最新数据故设置阀门，防止重复监听
        eventChannel.on('goodItem',(res)=>{
            console.log(res.item)
            setGoodInfo(res.item)
            setPageId(res.item.goods_id)
        })
        return(()=>{
            eventChannel.off('goodItem')
        })
    },[])
    // 根据id筛选数据
    // useEffect(()=>{
    //     if(pageId!==undefined){
    //         (async ()=>{
    //             const allgoods = await api.get('/market/search',{keyword:'',page:"1"})
    //                 .then(res=>{
    //                     return res.data.data
    //                 })
    //             allgoods.map(item=>{
    //                 if(item.goods_id===pageId){
    //                     console.log(item)
    //                     setGoodInfo(item)
    //                 }
    //             })
    //         })()
    //     }
    // },[pageId])
    useDidShow(()=>{
        
    })
    return (
    <View>
        <View className='good-detail-outer'>
            <View className='good-detail-header'>
                <View className='good-detail-header-fixed'>
                    <Image src='https://s4.ax1x.com/2022/02/07/HQVNtA.png' className='good-detail-header-icon' onClick={goback}></Image>
                </View>
            </View>
            <View className='good-detail-content'>
                <View className='good-detail-title'>
                    <Text>{goodInfo.title}</Text>
                </View>
                <View className='good-detail-seller'>
                    {
                        goodInfo.owner!==undefined?
                        <Text>{goodInfo.owner.realName}发布</Text>
                        :
                        <></>
                    }
                    
                </View>
                <View className='good-detail-intro'>
                    <Text>
                        {goodInfo.description}
                    </Text>
                </View>
                {
                    goodInfo.images!==undefined?
                    goodInfo.images.map((item,index)=>{
                        return(
                            <View className='good-detail-img-outer' key={index}>
                                <Image src={item.medium} mode='aspectFill' className='good-detail-img-height-adaptive' onLoad={imgOnload(index)}></Image>
                            </View>
                        )
                    })
                    :
                    <></>
                }
                <View className='filling'></View>
            </View>
            <View className='good-detail-toolbar-outer'>
                <View className='good-detail-toolbar'>
                    <View className='good-detail-collect' onClick={collect}>
                        {
                            goodInfo.isCollect?
                            <Image src='https://s4.ax1x.com/2022/02/16/HWj3JH.png' className='good-detail-collect-icon'></Image>
                            :
                            <Image src='https://s4.ax1x.com/2022/02/07/HQLrMq.png' className='good-detail-collect-icon'></Image>
                        }
                        <Text>收藏</Text>
                    </View>
                    <View className='good-detail-btn' onClick={goChat}>
                        聊一聊
                    </View>
                    <View className='good-detail-btn' onClick={goChat}>
                        我想要
                    </View>
                </View>
            </View>
        </View>
    </View>
    );
}
