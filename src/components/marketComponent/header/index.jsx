import React, { useState } from 'react';
import { View,Image,Text,Input } from '@tarojs/components';
import Taro , { Events } from '@tarojs/taro'
import { storageCheckState } from './checkStateSlice'
import {useDispatch} from 'react-redux'
import './index.scss'
export default function Header() {
    const [checkClassname,setCheckClassname] = useState(['market-header-unselected-market','market-header-selected-market'])
    const events = new Events()
    const dispatch = useDispatch()
    const goMarket = (flag)=>{
        return(()=>{
            if(flag==='market'){
                dispatch(storageCheckState('market'))
                console.log('market')
                setCheckClassname(['market-header-unselected-market','market-header-selected-market'])
                // Taro.eventCenter.trigger('market-change-checkstate',{flag:'market'})
            }
            else{
                dispatch(storageCheckState('bookhouse'))
                console.log('bookhouse')
                setCheckClassname(['market-header-selected-market','market-header-unselected-market'])
                // Taro.eventCenter.trigger('market-change-checkstate',{flag:'bookhouse'})
            }
        })
    }
    const goSearch = ()=>{
        Taro.navigateTo({url:'/pages/subpages/search/index'})
    }
    const goCollect = ()=>{
        Taro.navigateTo({url:'/pages/subpages/myCollect/index'})
    }
    const goCart = ()=>{
        Taro.navigateTo({url:'/pages/subpages/bookhouse/cart/index'})
    }
    return (
    <View>
        <View className='market-header-outer'>
            <View className='market-header'>
                <View className='market-header-change-market'>
                    <Text className={checkClassname[0]} onClick={goMarket('book')}>线上书屋</Text>
                    <View></View>
                    <Text className={checkClassname[1]} onClick={goMarket('market')}>二手市场</Text>
                </View>
                <View className='market-header-mainfeatures'>
                    <View className='market-header-searchbox' onClick={goSearch}>
                        <Image src='https://s4.ax1x.com/2022/02/06/Hu44fO.png' className='market-header-searchbox-icon'></Image>
                        <Input type="text" placeholder='请输入想要查询的内容' disabled/>
                    </View>
                    {
                        checkClassname[0]==='market-header-unselected-market'?
                        <Image className='market-header-collect-img' src='https://s4.ax1x.com/2022/02/06/Hu59Xj.png' onClick={goCollect}></Image>
                        :
                        <Image className='market-header-collect-img' src='https://s4.ax1x.com/2022/02/12/H0VxMV.png' onClick={goCart}></Image>
                    }
                </View>
                <View className='market-header-arc' />
            </View>
        </View>
    </View>
    );
}
