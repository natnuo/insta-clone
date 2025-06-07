import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { View, YStack } from "tamagui";
import ProfileRow from "~/src/components/ProfileRow";
import { supabase } from "~/src/lib/supabase";
import { UserDataSimple } from "~/src/lib/types";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const searchRef = useRef(search);

  const [users, setUsers] = useState<UserDataSimple[]>();

  const conductSearch = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .textSearch("username", `'${search.replaceAll("'", "")}'`);

      if (error) {
        Alert.alert(error.message);
        throw error;
      }

      if (searchRef.current === search) {
        // latest will show on pause checked
        setUsers(data);
      }
    } finally {
    }
  }, [search]);

  useEffect(() => {
    searchRef.current = search;

    if (search) conductSearch();
  }, [search]);

  return (
    <GestureHandlerRootView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack padding={24} gap={8} height={"100%"}>
          <TextInput
            value={search}
            onChangeText={(v) => setSearch(v)}
            placeholder="Find a user"
          ></TextInput>

          <FlatList
            data={users}
            keyExtractor={(user) => user.id}
            renderItem={({ item }) => <ProfileRow user={item}></ProfileRow>}
          ></FlatList>
        </YStack>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}
