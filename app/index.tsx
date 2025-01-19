import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import styles from "../styles/HomeScreen.styles";

const initialTasks = {
  Сьогодні: [{ id: "1", text: "Приклад завдання на сьогодні" }],
  Завтра: [],
  Тиждень: [],
  Місяць: [],
  Пізніше: [],
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Сьогодні");

  const renderTask = ({ item }: { item: { id: string; text: string } }) => (
    <View style={styles.task}>
      <Text>{item.text}</Text>
    </View>
  );

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks((prevTasks) => ({
      ...prevTasks,
      [selectedCategory]: [
        ...prevTasks[selectedCategory],
        { id: Date.now().toString(), text: newTaskText },
      ],
    }));
    setNewTaskText("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(tasks)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item}</Text>
            <FlatList
              data={tasks[item]}
              renderItem={renderTask}
              keyExtractor={(task) => task.id}
              style={styles.taskList}
            />
          </View>
        )}
      />

      {/* Модальне вікно для додавання завдань */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Додати завдання</Text>
            <TextInput
              placeholder="Опис завдання"
              style={styles.input}
              value={newTaskText}
              onChangeText={setNewTaskText}
            />
            <View style={styles.categoryContainer}>
              {Object.keys(tasks).map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
              <Text style={styles.addTaskButtonText}>Додати</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Плаваюча кнопка додавання */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
