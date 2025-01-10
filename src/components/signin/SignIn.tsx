import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Touchable,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import showConfirmationPrompt from "@/components/common/showConfirmationPrompt";

// import Colors from '@/constants/Colors';
// import { defaultStyles } from '@/constants/Styles';
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/providers/AuthProvider";
import { useCustomTheme } from "@/lib/colorThemes";
import { DeleteIcon, EditIcon } from "../common/Icons";
import { SymbolView } from "expo-symbols";
import { Text } from "@/components/ui/text";
import { User } from "@/store/dataAccess/localStorage-users";

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
  const { colors } = useCustomTheme();
  const [loading, setLoading] = useState(false);
  const { initialized, currentUser, onLogin, allUsers, onRegister, onRemoveUser, onUpdateUser } =
    useAuth();

  const handleUpdateUser = (user: User) => {
    Alert.prompt(
      "Enter New User Name",
      "Edit User Name",
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
              try {
                onUpdateUser(user.id, name);
              } catch (e) {
                Alert.alert("Error", "Error Updating User");
              }
            }
          },
        },
      ],
      "plain-text",
      user.name,
      "default"
    );
  };
  const handleLogin = (user: User) => {
    try {
      setLoading(true);
      onLogin(user);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (user: User) => {
    const result = await showConfirmationPrompt(
      "Delete User?",
      "This will delete all movies associated with User and CANNOT be undone."
    );
    if (!result) return;

    onRemoveUser(user);
  };

  const handleRegisterUser = (username: string) => {
    onRegister(username);
  };

  // While we are seeing if there is a saved user to auto login
  // make sure to not show the login screen
  // Also if there IS a user and we are initialize (but haven't moved to auth route)
  // still don't show the login screen.  This keeps the login screen from flashing.
  if (!initialized || (currentUser && initialized)) {
    return null; // <View>{/* <Text className="font-extrabold text-4xl"></Text> */}</View>;
  }
  return (
    <View className="flex-1 px-10 pt-10 bg-primary">
      <LinearGradient
        colors={[colors.secondary, colors.primary]}
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
        source={require("../../../assets/images/papericon.png")}
        // source={require("../../../assets/images/little-ape-movie-image.jpg")}
      />
      {allUsers && (
        <ScrollView
          className="max-h-[100] border mb-[20] bg-card rounded-lg"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {allUsers &&
            allUsers?.length > 0 &&
            allUsers.map((user) => {
              return (
                <View key={user.id} className="bg-card">
                  <View className="flex-row justify-between items-center" key={user.id}>
                    <TouchableOpacity
                      className="flex-1 px-3 py-2 mr-2"
                      onPress={() => handleLogin(user)}
                    >
                      <Text className="">{user.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleUpdateUser(user)}>
                      <View className="border-l bg-card-inverted p-2">
                        <EditIcon size={15} color={colors.primary} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRemoveUser(user)}>
                      <View className="border-l bg-card-inverted p-2">
                        <DeleteIcon size={15} color={colors.deleteRed} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="border-b border-border" />
                </View>
              );
            })}
        </ScrollView>
      )}

      <Pressable
        className="flex-col items-center"
        onPress={() => handleNewUserPrompt(handleRegisterUser)}
      >
        {!allUsers && (
          <View className="mt-10">
            <SymbolView name="person.badge.plus" tintColor="#000" type="palette" size={35} />
          </View>
        )}
        <Text className="text-white text-2xl">Create New User</Text>
      </Pressable>
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
