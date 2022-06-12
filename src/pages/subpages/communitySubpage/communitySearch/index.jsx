import { View, Text,Image,Input } from '@tarojs/components'
import { useState,useRef } from 'react'
import Taro,{ useDidShow }  from '@tarojs/taro'
import api from '../../../../service/api'
import './index.scss'

export default function CommunitySearch() {
    const [controlMaskPresent,setControlMaskPresent] = useState(false)
    const iptvalue = useRef()
    const [allCommunitys,setCommunitys] = useState([])
    // 唤起遮罩
    const arouseMask = ()=>{
        setControlMaskPresent(true)
    }
    const cancelMask = ()=>{
        setControlMaskPresent(false)
    }
    useDidShow(async()=>{
        setControlMaskPresent(true)
      })
    // 搜索触发
    const gosearch = async()=>{
        console.log(iptvalue.current.props.value)
        try{
            const res = await api.get(`/order/search?keyword=${iptvalue.current.props.value}&page=1`).catch(err=>Promise.reject(err))
            setCommunitys([...res.data.data])
                console.log(res)
            }
        catch(err){
            console.log(err)
        }
    }
    // useDidShow(async()=>{
    //     const res = await api.get('/market/search',{keyword:"",page:'1',seed:''}).catch(err=>Promise.reject(err))
    //     try{
    //         const res = await api.get(`/order/search?keyword=${iptvalue.current.props.value}&page=1`).catch(err=>Promise.reject(err))
    //         setCommunitys([...res.data.data])
    //             console.log(res)
    //         }
    //     catch(err){
    //         console.log(err)
    //     } 
    //   })

    const goDetail = (item)=>{
        return(()=>{
            Taro.navigateTo({
                url:'../communityDetail/index',
                success:(res)=>{
                    res.eventChannel.emit('communityId', { item })
                }
            })
        })
    }
    return (
        <View>
            <View className='community-search-outer'>
                <View className='community-search-header'>
                    <View className='community-search-header-fixed'>
                        <View className='community-search-header-content'>
                            <View className='community-searchbox'>
                                <Input placeholder='校内搜索' onFocus={arouseMask} onBlur={cancelMask} ref={iptvalue} onConfirm={gosearch}></Input>
                                <View className='community-searchbox-btn' onClick={gosearch}>搜索</View>
                            </View>
                        </View>
                    </View>
                </View>
                {
                    controlMaskPresent?
                    <View className='community-search-background'></View>
                    :
                    <></>
                }
                <View className='community-search-content-empty'>
                    <View className='community-search-content-outer'>
                        <View className='community-search-content'>
                            {
                                allCommunitys.length!==0?
                                allCommunitys.map((item,index)=>{
                                    return(
                                        <View className='community-search-content-item' key={index} onClick={goDetail(item)}>
                                            <View className='community-search-content-item-lineOne'>                                                
                                                <View className={item.price > 10?'community-search-content-item-lineOne-comment':'community-search-content-item-lineOne-community'}>
                                                    <Text>{item.price}</Text>
                                                </View>
                                                <Text className='community-search-content-lineOne-text'>{item.title}</Text>
                                            </View>
                                            <View className='community-search-content-item-lineTwo'>
                                                <Text className='community-search-content-item-lineTwo-left'>相关评论{item.price}条</Text>
                                                <Text className='community-search-content-item-lineTwo-right'>2022年6月11日</Text>
                                            </View>                                            
                                        </View>
                                    )
                                })
                                :
                                <View className='community-search-content-empty'>
                                    <Image src='https://s1.ax1x.com/2022/03/28/qs8o6I.png'></Image>
                                    <Text>目前没有相关的帖子了哦～</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
