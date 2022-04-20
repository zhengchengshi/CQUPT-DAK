import React, { useState,useEffect } from 'react'
import { View,Image,Text } from '@tarojs/components'
import api from '../../../service/api'
import Taro, {useDidShow} from '@tarojs/taro'
import './index.scss'
export default function Collect() {
    const [itemArr,setItemArr] = useState([])
    const [checkStateArr,setCheckStateArr] = useState([])
    const [deleteBtnPresent,setDeleteBtnPresent] = useState(false)

    const goDetail = (item)=>{
        return(()=>{
            Taro.navigateTo({
                url:'../goods/good-detail/index',
                success:(res)=>{
                    res.eventChannel.emit('goodItem',{item:item})
                }
            })
            console.log(item.goods_id)
        })
    }
    // 勾选
    const check = (index)=>{
        return((event)=>{
            event.stopPropagation()
            checkStateArr[index] = !checkStateArr[index]
            setCheckStateArr([...checkStateArr])
        })
    }
    // 取消收藏
    const goDelete = ()=>{
        // 获取提示字符
        let noticeArr = []
        for(let i = 0;i<checkStateArr.length;i++){
            if(checkStateArr[i]===true){
                let content
                if(itemArr[i].title.length>5){
                    content = itemArr[i].title.substring(0,4)+'...'
                }
                else{
                    content = itemArr[i].title
                }
                noticeArr.push(content)

            }
        }
        Taro.showModal({
            title:"提示",
            content:`确定取消收藏${noticeArr.toString()}的标题吗`,
            success:(res=>{
                if(res.confirm){
                    const copyItemArr = []
                    const copyCheckStateArr = []
                    
                    for(let i = 0;i<checkStateArr.length;i++){
                        if(checkStateArr[i]===true){
                            // 删除项
                            api.delete('/market/favorites',{goods_id:itemArr[i].goods_id},'application/x-www-form-urlencoded')
                                .then(res=>{
                                    console.log(res)
                                })
                            // 循环中不能这样用splice，因为每减一次都会导致数组元素整体前移，出现错位现象
                            // copyItemArr.splice(i,1)
                            // copyCheckStateArr.splice(i,1)
                            // console.log(copyItemArr)
                            
                            
                        }
                        else{
                            // 保留项
                            copyItemArr.push(itemArr[i])
                            copyCheckStateArr.push(checkStateArr[i])
                        }
                    }
                    console.log(copyItemArr)
                    
                    // console.log(copyCheckStateArr)
                    // 删除状态数组对应项
                    setItemArr([...copyItemArr])
                    // 删除收藏数据数组对应项
                    setCheckStateArr([...copyCheckStateArr])
                }
                console.log()
            })
        })
        
    }
    useDidShow(()=>{
        api.get('/market/favorites')
            .then(res=>{
                console.log(res)
                if(res.data.data.length!==0){
                    setItemArr(res.data.data)
                    // 初始化勾选状态数组
                    const initCheckStateArr = Array(res.data.data.length).fill(false)
                    setCheckStateArr(initCheckStateArr)
                    console.log(res.data.data)
                }
            })
    })
    useEffect(()=>{
        if(checkStateArr.includes(true)){
            setDeleteBtnPresent(true)
        }
        else{
            setDeleteBtnPresent(false)
        }
    },[checkStateArr])
    return (
        <View>
            <View className='collect-outer'>
                <View className='collect-header-outer'>
                    <View className='collect-header' >
                        <View className='collect-header-title'>
                            我的收藏
                        </View>
                        {
                            deleteBtnPresent?
                            <View className='collect-header-delete-btn' onClick={goDelete}>
                                <Text>删除</Text>
                            </View>
                            :
                            <View></View>
                        }
                        
                    </View>
                </View>
                {
                    itemArr.map((item,index)=>{
                        return(
                            <View className='collect-item' onClick={goDetail(item)}>
                                <View className='collect-delete-btn'>
                                    {
                                        checkStateArr[index]?
                                        <Image src='https://s4.ax1x.com/2022/02/15/H2EaJf.png' className='collect-delete-img' onClick={check(index)}></Image>
                                        :
                                        <Image src='https://s4.ax1x.com/2022/02/11/HaS939.png' className='collect-delete-img' onClick={check(index)}></Image>
                                    }
                                </View>
                                <View className='collect-item-img-outer'>
                                    <Image src={item.images.length!==0?item.images[0].medium:''} className='collect-item-img' mode='aspectFill'></Image>
                                </View>
                                <View className='collect-item-right'>
                                    <View className='collect-item-right-header'>
                                        <View className='collect-item-title'>
                                            {item.title}
                                        </View>
                                        <View className='collect-item-seller'>
                                            {item.owner.name}
                                        </View>
                                    </View>
                                    <View className='collect-item-right-footer'>
                                        <View className='price'>
                                            ￥42.5
                                        </View>
                                        <View className='communicate-btn'>
                                            约交易
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                
            </View>
        </View>
    )
}
