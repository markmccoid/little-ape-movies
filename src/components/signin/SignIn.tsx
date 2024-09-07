import {
  StyleSheet,
  Image,
  View,
  TextInput,
  Button,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Touchable,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";

// import Colors from '@/constants/Colors';
// import { defaultStyles } from '@/constants/Styles';
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/store/AuthProvider";
import { addNewUser, removeItem } from "@/store/localStorage-users";

const handleNewUserPrompt = (registerUser: (user: string) => void) => {
  Alert.prompt(
    "Enter Name for New User",
    "This name will identify the userTest",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: (name) => {
          if (name) {
            console.log("NAME", name);
            registerUser(name);
          }
        },
      },
    ],
    "plain-text",
    "",
    "default"
  );
};

const SignIn = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { initialized, currentUser, onLogin, allUsers, onRegister, onRemoveUser } = useAuth();

  const handleLogin = (user: string) => {
    try {
      setLoading(true);
      onLogin(user);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = (user: string) => {
    onRegister(user);
  };

  // While we are seeing if there is a saved user to auto login
  // make sure to not show the login screen
  // Also if there IS a user and we are initialize (but haven't moved to auth route)
  // still don't show the login screen.  This keeps the login screen from flashing.
  if (!initialized || (currentUser && initialized)) {
    return (
      <View>
        <Text className="font-extrabold text-4xl">LOADING</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 px-10 pt-10 bg-secondary">
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Image
        style={styles.logo}
        className="rounded-[100] border"
        source={require("../../../assets/images/little-ape-movie-image.jpg")}
      />
      <ScrollView className="max-h-[100] border mb-[20]" contentContainerStyle={{ flexGrow: 1 }}>
        {allUsers &&
          allUsers?.length > 0 &&
          allUsers.map((user) => {
            return (
              <View key={user}>
                <View className="flex-row justify-between items-center" key={user}>
                  <TouchableOpacity
                    className="flex-1 px-3 py-2 mr-2"
                    onPress={() => handleLogin(user)}
                  >
                    <Text className="">{user}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onRemoveUser(user)}>
                    <Text>X</Text>
                  </TouchableOpacity>
                </View>
                <View className="border-b" />
              </View>
            );
          })}
      </ScrollView>

      <Button
        title="Create New User"
        color={"#fff"}
        onPress={() => handleNewUserPrompt(handleRegisterUser)}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#8494f7",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
