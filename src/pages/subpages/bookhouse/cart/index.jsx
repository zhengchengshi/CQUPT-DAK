import { AtInputNumber } from 'taro-ui'
import { useEffect, useState } from 'react'
import { View,Text,Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import api from '../../../../service/api'
import './index.scss'

export default function Cart() {
    const [allCartBooks,setAllCartBooks] = useState([])
    const [checkStateArr,setCheckStateArr] = useState([])
    const [goodsNum,setGoodsNum] = useState([])
    const [bringupInfo,setBringupInfo] = useState([])
    const [oldDegree,setOldDegree] = useState([])
    const [allPrice,setallPrice] = useState()
    const [cacheBookInfo,setCacheBookInfo] = useState([])
    // 全选
    const pickall = ()=>{
        let checkallArr = []

        if(checkStateArr.indexOf(false)===-1){
            checkallArr = Array(allCartBooks.length).fill(false)
        }
        else{
            checkallArr = Array(allCartBooks.length).fill(true)
        }
        // 数组中包含true就全选
        // if(checkStateArr.indexOf(true)!==-1){
        // }
        setCheckStateArr(checkallArr)
    }
    // 修改勾选状态
    const check = (index)=>{
        return(()=>{
            console.log(index)
            checkStateArr[index] = !checkStateArr[index]
            console.log(checkStateArr)
            setCheckStateArr([...checkStateArr])
        })
    }
    const setNum = (index)=>{
        return((value)=>{
            if(value===0){
                checkStateArr[index] = false
                setCheckStateArr([...checkStateArr])
            }
            else{
                checkStateArr[index] = true
                setCheckStateArr([...checkStateArr])
            }
            goodsNum[index]=value
    
            setGoodsNum([...goodsNum])
        })
    }
    const deleteItem = ()=>{
        console.log(checkStateArr)
        const reserveElemArr = []
        checkStateArr.map((item,index)=>{
            if(item!==true){
                reserveElemArr.push(allCartBooks[index])
            }
            else{
                api.delete('/book/cart',{book_id:allCartBooks[index].book_id},"application/json")
                    .then(res=>{
                        console.log(res)
                    })
                console.log(allCartBooks[index].book_id)
            }
        })
        setAllCartBooks([...reserveElemArr])
        // 删除后初始化勾选状态
        const initCheckStateArr = Array(allCartBooks.length).fill(false)
        setCheckStateArr([...initCheckStateArr])
        
    }
    // 选择新旧程度
    const chooseInfo = (info,index)=>{
        return(()=>{
            console.log(info)
            if(info==='old-degree')
            {
                Taro.showActionSheet({
                    itemList:[
                        '全新',
                        '九成新',
                        '七成新',
                        '五成新',
                    ],
                    success:(res)=>{
                        switch (res.tapIndex) {
                            case 0:
                                oldDegree[index] = '全新'
                                setOldDegree([...oldDegree])    
                                break;
                            case 1:
                                oldDegree[index] = '九成新'
                                setOldDegree([...oldDegree])
                                break;
                            case 2:
                                oldDegree[index] = '七成新'
                                setOldDegree([...oldDegree])
                                break;
                            case 3:
                                oldDegree[index] = '五成新'
                                setOldDegree([...oldDegree])
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
            else{
                Taro.showActionSheet({
                    itemList:[
                        '送货上门',
                        '自提'
                    ],
                    success:(res)=>{
                        switch (res.tapIndex) {
                            case 0:
                                bringupInfo[index] = '送货上门'
                                setBringupInfo([...bringupInfo])    
                                break;
                            case 1:
                                bringupInfo[index] = '自提'
                                setBringupInfo([...bringupInfo])
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
        })
    }
    // 选择是否自提
    
    const goDetail = (index)=>{
        return(()=>{
            Taro.navigateTo({
                url:'../../bookhouse/book-detail/index',
                success:(res)=>{
                    console.log(allCartBooks)
                    res.eventChannel.emit('bookItem',{item:cacheBookInfo[index]})
                }
            })
        })
    }

    useEffect(()=>{
        (async ()=>{
            const cartBooks = await api.get('/book/cart')
                .then(res=>{
                    setCacheBookInfo(res.data.data)
                    setAllCartBooks(res.data.data)
                    console.log(res.data.data)
                    return res.data.data
                })
            // 初始化默认勾选
            const checkallArr = Array(cartBooks.length).fill(true)
            // 初始化商品数
            const initGoodNumArr = Array(cartBooks.length).fill(1)
            // 初始化控制是否显示的类名
            
            setCheckStateArr(checkallArr)
            setGoodsNum(initGoodNumArr)
            const allFilterBooks = []
            cartBooks.map((bookInfo,index)=>{
                const filterBookInfo = {
                    title:bookInfo.title,
                    wear:bookInfo.wear,
                    transport:bookInfo.transport,
                    book_id:bookInfo.book_id
                }
                console.log(bookInfo)
                bookInfo.value.map(item=>{
                    console.log(item.wear)
                    if(bookInfo.wear===item.wear){
                        filterBookInfo.price = item.price
                        filterBookInfo.images = item.images
                        console.log(filterBookInfo)

                    }
                })
                switch (bookInfo.wear) {
                    case 100:
                        oldDegree[index] = '全新'
                        setOldDegree([...oldDegree])    
                        break;
                    case 90:
                        oldDegree[index] = '九成新'
                        setOldDegree([...oldDegree])
                        break;
                    case 70:
                        oldDegree[index] = '七成新'
                        setOldDegree([...oldDegree])
                        break;
                    case 50:
                        oldDegree[index] = '五成新'
                        setOldDegree([...oldDegree])
                        break;
                    default:
                        break;
                }
                switch (bookInfo.transport) {
                    case "1":
                        bringupInfo[index] = '自提'
                        setBringupInfo([...bringupInfo])    
                        break;
                    case "2":
                        bringupInfo[index] = '送货上门'
                        setBringupInfo([...bringupInfo])
                        break;
                    default:
                        break;
                }
                console.log(filterBookInfo)
                allFilterBooks.push(filterBookInfo)
            })
            // 初始化总价
            let price = 0
            allFilterBooks.map((item,index)=>{
                if(item&&allFilterBooks[index].price){
                    price += allFilterBooks[index].price
                }
            })
            console.log(price)
            setallPrice(price)
            // 展示购物车内容
            setAllCartBooks([...allFilterBooks])

        })()
    },[])
    useEffect(()=>{
        let price = 0
        checkStateArr.map((item,index)=>{
            if(item&&allCartBooks[index].price){
                price += allCartBooks[index].price * goodsNum[index]
                console.log(goodsNum[index])
            }
        })
        setallPrice(price)
    },[checkStateArr,goodsNum])
    return (
        <View>
            <View className='cart-outer'>
                <View className='cart-header-outer'>
                    <View className='cart-header' >
                        <View className='cart-header-title'>
                            购物车
                        </View>
                        <View className='cart-header-pickall-btn-outer' onClick={pickall}>
                            <View className='cart-header-pickall-btn'>
                                <Text>全选</Text>
                                {
                                    checkStateArr.indexOf(false)===-1?
                                    <Image src='https://s4.ax1x.com/2022/02/15/H2EaJf.png' className='cart-header-pickall-img'></Image>
                                    :
                                    <Image src='https://s4.ax1x.com/2022/02/15/HgtClj.png' className='cart-header-pickall-img'></Image>
                                }
                            </View>
                        </View>
                    </View>
                </View>
                <View className='cart-content'>
                    {
                        allCartBooks.map((item,index)=>{
                            return (
                                <View className='cart-item' onClick={goDetail(index)} key={index}>
                                    <View className='cart-delete-btn'>
                                        {
                                            checkStateArr[index]?
                                            <Image src='https://s4.ax1x.com/2022/02/15/H2EaJf.png' className='cart-delete-img' onClick={check(index)}></Image>
                                            :
                                            <Image src='https://s4.ax1x.com/2022/02/11/HaS939.png' className='cart-delete-img' onClick={check(index)}></Image>
                                        }
                                            
                                    </View>
                                    <View className='cart-item-img-outer'>
                                        {
                                            item.images?
                                            <Image src={item.images[0].medium} className='cart-item-img' mode='aspectFill'></Image>
                                            :
                                            <></>
                                        }
                                    </View>
                                    <View className='cart-item-right'>
                                        <View className='cart-item-title'>
                                            {item.title}
                                        </View>
                                        <View className='cart-item-secondline'>
                                            <View className='cart-item-price'>
                                                ￥{item.price} <Text>(含1元运费)</Text>
                                            </View>
                                            <View className='cart-item-goodnum'>
                                                <AtInputNumber
                                                  onChange={setNum(index)}
                                                  value={goodsNum[index]}
                                                ></AtInputNumber>
                                            </View>
                                        </View>
                                        <View className='cart-item-thirdline'>
                                            <View className='cart-item-operateview' onClick={chooseInfo('old-degree',index)}>
                                                <Text>{oldDegree[index]}</Text>
                                                <View className='cart-item-arrows'>
                                                    <Image src='https://s4.ax1x.com/2022/02/15/H2FUiT.png'></Image>
                                                    <Image src='https://s4.ax1x.com/2022/02/15/H2iuv9.png'></Image>
                                                </View>
                                            </View>
                                            <View className='cart-item-operateview' onClick={chooseInfo('bringup',index)}>
                                                <Text>{bringupInfo[index]}</Text>
                                                <View className='cart-item-arrows'>
                                                    <Image src='https://s4.ax1x.com/2022/02/15/H2FUiT.png'></Image>
                                                    <Image src='https://s4.ax1x.com/2022/02/15/H2iuv9.png'></Image>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    
                    
                </View>
                <View className='cart-price'>
                    <View className='delete-btn' onClick={deleteItem}>
                        <Text>删除</Text>
                    </View>
                    <View className='cart-price-total'>
                        合计:<Text>￥{allPrice}</Text>
                    </View>
                    <View className='cart-price-btn'>
                        <Text>结算</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}
