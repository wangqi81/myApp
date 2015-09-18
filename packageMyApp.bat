cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore .\platforms\android\build\outputs\apk\android-release-unsigned.apk alias_name
C:\Users\wanwei\android-sdk-windows\build-tools\23.0.1\zipalign -v 4 .\platforms\android\build\outputs\apk\android-release-unsigned.apk MyApp.apk
pause
