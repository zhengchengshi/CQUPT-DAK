import React, { useEffect, useState } from 'react';
import { View,Image,Input,Text } from '@tarojs/components';
import Taro,{ useDidShow } from '@tarojs/taro';
import { selectCheckState } from '../../../components/marketComponent/header/checkStateSlice';
import './index.scss'
import { useSelector } from 'react-redux';
export default function index() {
    const [historyItem,setHistoryItem] = useState([])
    const [controlPresent,setControlPresent] = useState('search-history-item')
    const [checkState,setCheckState] = useState('')
    // flag由redux传入，用于区分是从哪个组件跳过来的，做出不同的逻辑处理
    const flag = useSelector(selectCheckState)
    const cleanHistory = ()=>{
        // 立即隐藏样式
        Taro.showModal({
            title:'提示',
            content:'是否删除已保存的历史记录',
            success:(res=>{
                if(res.confirm){
                    setControlPresent('hidden')
                    Taro.removeStorageSync(`${flag}-history`)
                }
            })
        })
        
    }

    const goSearch = (item)=>{
        return((event)=>{
            console.log(item)
            
            let data;
            if(item===undefined){
                // 输入时执行，item为undefined（未传参）
                data = event.detail.value
            }
            else{
                // 点击事件传入item，键盘事件item为null
                data = item
            }
            // history有内容时（回车事件）
            if(Taro.getStorageSync(`${flag}-history`)){
                // 获取所有历史记录项
                const historyArr = [data,...JSON.parse(Taro.getStorageSync(`${flag}-history`))]
                // 数组去重
                const uniqueHistoryArr = new Set(historyArr)
                Taro.setStorageSync(`${flag}-history`,JSON.stringify([...uniqueHistoryArr]))
            }
            else{
                //点击事件 
                const historyArr = [data]
                Taro.setStorageSync(`${flag}-history`,JSON.stringify(historyArr))
            }
            Taro.navigateTo({
                url:'./search-result/index',
                success:(res)=>{
                    res.eventChannel.emit('search-content', { data })
                }
            })
        })
    }
    const deleteHistoryItem = (item,index)=>{
        return(()=>{
            Taro.showModal({
                title:'提示',
                content:`确定删除${item}吗`,
                success:(res=>{
                    if(res.confirm){
                        const historyArr = JSON.parse(Taro.getStorageSync(`${flag}-history`))
                        historyArr.splice(index,1)
                        // 修改localstorage
                        Taro.setStorageSync(`${flag}-history`,JSON.stringify([...historyArr]))
                        // 修改视图层
                        setHistoryItem([...historyArr])
                    }
                })
            })
        })
    }
    useDidShow(()=>{
        // 组件展示时重载所有标签并接触隐藏状态（如果有）
        setControlPresent('search-history-item')
        if(Taro.getStorageSync(`${flag}-history`)){
            setHistoryItem(JSON.parse(Taro.getStorageSync(`${flag}-history`)))
        }
    })
    
    useEffect(()=>{
        setCheckState(flag)
    },[flag])
    return (
    <View>
        <View className='search-outer'>
            <View className='search-content'>
                <View className='search-header'>
                    <View className='search-header-searchbox'>
                        <Image src='https://s4.ax1x.com/2022/02/06/Hu44fO.png' className='search-header-searchbox-icon'></Image>
                        <Input type="text" placeholder='请输入想要查询的内容' onConfirm={goSearch()} focus={true}/>
                    </View>
                </View>
                <View className='search-history'>
                    <View className='search-history-header'>
                        <Text>历史搜索</Text>
                        <View className='search-history-recycleBin-btn' onClick={cleanHistory}>
                            <Image src='https://s4.ax1x.com/2022/02/07/HMYLF0.png' className='search-history-recycleBin-icon'></Image>
                        </View>
                    </View>
                    <View className='search-history-content'>
                        {
                            historyItem.map((item,index)=>{
                                return(
                                    // 长按事件只能绑定在View上
                                    <View onLongPress={deleteHistoryItem(item,index)} onClick={goSearch(item)} className="search-history-item-outer">
                                        <Text className={controlPresent}>
                                            <Text>{item}</Text>
                                        </Text>
                                    </View>
                                )
                            })
                        }
                        
                    </View>
                </View>
            </View>
        </View>
    </View>
    );
}
