import React from "react";
import { useRouter } from "expo-router";
import { Button, Form, Host, HStack, Image, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { buttonStyle, font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useColorScheme } from "@/lib/useColorScheme";

const rowLabel = [
  foregroundStyle({ type: "hierarchical", style: "primary" }),
  font({ size: 17 }),
];

const SettingsContainer: React.FC = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const openSavedFilters = () => {
    router.push({ pathname: "/(auth)/(drawer)/settings/savedfiltersroute" });
  };

  const openQuickSorts = () => {
    router.push({ pathname: "/(auth)/(drawer)/settings/quicksortroute" });
  };

  return (
    <Host
      style={{ flex: 1 }}
      useViewportSizeMeasurement
      colorScheme={colorScheme === "light" ? "light" : "dark"}
    >
      <Form>
        <Section>
          <Button onPress={openSavedFilters} modifiers={[buttonStyle("plain")]}>
            <HStack>
              <Text modifiers={rowLabel}>Saved Filters</Text>
              <Spacer />
              <Image systemName="chevron.right" size={14} color="secondary" />
            </HStack>
          </Button>
          <Button onPress={openQuickSorts} modifiers={[buttonStyle("plain")]}>
            <HStack>
              <Text modifiers={rowLabel}>Quick Sort</Text>
              <Spacer />
              <Image systemName="chevron.right" size={14} color="secondary" />
            </HStack>
          </Button>
        </Section>
      </Form>
    </Host>
  );
};

export default SettingsContainer;
