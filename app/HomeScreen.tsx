import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/HomeScreen.styles";

const taskCategories = ["Сьогодні", "Завтра", "Тиждень", "Місяць", "Пізніше"];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<
    { id: string; task: string; date: string; completed: boolean }[]
  >([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [previousDate, setPreviousDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);

  const generateUniqueId = () => `${Date.now()}-${Math.random()}`;

  const determineCategory = (taskDate: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);

    if (taskDate < today) return "Пропущено";
    if (taskDate >= today && taskDate < tomorrow) return "Сьогодні";
    if (taskDate >= tomorrow && taskDate < oneWeekLater) return "Тиждень";
    if (taskDate >= oneWeekLater && taskDate < oneMonthLater) return "Місяць";
    return "Пізніше";
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть завдання.");
      return;
    }

    setTasks((prevTasks) => [
      ...prevTasks,
      { id: generateUniqueId(), task: newTask.trim(), date: selectedDate.toISOString(), completed: false },
    ]);

    setNewTask("");
    setSelectedDate(new Date());
    setIsModalVisible(false);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const renderCategory = (category: string) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
        data={tasks.filter((task) => determineCategory(new Date(task.date)) === category)}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(item.id)}
              style={styles.taskContent}
            >
              <Ionicons
                name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={item.completed ? "green" : "gray"}
              />
              <Text
                style={[
                  styles.task,
                  item.completed && { textDecorationLine: "line-through" },
                ]}
              >
                {item.task} ({new Date(item.date).toLocaleString()})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteTask(item.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Немає завдань</Text>}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {taskCategories.map((category) => (
        <View key={category} style={styles.categoryContainer}>
          {renderCategory(category)}
        </View>
      ))}

      <TouchableOpacity
        style={styles.globalAddButton}
        onPress={() => {
          setPreviousDate(selectedDate); // Зберігаємо попередню дату
          setIsModalVisible(true);
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setSelectedDate(previousDate); // Відновлюємо попередню дату при закритті модального вікна
          setIsModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.categoryTitle}>Додати нове завдання</Text>

                {/* Рядок вибору дати та часу */}
                <View style={styles.dateTimeRow}>
                  <View style={styles.dateTimeColumn}>
                    <Text style={styles.pickerLabel}>Дата</Text>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        if (date) {
                          const updatedDate = new Date(selectedDate);
                          updatedDate.setFullYear(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                          );
                          setSelectedDate(updatedDate);
                        }
                      }}
                    />
                  </View>
                  <View style={styles.dateTimeColumn}>
                    <Text style={styles.pickerLabel}>Час</Text>
                    <DateTimePicker
                      value={selectedDate}
                      mode="time"
                      display="default"
                      onChange={(event, date) => {
                        if (date) {
                          const updatedDate = new Date(selectedDate);
                          updatedDate.setHours(
                            date.getHours(),
                            date.getMinutes()
                          );
                          setSelectedDate(updatedDate);
                        }
                      }}
                    />
                  </View>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Введіть нове завдання"
                  value={newTask}
                  onChangeText={setNewTask}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDate(previousDate); // Відновлюємо попередню дату
                      setIsModalVisible(false);
                    }}
                    style={styles.cancelButton}
                  >
                    <Text style={{ textAlign: "center" }}>Скасувати</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddTask}
                    style={styles.addTaskButton}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      Додати
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
