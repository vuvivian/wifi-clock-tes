import CoreWLAN
import json
import re

def get_wifi_list():
    wifiList = []
    # print(f"{'SSID' : >32} {'BSSID' : <17} RSSI CHANNEL HT CC SECURITY")

    # 获取 Wi-Fi 接口
    wifi_interface = CoreWLAN.CWInterface.interface()
    # 扫描附近的 Wi-Fi 网络 传入 None 作为参数表示不指定网络名称，而是扫描所有可用网络
    networks, error = wifi_interface.scanForNetworksWithName_error_(None, None)

    if error:
        print("Error scanning networks:", error)
        exit()

    for i in networks:
        # 检测 HT 支持：检查网络是否支持 HT（High Throughput），即 802.11n 或更高。fastestSupportedPHYMode() 返回物理层模式，kCWPHYMode11n 是 CoreWLAN 中的常量，表示 802.11n 支持。如果满足条件，则返回 'Y'，否则返回 'N'。
        supportsHT = 'Y' if i.fastestSupportedPHYMode() >= CoreWLAN.kCWPHYMode11n else 'N'
        # 获取安全类型
        security = re.search('security=(.*?),', str(i)).group(1)

        wifiList.append({
            "ssid": i.ssid(),
            "bssid": i.bssid(),
            "rssi": i.rssiValue(),
            "channel": i.channel(),
            "ht": supportsHT,
            "cc": i.countryCode(),
            "security": security
        })

    print (json.dumps(wifiList))
        # print(f"
        #     {i.ssid() : >32} 
        #     {i.bssid() or '' : <17} 
        #     {i.rssiValue() : <4} 
        #     {i.channel() : <6}  
        #     {supportsHT : <2} 
        #     {i.countryCode() or '--' : <2} 
        #     {security}")

get_wifi_list()