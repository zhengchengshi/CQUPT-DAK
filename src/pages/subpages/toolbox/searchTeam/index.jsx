import { useEffect, useRef, useState } from "react";
import { View, Image, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import api from "../../../../service/api";
import "./index.scss";

export default function SearchTeam() {
  const [controlMaskPresent, setControlMaskPresent] = useState(false);
  const iptvalue = useRef();
  const [allTeams, setAllTeams] = useState([]);
  const arouseMask = () => {
    setControlMaskPresent(true);
  };
  const cancelMask = () => {
    setControlMaskPresent(false);
  };
  const gosearch = async () => {
    const res = await api
      .post(
        `/team/search?keyword=${iptvalue.current.props.value}`,
        { keyword: `${iptvalue.current.props.value}` },
        "application/x-www-form-urlencoded"
      )
      .then((res) => {
        console.log(res);
        return res.data.data;
      });
    console.log(res);
    if (res) setAllTeams([...res]);
    console.log(iptvalue.current.props.value);
  };
  const addTeam = () => {
    Taro.navigateTo({
      url: "./addTeam/index",
    });
  };
  const goDetail = (item) => {
    return () => {
      Taro.navigateTo({
        url: "./teamDetail/index",
        success: (res) => {
          res.eventChannel.emit("teamInfo", { item });
        },
      });
    };
  };
  useEffect(() => {
    (async () => {
      const res = await api
        .post(
          `/team/search?keyword=&pageNum=1`,
          { keyword: "" },
          "application/x-www-form-urlencoded"
        )
        .then((val) => {
          console.log(val);
          return val.data.data;
        });
      if (res) setAllTeams([...res]);
      console.log(res);
    })();
  }, []);

  return (
    <View>
      <View className="toolbox-searchteam-outer">
        <View className="toolbox-searchteam-header">
          <View className="toolbox-searchteam-header-fixed">
            <View className="toolbox-searchteam-header-content">
              <View className="toolbox-searchteam-searchbox">
                <Input
                  placeholder="请输入想要查找的团队或组织关键字"
                  onFocus={arouseMask}
                  onBlur={cancelMask}
                  ref={iptvalue}
                  onConfirm={gosearch}
                ></Input>
                <View
                  className="toolbox-searchteam-searchbox-btn"
                  onClick={gosearch}
                >
                  搜索
                </View>
              </View>
            </View>
          </View>
        </View>
        {controlMaskPresent ? (
          <View className="toolbox-searchteam-content-mask"></View>
        ) : (
          <></>
        )}
        <View className="toolbox-searchteam-content">
          {allTeams.map((item, index) => {
            return (
              <View
                className="toolbox-searchteam-content-item"
                onClick={goDetail(item)}
                key={index}
              >
                <View className="toolbox-searchteam-content-item-left">
                  <Image
                  
                    src={
                      item.images.length !== 0
                        ? item.images[0].medium
                        : "https://s1.ax1x.com/2022/04/16/LJ8Kc6.png"
                    }
                    mode="aspectFill"
                  ></Image>
                </View>
                <View className="toolbox-searchteam-content-item-right">
                  <View className="toolbox-searchteam-content-item-teamname">
                    {item.team_name}
                  </View>
                  <View className="toolbox-searchteam-content-item-teaminfo">
                    {item.description}
                  </View>
                </View>
              </View>
            );
          })}

          <Image
            src="https://s1.ax1x.com/2022/03/08/b23axf.png"
            className="toolbox-searchteam-content-createteam-btn"
            onClick={addTeam}
          ></Image>
        </View>
      </View>
    </View>
  );
}
