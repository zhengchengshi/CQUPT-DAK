import React, { useState } from 'react'
import { View, Text,Image,Input } from '@tarojs/components'
import { useEffect } from 'react'
import { useDidShow } from '@tarojs/taro'
import './index.scss'
export default function ReceiptDetail() {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    const [receiptItem,setReceiptItem] = useState({owner:'',images:[]})
    
    // 监听搜索内容
    useDidShow(()=>{
        // 监听搜索页传过来的搜索内容
        eventChannel.on('orderId',(res)=>{
            setReceiptItem(res.item)
            console.log(res)
        })
        return(()=>{
            eventChannel.off('orderId')
        })
    })
    return (
        <View>
            <View className="receiptDetail-outer">
                <View className="receiptDetail-header">
                    <View className="receiptDetail-header-left">
                        <Text className="receiptDetail-header-title">{receiptItem.title}</Text>
                    </View>
                    <View className="receiptDetail-header-right">
                        <Text>{receiptItem.owner.name}</Text>
                        <Text>3小时前发送</Text>
                    </View>
                </View>
                <View className="receiptDetail-content">
                    <View className="receiptDetail-content-description">
                        {receiptItem.description}
                    </View>
                    <View className="receiptDetail-content-image">
                        {
                            receiptItem.images.length!==0?
                            receiptItem.images.map((item,index)=>{
                                return(
                                    <Image src={item.medium} mode='aspectFill'></Image>
                                )
                            })
                            :
                            <></>
                        }
                    </View>
                    <View className="receiptDetail-notice" >
                        <Text>
                            平台只提供私聊功能，请自行把控交易风险!谨防被骗
                        </Text>
                    </View>
                </View>
                <View className="receiptDetail-footer">
                    <View className="receiptDetail-footer-price">预估价格:<Text>¥3</Text></View>
                    <View className="receiptDetail-footer-chat-btn">发起私聊</View>
                </View>
            </View>
        </View>
    )
}
