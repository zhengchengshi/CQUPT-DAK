import { View, Text,Input,Image } from '@tarojs/components'
import './community.scss'

export default function Community() {
  const gosearch = ()=>{

  }
    return (
    <View>
      <View className='community-outer'>
        <View className='community-header'>
            <View className='community-header-fixed'>
                <View className='community-header-content'>
                    <View className='communitybox'>
                        <Input placeholder='校内搜索' disabled></Input>
                        <View className='communitybox-btn' onClick={gosearch}>搜索</View>
                    </View>
                </View>
            </View>
        </View>
        <View className='community-content'>
          <View className='community-content-item'>
            <View className='community-content-item-header'>
              <View className='community-content-item-header-left'>
                <Image src='https://jdc.jd.com/img/200'></Image>
                <View className='community-content-item-header-left-postinfo'>
                  <Text>名字</Text>
                  <Text>13小时前</Text>
                </View>
              </View>
              <View className='community-content-item-header-btn'>
                <Image src='https://s1.ax1x.com/2022/04/12/LnViIx.png' className='community-content-item-header-icon'></Image>
              </View>
            </View>
            <View className='community-content-item-main'>
              <View className='community-content-item-main-text'>
                重庆什么时候可以下雪呀，来重庆之后还没看 过重邮的雪景，只在网上看到过图片，也不知 道今年能不能下呀,期待期待期待重庆什么时候 可以下雪呀，来重庆之后还没看.....
              </View>
              <View className='community-content-item-main-images'>
                <Image src='https://s1.ax1x.com/2022/03/08/bgfRXT.png' mode='aspectFill'></Image>
              </View>
              <View className='community-content-item-operation-bar-outer'>
                <View className='community-content-item-operation-bar'>
                  <Image src='https://s1.ax1x.com/2022/04/12/LnKJS0.png' className='community-content-item-operation-bar-like'></Image><Text>123</Text>
                  <Image src='https://s1.ax1x.com/2022/04/12/Ln1DHO.png' className='community-content-item-operation-bar-remark'></Image><Text>123</Text>
                  <Image src='https://s1.ax1x.com/2022/04/12/Ln1u3n.png' className='community-content-item-operation-bar-forward'></Image><Text>123</Text>
                </View>
              </View>
              <View className='community-content-item-comment'>
                <Text className='community-content-item-comment-username'>清香白莲素还真</Text>
                <Text className='community-content-item-comment-content'>:你喜欢好看的那就是没找到比他好看的，你喜欢对你好的那就是没找到比她对好的，其余以此推断</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

