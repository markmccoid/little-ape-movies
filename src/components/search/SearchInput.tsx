import { SymbolView } from "expo-symbols";
import React, { useState, ChangeEvent, useRef, forwardRef, useImperativeHandle } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  InputAccessoryView,
  Button,
} from "react-native";

interface SearchInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
  setIsFocused: (value: boolean) => void;
  initialValue: string | undefined;
}

const SearchInput = forwardRef(
  ({ placeholder = "Search...", onChange, setIsFocused, initialValue }: SearchInputProps, ref) => {
    const [inputValue, setInputValue] = useState(initialValue || "");
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      clear: () => {
        setInputValue("");
        onChange("");
      },
    }));
    React.useEffect(() => {
      setInputValue(initialValue || "");
    }, [initialValue]);
    const handleInputChange = (text: string) => {
      setInputValue(text);
      onChange(text);
    };

    const handleClear = () => {
      setInputValue("");
      onChange("");
      inputRef.current?.focus();
    };

    return (
      <View className="relative">
        <TextInput
          ref={inputRef}
          className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-2xl"
          value={inputValue}
          onChangeText={handleInputChange}
          style={{ fontSize: 18 }}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          inputAccessoryViewID="searchInputVID"
        />
        <Pressable
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
          onPress={handleClear}
          pointerEvents={inputValue !== "" ? "auto" : "none"}
        >
          {inputValue !== "" && (
            <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)}>
              <SymbolView
                name="x.circle.fill"
                type="palette"
                colors={["white", "gray"]}
                size={17}
              />
            </Animated.View>
          )}
        </Pressable>
      </View>
    );
  }
);

export default SearchInput;
