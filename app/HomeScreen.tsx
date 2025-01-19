import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/HomeScreen.styles";

const taskCategories = ["Сьогодні", "Завтра", "Тиждень", "Місяць", "Пізніше"];

export default function HomeScreen() {
  const renderCategory = ({ item }: { item: string }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item}</Text>
      <FlatList
        data={[]} // Список завдань буде додано пізніше
        renderItem={({ item }) => <Text style={styles.task}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Немає завдань</Text>}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={taskCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
