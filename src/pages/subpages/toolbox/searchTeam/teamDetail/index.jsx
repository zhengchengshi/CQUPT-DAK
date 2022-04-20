import React from 'react'
import { View,Text,Image } from '@tarojs/components'
import { useEffect } from 'react'
import './index.scss'
import Taro from '@tarojs/taro'
import { useState } from 'react'
export default function TeamDetail() {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    const [teamInfo,setTeamInfo] = useState({team_name:'',images:[],description:'',information:{}})
    const copyContent = (item)=>{
        return(()=>{
            console.log(teamInfo)
            let copyContent;
            switch (item) {
                case 'qq':
                    copyContent = teamInfo.information.qq_number
                    break;
                case 'wx':
                    copyContent = teamInfo.information.wx_number
                    break;
                case 'others':
                    copyContent = teamInfo.information.other_number
                    break;
                default:
                    break;
            }
            Taro.setClipboardData({
                data:copyContent
            })
        })
    }
    useEffect(()=>{
        eventChannel.on('teamInfo',(res)=>{
            console.log(res.item)
            setTeamInfo(res.item)
        })
    },[])
    return (
        <View>
            <View className="teamDetail-outer">
                <View className="teamDetail-header">
                    <View className="teamDetail-header-left">
                        <Text className="teamDetail-header-title">{teamInfo.team_name}</Text>
                    </View>
                </View>
                <View className="teamDetail-content">
                    <View className="teamDetail-maincontent">
                        <View className="teamDetail-maincontent-allimgs">
                            {
                                teamInfo.images.map((item)=>{
                                    return(
                                        <Image src='https://s1.ax1x.com/2022/04/16/LJ8Kc6.png' className='teamDetail-maincontent-img'></Image>
                                    )
                                })
                            }
                            
                        </View>
                        <View className="teamDetail-maincontent-description">
                            {teamInfo.description}
                        </View>
                    </View>
                    <View className="teamDetail-organization-Contact-details">
                        <View className="teamDetail-organization-Contact-details-info" onClick={copyContent('qq')}>
                            <View className='teamDetail-organization-Contact-details-info-left'>QQ</View>
                            <View className='teamDetail-organization-Contact-details-info-right'>{teamInfo.information.qq_number}<Image src='https://s1.ax1x.com/2022/04/16/LYMh1f.png'></Image></View>
                        </View>
                        <View className="teamDetail-organization-Contact-details-info" onClick={copyContent('wx')}>
                            <View className='teamDetail-organization-Contact-details-info-left'>微信</View>
                            <View className='teamDetail-organization-Contact-details-info-right'>点击保存微信群二维码到相册</View>
                        </View>
                        <View className="teamDetail-organization-Contact-details-info" onClick={copyContent('others')}>
                            <View className='teamDetail-organization-Contact-details-info-left'>YY</View>
                            <View className='teamDetail-organization-Contact-details-info-right'>{teamInfo.information.other_number}<Image src='https://s1.ax1x.com/2022/04/16/LYMh1f.png'></Image></View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
