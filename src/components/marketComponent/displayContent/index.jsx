import React, { useEffect, useState } from 'react';
import { View,Image,Text } from '@tarojs/components';
import Taro,{useDidShow,Events,getCurrentInstance,eventCenter } from '@tarojs/taro';
import api from '../../../service/api';
import './index.scss'
import { selectCheckState } from '../header/checkStateSlice';
import { useSelector } from 'react-redux';
import { selectVerifyState } from '../../login/verifySlice';
// DisplayContent组件同时承载二手市场和线上书屋逻辑
// 由全局状态flag判断，flag==='market'为二手市场 flag==='bookhouse'为线上书屋
// 通过flag发送不同的请求更新数据
export default function DisplayContent() {
    const [allGoods,setAllGoods] = useState([])
    const [allBooks,setAllBooks] = useState([])
    const [judgeStateArr,setJudgeStateArr] = useState([])
    const [checkState,setCheckState] = useState('market')
    const flag = useSelector(selectCheckState)
    const instance = getCurrentInstance()
    let verify = useSelector(selectVerifyState)
    useEffect(()=>{
        const onHideEventId = instance.router.onHide
        eventCenter.on(onHideEventId, ()=>{

        })
    },[])
    // 二手市场和线上书屋模式切换
    // 每次切换都重新发送请求
    useDidShow(()=>{
        // if(flag==='market'){
        //     // 节约首次请求，useDisShow中有一次请求
        //     // setValve(1)
        //     // if(valve===1)
        //     setAllGoods([...allGoods])
        //     setCheckState('market')
        //     api.get('/market/search',{keyword:'',page:'1'})
        //         .then(res=>{
        //             if(res.statusCode!==500){
        //                 console.log(res.data.data)
        //                 setAllGoods([...res.data.data])
        //             }
        //         })
        //         .catch(err=>{
        //             throw err
        //         })
        // }
        // else{
        //     // setAllBooks([...allBooks])
        //     setCheckState('bookhouse')
        //     api.get('/book/search',{keyword:'',page:1})
        //         .then(res=>{
        //             console.log(res.data.data.filter(item=>{
        //                 if(item.value){return item}
        //             }))
        //             const shelveGoods = res.data.data.filter(item=>{
        //                 if(item.value){return item}
        //             })
        //             if(res.data.data) setAllBooks([...shelveGoods])
        //         })
        //         .catch(err=>{
        //             throw err;
        //         })
        // }
    })
    useEffect(()=>{
        if(flag==='market'){
            // 节约首次请求，useDisShow中有一次请求
            // setValve(1)
            // if(valve===1)
            setAllGoods([...allGoods])
            setCheckState('market')
            api.get('/market/search',{keyword:'',page:'1'})
                .then(res=>{
                    if(res.statusCode!==500){
                        console.log(res.data.data)
                        setAllGoods([...res.data.data])
                    }
                })
                .catch(err=>{
                    throw err
                })
        }
        else{
            // setAllBooks([...allBooks])
            setCheckState('bookhouse')
            api.get('/book/search',{keyword:'',page:1})
                .then(res=>{
                    console.log(res.data.data)
                    console.log(res.data.data.filter(item=>{
                        if(item.value){return item}
                    }))
                    const shelveGoods = res.data.data.filter(item=>{
                        if(item.value){return item}
                    })
                    if(res.data.data) setAllBooks([...shelveGoods])
                })
                .catch(err=>{
                    throw err;
                })
        }
        
    },[verify,flag])
    // 裁剪图片为正方形
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
    // 跳转商品/书籍详情
    const goDetail = (index)=>{
        return(()=>{
            if(flag==='market'){
                Taro.navigateTo({
                    url:'../../../../subpages/goods/good-detail/index',
                    success:(res)=>{
                        res.eventChannel.emit('goodItem',{item:allGoods[index]})
                    }
                })
            }
            else{
                Taro.navigateTo({
                    url:'../../../../subpages/bookhouse/book-detail/index',
                    success:(res)=>{
                        // 埋点
                        console.log(allBooks)
                        api.get(`/book/click?book_id="${allBooks[index].book_id}"`)
                            .then(res=>{
                                console.log(res)
                            })
                        res.eventChannel.emit('bookItem',{item:allBooks[index]})
                    }
                })
                console.log(allBooks[index].book_id)
            }
        })
    }
    // 跳转二手市场发布
    const postGood = ()=>{
        Taro.navigateTo({url:'../../../../subpages/goods/good-post/index'})
    }
    // useEffect(()=>{
    //     console.log(allGoods)
    // },[allGoods])
    useDidShow(()=>{
        // api.get('/market/search',{keyword:''})
        //             .then(res=>{
        //                 setAllGoods([...res.data.data])
        //             })
    })
    return (
    <View>
        <View className='market-displaycontent-container'>
            <View className='market-displaycontent-outer'>
                <View className='market-displaycontent'>
                    {
                        // allGoods!==null?
                        // allGoods.map((item,index)=>{
                        //     return(
                        //         <View className='market-displaycontent-item' onClick={goDetail(index)}>
                        //             {/* 因为二手市场和线上书屋接口数据结构不同 同时宽高需要判断 所以需要连续判断 */}
                        //             {
                        //                 flag==='market'&&item.images!==undefined?
                        //                 (judgeStateArr[index]?
                        //                 <View className='market-displaycontent-item-img-outer-height-adaptive'>
                        //                     <Image src={item.images[0].medium} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                        //                 </View>:
                        //                 <View className='market-displaycontent-item-img-outer-width-adaptive'>
                        //                     <Image src={item.images[0].medium} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                        //                 </View>)
                        //                 :
                        //                 (
                        //                     item.value!==undefined&&item.value!==null?
                        //                     (judgeStateArr[index]?
                        //                     <View className='market-displaycontent-item-img-outer-height-adaptive'>
                        //                         <Image src={item.value[0].images[0].medium} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                        //                     </View>:
                        //                     <View className='market-displaycontent-item-img-outer-width-adaptive'>
                        //                         <Image src={item.value[0].images[0].medium} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                        //                     </View>)
                        //                     :
                        //                     (judgeStateArr[index]?
                        //                     <View className='market-displaycontent-item-img-outer-height-adaptive'>
                        //                         <Image src='https://s4.ax1x.com/2022/02/25/bAi7Jf.png' className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                        //                     </View>:
                        //                     <View className='market-displaycontent-item-img-outer-width-adaptive'>
                        //                         <Image src='https://s4.ax1x.com/2022/02/25/bAi7Jf.png' className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                        //                     </View>)
                        //                 )
                        //             }
                        //             <View className='market-displaycontent-item-title'>
                        //                 <Text>{item.title}</Text>
                        //             </View>
                        //             {
                        //                 flag==='market'?
                        //                 <View className='market-displaycontent-item-footer'>
                        //                     <Text>￥{item.price}</Text>
                        //                     <Text>12人想要</Text>
                        //                 </View>
                        //                 :
                        //                 <View className='market-displaycontent-item-footer'>
                        //                     {
                        //                         item.value!==undefined&&item.value!==null?
                        //                         <Text>￥{item.value.price}</Text>:
                        //                         <></>
                        //                     }
                        //                 </View>
                        //             }
                                    
                        //         </View>
                        //     )
                        // })
                        // :
                        // <></>
                    }
                    {
                        allGoods!==null&&flag==='market'?
                        (allGoods.map((item,index)=>{
                            return(
                                <View className='market-displaycontent-item' onClick={goDetail(index)}>
                                    {
                                        judgeStateArr[index]?
                                        <View className='market-displaycontent-item-img-outer-height-adaptive'>
                                            <Image src={item.images[0]?item.images[0].medium:''} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                        </View>:
                                        <View className='market-displaycontent-item-img-outer-width-adaptive'>
                                            <Image src={item.images[0]?item.images[0].medium:''} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                        </View>
                                    }
                                    <View className='market-displaycontent-item-title'>
                                        <Text>{item.title}</Text>
                                    </View>
                                    <View className='market-displaycontent-item-footer'>
                                        <Text>￥{item.price}</Text>
                                        <Text>12人想要</Text>
                                    </View>
                                </View>
                            )
                        }))
                        :
                        (allBooks.map((item,index)=>{
                            return(
                                <View>
                                    <View className='market-displaycontent-item' onClick={goDetail(index)}>
                                        {
                                            (item.value!==null&&item.value[0].images!==null)?
                                            (judgeStateArr[index]?
                                            <View className='market-displaycontent-item-img-outer-height-adaptive'>
                                                <Image src={item.value[0].images[0].medium} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                            </View>:
                                            <View className='market-displaycontent-item-img-outer-width-adaptive'>
                                                <Image src={item.value[0].images[0].medium} className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                            </View>)
                                            :
                                            (judgeStateArr[index]?
                                            <View className='market-displaycontent-item-img-outer-height-adaptive'>
                                                <Image src='https://s4.ax1x.com/2022/02/25/bAi7Jf.png' className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                            </View>:
                                            <View className='market-displaycontent-item-img-outer-width-adaptive'>
                                                <Image src='https://s4.ax1x.com/2022/02/25/bAi7Jf.png' className='market-displaycontent-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                            </View>)
                                        }
                                        <View className='market-displaycontent-item-title'>
                                            <Text>{item.title}</Text>
                                        </View>
                                        <View className='market-displaycontent-item-footer'>
                                            {
                                                item.value!==undefined&&item.value!==null?
                                                <Text>￥{item.value[0].price}</Text>:
                                                <></>
                                            }
                                        </View>
                                    </View>
                                </View>
                            )
                        }))
                    }
                    
                </View>
                {
                    flag==='market'?
                    <Image src="https://s4.ax1x.com/2022/02/06/HKSHG4.png" className='fixed-btn' onClick={postGood}></Image>
                    :
                    <></>
                }
                
            </View>
        </View>
    </View>
    );
}
