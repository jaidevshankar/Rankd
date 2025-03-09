import * as React from 'react';
import { View, Text, Button } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// android 581952459071-5qu3okl64f4a5sc0lhlpsbvofi4buf47.apps.googleusercontent.com
// ios 581952459071-s31vnkaf7ue14uhqghdotsp8e3hchqki.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "581952459071-5qu3okl64f4a5sc0lhlpsbvofi4buf47.apps.googleusercontent.com",
    iosClientId: "581952459071-s31vnkaf7ue14uhqghdotsp8e3hchqki.apps.googleusercontent.com"
  });
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home</Text>
      <Text>Home</Text>
      <Text>Home</Text>
      <Text>Home</Text>
      <Text>Home</Text>
      <Text>Home</Text>
      <Text>Home</Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()}/>
    </View>
  );
}