import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";

export default function TeamDetail() {
  const pages = Taro.getCurrentPages();
  const current = pages[pages.length - 1];
  const eventChannel = current.getOpenerEventChannel();
  const [teamInfo, setTeamInfo] = useState({
    team_name: "",
    images: [],
    description: "",
    information: {},
  });
  const saveImage = (path) => {
    Taro.saveImageToPhotosAlbum({
      filePath: path,
      success: function (res) {
        console.log(res);
      },
    });
  };
  const copyContentFn = (item) => {
    return () => {
      console.log(teamInfo);
      let copyContent;
      switch (item) {
        case "qq":
          copyContent = teamInfo.information.qq_number;
          break;
        case "wx":
          copyContent = teamInfo.information.vx_number;
          break;
        case "others":
          copyContent = teamInfo.information.other_number;
          break;
        default:
          break;
      }
      Taro.setClipboardData({
        data: copyContent,
      });
    };
  };
  useEffect(() => {
    eventChannel.on("teamInfo", (res) => {
      console.log(res.item);
      setTeamInfo(res.item);
    });
  }, []);
  return (
    <View>
      <View className="teamDetail-outer">
        <View className="teamDetail-header">
          <View className="teamDetail-header-left">
            <Text className="teamDetail-header-title">
              {teamInfo.team_name}
            </Text>
          </View>
        </View>
        <View className="teamDetail-content">
          <View className="teamDetail-maincontent">
            <View className="teamDetail-maincontent-allimgs">
              {teamInfo.images.map((_, index) => {
                return (
                  <Image
                    src="https://s1.ax1x.com/2022/04/16/LJ8Kc6.png"
                    className="teamDetail-maincontent-img"
                    key={index}
                  ></Image>
                );
              })}
            </View>
            <View className="teamDetail-maincontent-description">
              {teamInfo.description}
            </View>
          </View>
          <View className="teamDetail-organization-Contact-details">
            <View
              className="teamDetail-organization-Contact-details-info"
              onClick={copyContentFn("qq")}
            >
              <View className="teamDetail-organization-Contact-details-info-left">
                QQ
              </View>
              <View className="teamDetail-organization-Contact-details-info-right">
                {teamInfo.information.qq_number}
                <Image src="https://s1.ax1x.com/2022/04/16/LYMh1f.png"></Image>
              </View>
            </View>
            <View
              className="teamDetail-organization-Contact-details-info"
              onClick={copyContentFn("wx")}
            >
              <View className="teamDetail-organization-Contact-details-info-left">
                微信
              </View>
              <View className="teamDetail-organization-Contact-details-info-right">
                {teamInfo.information.vx_number}
                <Image src="https://s1.ax1x.com/2022/04/16/LYMh1f.png"></Image>
              </View>
            </View>
            <View className="teamDetail-organization-Contact-details-info">
              <View className="teamDetail-organization-Contact-details-info-left"></View>
              <View
                className="teamDetail-organization-Contact-details-info-right"
                // onClick={saveImage(teamInfo.information.qr_number)}
              >
                点击保存微信群二维码到相册
                <Image src="https://pic.baike.soso.com/p/20090702/20090702093335-12585910.jpg"></Image>
              </View>
            </View>

            <View
              className="teamDetail-organization-Contact-details-info"
              onClick={copyContentFn("others")}
            >
              <View className="teamDetail-organization-Contact-details-info-left">
                YY
              </View>
              <View className="teamDetail-organization-Contact-details-info-right">
                {teamInfo.information.other_number}
                <Image src="https://s1.ax1x.com/2022/04/16/LYMh1f.png"></Image>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
