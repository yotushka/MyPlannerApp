import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import styles from "./styles";

export default function HomeScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<{ id: string; text: string; section: string }[]>([]);
  const sections = ["Сьогодні", "Завтра", "Тиждень", "Місяць", "Пізніше"];

  const addTask = (section: string) => {
    if (task.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now().toString(), text: task, section },
      ]);
      setTask("");
    }
  };

  const renderTasksBySection = (section: string) => {
    const filteredTasks = tasks.filter((t) => t.section === section);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{section}</Text>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t) => (
            <View key={t.id} style={styles.taskCard}>
              <Text>{t.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>Немає завдань</Text>
        )}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Додати завдання до ${section}`}
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity onPress={() => addTask(section)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Головне меню</Text>
      <FlatList
        data={sections}
        keyExtractor={(item) => item}
        renderItem={({ item }) => renderTasksBySection(item)}
      />
    </View>
  );
}
