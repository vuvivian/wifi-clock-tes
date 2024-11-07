import subprocess
import json

def get_wifi_networks():
    try:
        # 调用 airport 命令，列出可用 Wi-Fi 网络
        result = subprocess.run(
            ["/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport", "-s"],
            capture_output=True, text=True
        )
        
        networks = []
        for line in result.stdout.splitlines()[1:]:  # 跳过第一行标题
            parts = line.split()
            if len(parts) >= 2:
                ssid = " ".join(parts[:-1])  # Wi-Fi 名称可能包含空格
                signal_strength = parts[-1]
                networks.append({"SSID": ssid, "Signal": signal_strength})
        
        # 输出 JSON 格式的 Wi-Fi 网络信息
        print(json.dumps(networks))

    except Exception as e:
        print(f"Error: {e}")

get_wifi_networks()
