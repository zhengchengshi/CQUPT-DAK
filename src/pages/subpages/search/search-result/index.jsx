import React, { useEffect, useState } from 'react';
import { View,Image,Input,Text } from '@tarojs/components';
import Taro,{ useDidShow } from '@tarojs/taro';
import api from '../../../../service/api';
import { selectCheckState } from '../../../../components/marketComponent/header/checkStateSlice';
import { useSelector } from 'react-redux';
import './index.scss'
export default function SearchResult() {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    const [iptValue,setIptValue] = useState('__init__')
    const [searchContent,setSearchContent] = useState([])
    const [judgeStateArr,setJudgeStateArr] = useState([])
    const flag = useSelector(selectCheckState)
    // 图片宽高判断
    const imgOnload = (event)=>{
        if(event.detail.width>event.detail.height){
            setJudgeStateArr([...judgeStateArr,true])
        }
        else{
            setJudgeStateArr([...judgeStateArr,false])
        }
    }

    const goHomepage = ()=>{
        Taro.switchTab({url:'../../../market/market'})
    }
    const gosearch = (event)=>{
        let data = event.detail.value
        // 获取所有历史记录项
        const historyArr = [data,...JSON.parse(Taro.getStorageSync(`${flag}-history`))]
        // 数组去重
        const uniqueHistoryArr = new Set(historyArr)
        // 修改本地历史记录
        Taro.setStorageSync(`${flag}-history`,JSON.stringify([...uniqueHistoryArr]))
        setIptValue(data)
    }
    const goDetail = (index)=>{
        return(()=>{
            console.log(searchContent[index])
            if(flag==='market'){
                Taro.navigateTo({
                    url:'../../goods/good-detail/index',
                    success:(res)=>{
                        console.log(searchContent[index])
                        res.eventChannel.emit('goodItem',{item:searchContent[index]})
                    }
                })
            }
        })
    }
    const goBookDetail = (item)=>{
        return(()=>{
            Taro.navigateTo({
                url:'../../bookhouse/book-detail/index',
                success:(res)=>{
                    console.log(item.book_id)
                    res.eventChannel.emit('bookItem',{item:item})
                }
            })
        })
    }
    // 监听搜索内容
    useEffect(()=>{
        // 监听搜索页传过来的搜索内容
        eventChannel.on('search-content',(res)=>{
            setIptValue(res.data)
            console.log(res.data)
        })
        return(()=>{
            eventChannel.off('search-content')
        })
    },[])
    useEffect(()=>{
        // 防止初次请求时搜索的内容未更新(即搜索内容为初始化的字符串)
        if(iptValue!=='__init__'){
            if(flag==='market'){
                api.get('/market/search',{keyword:iptValue,page:"1",seed:""})
                    .then(res=>{
                        console.log(iptValue)
                        if(res.data.data!==''){
                            if(res.data.data!==null){
                                setSearchContent(res.data.data)
                            }
                            console.log(res.data.data)
                        }
                        else{
                            setSearchContent([])
                            console.log(res.data.data)
                        }
                    })
            }
            else{
                api.get('/book/search',{keyword:iptValue,page:1})
                    .then(res=>{
                        console.log(res)
                        if(res.data.data!==undefined&&res.data.data!==null){
                            setSearchContent(res.data.data)
                            console.log(res.data.data)
                        }
                        else{
                            setSearchContent([])
                            console.log(res.data.data)
                        }
                    })
            }
        }
    },[iptValue])
    return (
    <View>
        <View className='search-result-header-container'>
            <View className='search-result-header-outer'>
                <View className='search-result-header'>
                    <View className='search-result-header-searchbox'>
                        <Image src='https://s4.ax1x.com/2022/02/06/Hu44fO.png' className='search-result-header-searchbox-icon'></Image>
                        <Input type="text" placeholder='请输入想要查询的内容' value={iptValue} onConfirm={gosearch}/>
                    </View>
                    <Image className='search-result-header-collect-img' src='https://s4.ax1x.com/2022/02/07/HQVNtA.png' onClick={goHomepage}></Image>
                </View>
            </View>
        </View>
        {
            flag==="market"?
            <View className='market-search-result-displaycontent'>
            {   
                searchContent.map((item,index)=>{
                    return(
                        <View className='market-search-result-displaycontent-item' onClick={goDetail(index)}>
                            {
                                judgeStateArr[index]?
                                <View className='market-search-result-displaycontent-item-img-outer-height-adaptive'>
                                    <Image src={item.images[0].medium} className='market-search-result-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload}></Image>
                                </View>:
                                <View className='market-search-result-displaycontent-item-img-outer-width-adaptive'>
                                    <Image src={item.images[0].medium} className='market-search-result-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload}></Image>
                                </View>
                            }
                            {/* <View className='market-search-result-displaycontent-item-img-outer'>
                                <Image src={item.images[0].medium} className='market-search-result-displaycontent-item-img' mode="widthFix"></Image>
                            </View> */}
                            <View className='market-search-result-displaycontent-item-title'>
                                <Text>{item.title}</Text>
                            </View>
                            {
                                flag==='market'?
                                <View className='market-search-result-displaycontent-item-footer'>
                                    <Text>￥{item.price}</Text>
                                    <Text>12人想要</Text>
                                </View>
                                :
                                <View className='market-search-result-displaycontent-item-footer'>
                                    {
                                        item.value!==undefined?
                                        <Text>￥{item.value.price}</Text>:
                                        <></>
                                    }
                                    
                                </View>
                            }
                        </View>
                    )
                })
            }
        </View>
        :
        
        <View className='bookhouse-search-result-displaycontent'>
            {
                searchContent.map(item=>{
                    return(
                        item.value!==null?
                        <View className='bookhouse-search-result-displaycontent-item' onClick={goBookDetail(item)}>
                            <View className='bookhouse-search-result-displaycontent-item-img-outer'>
                                <Image src={item.value[0].images[0].medium} className='bookhouse-search-result-displaycontent-item-img' mode='aspectFill'></Image>
                            </View>
                            <View className='bookhouse-search-result-displaycontent-item-rightpart'>
                                <View className='bookhouse-search-result-displaycontent-item-title'>
                                    {item.title}
                                </View>
                                <View className='bookhouse-search-result-displaycontent-item-basic-info'>
                                    <View>
                                        作者:{item.author}
                                    </View>
                                    <View>
                                        出版:{item.publish_by}
                                    </View>
                                </View>
                                <View className='bookhouse-search-result-displaycontent-item-price'>
                                    ¥42.8-¥50.8
                                </View>
                            </View>
                        </View>
                        :
                        <></>
                    )
                    
                })
            }
        </View>
        }
    </View>
    );
}
