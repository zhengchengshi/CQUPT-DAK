import Taro from '@tarojs/taro';
import { useDispatch } from 'react-redux';
import { useEffect,useState } from 'react'
import { View,Image,Input,Text, Button } from '@tarojs/components'
import './index.scss'
import api from '../../service/api';
import { storageVerifyState } from './verifySlice'

export default function Login() {
    const [studentName,setStudentName] = useState('');
    const [studentNumber,setStudentNumber] = useState('');
    const [controlBtnState,setControlBtnState] = useState(false)
    const [verify,setVerify] = useState(false)
    const dispatch = useDispatch()
    const submit = async()=>{
        console.log(studentName)
        console.log(studentNumber)
        // 校验姓名学号
        const data = await api.get(`/login-center/check?student_id=${studentNumber}&&real_name=${studentName}`)
            .then(res=>{
                console.log(res)
                return res.data
            })
        if(data.status===10000){
            Taro.showToast({
                title:'认证成功',
                icon:'success',
                success:()=>{
                    setVerify(true)
                }
            })
        }
        else if(data.status===40000){
            Taro.showToast({
                title:data.info,
                icon:'error'
            })
        }
        
    }
    // 监听学号和姓名输入是否为空
    useEffect(()=>{
        if(studentNumber!==''&&studentName!==''){
            setControlBtnState(true)
        }
        else{
            setControlBtnState(false)
        }
    },[studentName,studentNumber])
    // 实时存储学号
    const studentNumberChange = (ipt)=>{
        setStudentNumber(ipt.detail.value)
    }
    // 实时存储姓名
    const studentNameChange = (ipt)=>{
        setStudentName(ipt.detail.value)
    }
    // 微信授权
    const authorization = async()=>{

        const codeObj = await Taro.login();
        console.log(codeObj.code)
        // 注册
        api.post(`/login-center/xcx/login?code=${codeObj.code}`,{
            student_id:studentNumber,
            real_name:studentName
        },'application/x-www-form-urlencoded')
            .then(res=>{
                Taro.showToast({
                    title:'登录成功',
                    icon:'success'
                })

                dispatch(storageVerifyState(false))
                // 存储token
                Taro.setStorageSync('access_token',res.data.data.access_token)
                Taro.setStorageSync('refresh_token',res.data.data.refresh_token)
            })
            .catch(err=>{
                throw err;
            })
    }
    // 回退到第一步
    const goBack = ()=>{
        setVerify(false)
        setControlBtnState(false)
    }
    // 直接登录
    const directLogin = async()=>{
        const codeObj = await Taro.login();
        console.log(codeObj.code)
        api.post(`/login-center/xcx/login?code=${codeObj.code}`,{},'application/x-www-form-urlencoded')
            .then(res=>{
                // 提示登录成功
                Taro.showToast({
                    title:'登录成功',
                    icon:'success'
                })
                // 登录成功，退出登录界面,进入首页
                dispatch(storageVerifyState(false))
                console.log(res.data.data.refresh_token)
                // 存储token
                Taro.setStorageSync('access_token',res.data.data.access_token)
                Taro.setStorageSync('refresh_token',res.data.data.refresh_token)
                
            })
            .catch(err=>{
                throw err;
            })
    }
    return (
        <View>
            <View className='login-outer'>
                {
                    verify?
                    <Image src='https://s1.ax1x.com/2022/04/18/LwNLJx.png' className='login-back-btn' onClick={goBack}></Image>
                    :
                    <></>
                }
                <View className='login-background'>
                    <Image src='https://s1.ax1x.com/2022/04/17/LUPhAf.png' className='login-logo'></Image>
                </View>
                {
                    verify?
                    <View onClick={authorization} className='login-authorization-btn'><Image src='https://s1.ax1x.com/2022/05/02/OPThNV.png' className='login-authorization-icon'></Image><Text>点击跳转微信授权登录</Text></View>
                    :
                    <View>
                        <Input
                          className='login-student-number'
                          placeholder='请输入你的学号'
                          type='number'
                          placeholderStyle='color: #A8A8A8;font-weight: 400;font-size: 14px;'
                          focus
                          onInput={studentNumberChange}

                        ></Input>
                        <Input
                          className='login-student-name'
                          placeholder='请输入你的真实姓名'
                          placeholderStyle='color: #A8A8A8;font-weight: 400;font-size: 14px;'
                          onInput={studentNameChange}
                          onConfirm={submit}
                        ></Input>
                        <View className='login-notice'>请放心，您的相关数据仅会被用作身份验证，我们将权力保护您的信息安全</View>
                        {
                            controlBtnState?
                            <Button className='login-btn login-btn-active' onClick={submit}>下一步</Button>
                            :
                            <Button className='login-btn' onClick={submit} disabled>下一步</Button>

                        }
                    </View>
                }
                {
                    verify?
                    <View className='login-step'>(2/2)</View>
                    :
                    <View className='login-step'>(1/2)</View>
                }
                <View className='login-direct'>已注册，直接<Text onClick={directLogin}>微信授权登录</Text></View>
            </View>
        </View>
    )
}
