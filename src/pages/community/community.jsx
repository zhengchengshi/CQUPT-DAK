import { useEffect,useState } from 'react'
import { Component } from 'react'
import Taro,{ useDidShow } from '@tarojs/taro';
import { View, Text,Input,Image, Button } from '@tarojs/components'
import './community.scss'
import api from '../../service/api';
import { now } from '@tarojs/runtime';

export default function Community () {
  
  
  const [noteList, setNoteList] = useState([]);
  const [isShadow, setIsShadow] = useState(false);
  const [isSearch, setIsSearch] = useState(false)
  const [isLike, setIsLike] = useState([]);
  const [comment, setComment] = useState(123);
  const [isShare, setIsShare] = useState(false); 
  const [share, setShare] = useState(123);

//页面初始化
useDidShow(async()=>{
  const res = await api.get('/market/search',{keyword:"",page:'1',seed:''}).catch(err=>Promise.reject(err))
      if(res.statusCode!==500){
        console.log('useDisShow',res.data.data)
        setNoteList([...res.data.data])
        console.log('notelist_data', noteList)
    }  
})
    
  //添加喜欢（再次点击则取消喜欢
  const addLike = (index)=>{ 
    let temA = isLike;
    let i = temA.indexOf(index)
    if(i > -1)
    {
      noteList[index].price = parseInt(noteList[index].price) - 1
      temA.splice(i, 1)
      setIsLike([...temA])
    }
    else{
      noteList[index].price = parseInt(noteList[index].price) + 1
      temA.push(index)
      setIsLike([...temA])
    }  
  }
  //评论
  const addComment = (e)=>{
    console.log('comment----')
  }
  //分享
  const addShare = (e)=>{
    if(!isShare)
    {
      setShare(share + 1)
    }
    setIsShare(true)
    // console.log(share)
  }
        

  //点击header跳转搜索页面
  const gosearch = ()=>{
    // setIsSearch(!isSearch)
    
    Taro.navigateTo({url:'../subpages/communitySubpage/communitySearch/index'})
   
  }
  //跳转至社区详情
  const goDetail = (item)=>{
    return(()=>{
      Taro.navigateTo({
        url:'../subpages/communitySubpage/communityDetail/index',
        success:(res)=>{
          res.eventChannel.emit('communityId', { item })
        }
      })
    })
  }
  //发布
  const communityIssue = ()=>{
    Taro.navigateTo({url:'../subpages/communitySubpage/communityIssue/index'})
  }
  //。。。按钮
  const getMore = (e)=>{
    //设置遮罩
    setIsShadow(!isShadow)  
    // console.log('isShadow', isShadow)  
  } 
  //。。。按钮的取消事件
  const cancel = (e)=>{
    setIsShadow(!isShadow)  
    // console.log('isShadow', isShadow) 
  }
  
    return (
    <View className={isShadow||isSearch?'flowLock':''}>
      <View className={isShadow ? 'shadow' : 'shadow_hide'} >
        <View className='moreButton'>
          <Button>屏蔽话题</Button>
          <Button>举报</Button>
          <Button onClick={cancel}>取消</Button>
        </View>
      </View>
      <View className={isSearch ? 'searchShadow' : 'searchShadow_hide'}></View>

      <View className='community-outer'>        
      <View className='issure' onClick={communityIssue}>        
        <Image src={require('../../assets/images/btn_issue.svg')}></Image>
      </View>
        <View className='community-header'>
            <View className='community-header-fixed' onClick={gosearch}>
                <View className='community-header-content'>
                    <View className='communitybox'>
                        {/* <Input placeholder='校内搜索' disabled></Input> */}
                        <Input placeholder='校内搜索'></Input>
                        <View className='communitybox-btn'>搜索</View>
                    </View>
                </View>
            </View>
        </View>
        <View className='community-content'>
          {
            noteList?.map((item,index)=>{
              return(
                <View className='community-content-item' key={index} onClick={goDetail(item)}>
            <View className='community-content-item-header'>
              <View className='community-content-item-header-left'>
                <Image src={item.images[0].tiny}></Image>
                <View className='community-content-item-header-left-postinfo'>
                  <Text>{item.owner.realName}</Text>
                  <Text>{index}小时前</Text>
                </View>
              </View>
              <View className='community-content-item-header-btn' onClick={e => e.stopPropagation(getMore(index))}>
                <Image src='https://s1.ax1x.com/2022/04/12/LnViIx.png' className='community-content-item-header-icon'></Image>
              </View>
            </View>
            <View className='community-content-item-main'>
              <View className='community-content-item-main-text'>
              {item.description}{item.description}{item.description}{item.description}{item.description}
              </View>
              <View className='community-content-item-main-images'>
                <Image src={item.images[0].medium} mode='aspectFill'></Image>
              </View>
              <View className='community-content-item-operation-bar-outer'>
                <View className='community-content-item-operation-bar'>
                  <Image onClick={e => e.stopPropagation(addLike(index))}  src={isLike.some((i)=>i==index) ?(require('../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='community-content-item-operation-bar-like'></Image><Text>{item.price}</Text>                  
                  <Image onClick={e => e.stopPropagation(addComment(index))} src='https://s1.ax1x.com/2022/04/12/Ln1DHO.png' className='community-content-item-operation-bar-remark'></Image><Text>{index}</Text>                  
                  <Image onClick={e => e.stopPropagation(addShare(index))} src={isShare ?(require('../../assets/images/btn_share(1).svg')) : 'https://s1.ax1x.com/2022/04/12/Ln1u3n.png'} className='community-content-item-operation-bar-forward'></Image><Text>{share}</Text>           
                </View>
              </View>
              <View className='community-content-item-comment'>
                <Text className='community-content-item-comment-username'>清香白莲素还真</Text>
                <Text className='community-content-item-comment-content'>:你喜欢好看的那就是没找到比他好看的，你喜欢对你好的那就是没找到比她对好的，其余以此推断</Text>
              </View>
            </View>
          </View>
                
              )
            })
          }
          
        </View>
      </View>
    </View>
  );
}

