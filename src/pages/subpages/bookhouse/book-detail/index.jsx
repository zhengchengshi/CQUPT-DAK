import { AtSwitch,AtTag } from 'taro-ui'
import { Swiper, SwiperItem,View,Image,Text } from '@tarojs/components'
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import api from '../../../../service/api';
import './index.scss'

export default function GoodDetail() {
    const pages = Taro.getCurrentPages()
    const current = pages[pages.length - 1]
    const [judgeStateArr,setJudgeStateArr] = useState([])
    const eventChannel = current.getOpenerEventChannel()
    const [newDegreeInfo,setNewDegreeInfo] = useState('没有任何笔记和绘画痕迹')
    const [presentNum,setPresentNum] = useState(1)
    const [needFreight,setNeedFreight] = useState(true)
    // 初始选中态都为false
    const [tagCheckState,setTagCheckState] = useState([false,false,false,false])
    const [correspondValue,setCorrespondValue] = useState({price:0,images:[]})
    const [bookInfo,setBookInfo] = useState({})
    const [valve,setValve] = useState(0)
    const [wear,setWear] = useState()
    const gocart = ()=>{
        let flag = false
        // 判断有无匹配得上的磨损度
        bookInfo.value.map(item=>{
            console.log(item)
            console.log(wear)

            if(item.wear===wear){
                console.log(true)
                flag = true
            }
        })
        if(flag===true){
            api.post('/book/cart',{
                book_id:bookInfo.book_id,
                wear:wear,
                transport:needFreight?'2':'1'
            })
            .then(res=>{
                if(res.data.status===50000){
                    Taro.showToast({
                        title:'添加购物车失败',
                        icon:'none'
                    })
                    throw res
                }
                else{
                    Taro.showToast({
                        title:'添加购物车成功',
                        icon:'none'
                    })
                }
                console.log(res)
            })
        }
        else{
            Taro.showToast({
                title:'商品已售罄',
                icon:'none'
            })
        }
        
        
    }
    const swiperChange =(event)=>{
        setPresentNum(event.detail.current+1)
        console.log(event.detail.current)
    }
    const imgOnload = (index)=>{
        return((event)=>{
            // 这里传递索引的原因在于图片加载的先后顺序取决于图片大小，所以这么来，不能直接加于末尾
            if(event.detail.width>event.detail.height){
                judgeStateArr[index] = true
                setJudgeStateArr([...judgeStateArr])
            }
            else{
                judgeStateArr[index] = false
                setJudgeStateArr([...judgeStateArr])
            }
        })
    }
    const goBack = ()=>{
        Taro.switchTab({url:'../../../market/market'})
    }
    // 修改新旧程度状态
    const changeBringUpState = (value)=>{
        setNeedFreight(!value)
    }
    const changeTagState = (index)=>{
        return(()=>{
            // 数组初始化
            const copyTagCheckState = [false,false,false,false]
            // 状态取反
            copyTagCheckState[index] = true
            setTagCheckState([...copyTagCheckState])
            
            // 修改物品新旧程度的说明
            switch (index) {
                case 0:
                    setWear(100)
                    // 数据初始化
                    let initValue = {
                        price:'暂无报价',
                        images:[{large:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',medium:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',tiny:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png'}]
                    }
                    // 判断有无匹配项
                    bookInfo.value.map(item=>{
                        if(item.wear===100){
                            initValue = item
                        }
                    })
                    setCorrespondValue(initValue)
                    setNewDegreeInfo('没有任何笔记和绘画痕迹')
                    break;
                case 1:
                    setWear(90)
                    initValue = {
                        price:'暂无报价',
                        images:[{large:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',medium:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',tiny:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png'}]
                    }
                    bookInfo.value.map(item=>{
                        if(item.wear===90){
                            initValue = item
                        }
                    })
                    setCorrespondValue(initValue)
                    setNewDegreeInfo('可能含有极少量笔记')
                    break;
                case 2:
                    setWear(70)
                    initValue = {
                        price:'暂无报价',
                        images:[{large:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',medium:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',tiny:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png'}]
                    }
                    bookInfo.value.map(item=>{
                        if(item.wear===70){
                            initValue = item
                        }
                    })
                    setCorrespondValue(initValue)
                    setNewDegreeInfo('可能含有部分笔记，不影响使用')
                    break;
                case 3:
                    setWear(50)
                    initValue = {
                        price:'暂无报价',
                        images:[{large:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',medium:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png',tiny:'https://s4.ax1x.com/2022/02/25/bAi7Jf.png'}]
                    }
                    bookInfo.value.map(item=>{
                        if(item.wear===50){
                            initValue = item
                        }
                    })
                    setCorrespondValue(initValue)
                    setNewDegreeInfo('含有大量笔记或书本较旧')
                    break;
                default:
                    break;
            }
        })
    }
    useEffect(()=>{
        // 要获取最新数据故设置阀门，防止重复监听
        if(valve===0){
            setValve(1)
            eventChannel.on('bookItem',(res)=>{
                const bookItem = res.item
                console.log(res)
                setBookInfo(bookItem)
                // 使用后端排序数据初始化对应图片
                switch (bookItem.value[0].wear) {
                    case 100:
                        setTagCheckState([true,false,false,false])
                        setWear(100)
                        break;
                    case 90:
                        setTagCheckState([false,true,false,false])
                        setWear(90)
                        break;
                    case 70:
                        setTagCheckState([false,false,true,false])
                        setWear(70)
                        break;
                    case 50:
                        setTagCheckState([false,false,false,true])
                        setWear(50)
                        break;
                    default:
                        setTagCheckState([false,false,false,false])
                        break;
                }
                setCorrespondValue(bookItem.value[0])
                // setPageId(bookItem.book_id)
            })
        }
        return(()=>{
            eventChannel.off('bookItem')
        })
    },[])
    
    return (
    <View>
        <View className='book-detail-outer'>
            <View className='book-detail-header'>
                <View className='book-detail-header-fixed'>
                    <Image src='https://s4.ax1x.com/2022/02/07/HQVNtA.png' className='book-detail-header-icon' onClick={goBack}></Image>
                </View>
            </View>
            <View className='book-detail-content'>
                <View className='book-detail-swiper-outer'>
                    <Swiper
                      className='book-detail-swiper'
                      circular
                      displayMultipleItems
                      onChange={swiperChange}
                    >
                            {   
                                correspondValue.images!==null?
                                correspondValue.images.map((item,index)=>{
                                    return(
                                        <SwiperItem key={index}>
                                            {
                                                judgeStateArr[index]?
                                                <View className='book-detail-swiper-item-img-outer-height-adaptive'>
                                                    <Image src={item.medium} className='book-detail-swiper-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                                </View>:
                                                <View className='book-detail-swiper-item-img-outer-width-adaptive'>
                                                    <Image src={item.medium} className='book-detail-swiper-item-img' mode='aspectFill' onLoad={imgOnload(index)}></Image>
                                                </View>
                                            }
                                        </SwiperItem>
                                    )
                                })
                                :
                                <></>
                            }
                    </Swiper>
                    <View className='book-detail-swiper-capsule'>
                        {
                            correspondValue.images!==null?
                            <Text>
                                {presentNum}/{correspondValue.images!==undefined?correspondValue.images.length:<></>}
                            </Text>
                            :
                            <></>
                        }
                    </View>
                </View>
                <View className='book-detail-info'>
                    <View className='book-detail-firstline'>
                            <View className='book-detail-price'>
                                
                                    ￥{correspondValue.price}
                                    
                                {
                                    needFreight?
                                    <Text>(含1元运费)</Text>:
                                    <></>
                                }
                                
                            </View>
                            <View className='book-detail-bringUp'>
                                <Text>校内书屋自提</Text>
                                <AtSwitch
                                  onChange={changeBringUpState}
                                ></AtSwitch>
                            </View>
                    </View>
                    <View className='book-detail-title'>
                        {bookInfo.title}
                    </View>
                    <Text className='book-detail-new-degree-intro'>
                        <Text>{newDegreeInfo}</Text>
                    </Text>
                    <View className='book-detail-basic'>
                        <View className='book-detail-basic-info'>
                            作者:谢希仁
                        </View>
                        <View className='book-detail-basic-info'>
                            出版:{bookInfo.publish_by}
                        </View>
                        <View className='book-detail-basic-info'>
                            版次: {bookInfo.edition}
                        </View>
                    </View>
                    <View className='book-detail-new-degree-choose-btns'>
                            <AtTag
                              type='primary' 
                              active={tagCheckState[0]}
                              circle
                              onClick={changeTagState(0)}
                            >全新</AtTag>
                            <AtTag
                              type='primary' 
                              active={tagCheckState[1]}
                              circle
                              onClick={changeTagState(1)}
                            >九成新</AtTag>
                            <AtTag
                              type='primary' 
                              active={tagCheckState[2]}
                              circle
                              onClick={changeTagState(2)}
                            >七成新</AtTag>
                            <AtTag
                              type='primary' 
                              active={tagCheckState[3]}
                              circle
                              onClick={changeTagState(3)}
                            >五成新</AtTag>
                    </View>
                </View>
                {/* <View className='filling'/> */}
            </View>

            <View className='book-detail-toolbar-outer'>
                <View className='book-detail-toolbar'>
                    <View className='book-detail-gocart' onClick={gocart}>
                        <Image src='https://s4.ax1x.com/2022/02/14/HyWHi9.png' className='book-detail-gocart-icon'></Image>
                        <Text>购物车</Text>
                    </View>
                    <View className='book-detail-btn'>
                        立即购买
                    </View>
                </View>
            </View>
        </View>
    </View>
    );
}
