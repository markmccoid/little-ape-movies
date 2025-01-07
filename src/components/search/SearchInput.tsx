import { SymbolView } from "expo-symbols";
import { MotiView } from "moti";
import React, { useState, ChangeEvent, useRef, forwardRef, useImperativeHandle } from "react";
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
        {inputValue !== "" && (
          <Pressable
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
            onPress={handleClear}
          >
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: inputValue ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "timing", duration: 500 }}
            >
              <SymbolView
                name="x.circle.fill"
                type="palette"
                colors={["white", "gray"]}
                size={17}
              />
            </MotiView>
          </Pressable>
        )}
      </View>
    );
  }
);

export default SearchInput;
