# Running on WSL2

The script at `powershell-scripts/forward-wsl-ports.ps1` should be run as described here:
https://medium.com/weavik/react-native-expo-on-wsl2-aff04b1639f8

Then `REACT_NATIVE_PACKAGER_HOSTNAME` can be set using:

```
export REACT_NATIVE_PACKAGER_HOSTNAME=$(netsh.exe interface ip show address "WiFi" | grep 'IP Address' | sed -r 's/^.*IP Address:\W*//')
```

And then `expo start` should run the Metro server that can be accessed by connected devices.