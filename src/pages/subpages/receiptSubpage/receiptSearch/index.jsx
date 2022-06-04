import { View, Text,Image,Input } from '@tarojs/components'
import { useState,useRef } from 'react'
import Taro from '@tarojs/taro'
import api from '../../../../service/api'
import './index.scss'

export default function ReceiptSearch() {
    const [controlMaskPresent,setControlMaskPresent] = useState(false)
    const iptvalue = useRef()
    const [allReceipts,setAllReceipts] = useState([])
    // 唤起遮罩
    const arouseMask = ()=>{
        setControlMaskPresent(true)
    }
    const cancelMask = ()=>{
        setControlMaskPresent(false)
    }
    // 搜索触发
    const gosearch = async()=>{
        console.log(iptvalue.current.props.value)
        try{
            const res = await api.get(`/order/search?keyword=${iptvalue.current.props.value}&page=1`).catch(err=>Promise.reject(err))
            setAllReceipts([...res.data.data])
                console.log(res)
            }
        catch(err){
            console.log(err)
        }
    }

    const goDetail = (item)=>{
        return(()=>{
            Taro.navigateTo({
                url:'../receiptDetail/index',
                success:(res)=>{
                    res.eventChannel.emit('orderId', { item })
                }
            })
        })
    }
    return (
        <View>
            <View className='receipt-search-outer'>
                <View className='receipt-search-header'>
                    <View className='receipt-search-header-fixed'>
                        <View className='receipt-search-header-content'>
                            <View className='receipt-searchbox'>
                                <Input placeholder='校内搜索' onFocus={arouseMask} onBlur={cancelMask} ref={iptvalue} onConfirm={gosearch}></Input>
                                <View className='receipt-searchbox-btn' onClick={gosearch}>搜索</View>
                            </View>
                        </View>
                    </View>
                </View>
                {
                    controlMaskPresent?
                    <View className='receipt-search-background'></View>
                    :
                    <></>
                }
                <View className='receipt-search-content-empty'>
                    <View className='receipt-search-content-outer'>
                        <View className='receipt-search-content'>
                            {
                                allReceipts.length!==0?
                                allReceipts.map((item,index)=>{
                                    return(
                                        <View className='receipt-search-content-item' key={index} onClick={goDetail(item)}>
                                            <Text className='receipt-search-content-item-left'>{item.title}</Text>
                                            <View className='receipt-search-content-item-right'>
                                                <Text>预估价格:￥</Text>
                                                <Text>{item.price}</Text>
                                                <Image src='https://s1.ax1x.com/2022/03/22/qQmo8g.png'></Image>
                                            </View>
                                        </View>
                                    )
                                })
                                :
                                <View className='receipt-search-content-empty'>
                                    <Image src='https://s1.ax1x.com/2022/03/28/qs8o6I.png'></Image>
                                    <Text>目前没有相关的单子了哦～</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
