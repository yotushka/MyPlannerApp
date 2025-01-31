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
    { id: string; task: string; note: string; date: string; completed: boolean }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<any | null>(null);

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

    const taskDayStart = new Date(
      taskDate.getFullYear(),
      taskDate.getMonth(),
      taskDate.getDate()
    );

    if (taskDayStart <= today) return "Сьогодні";
    if (taskDayStart.getTime() === tomorrow.getTime()) return "Завтра";
    if (taskDayStart > tomorrow && taskDayStart <= oneWeekLater) return "Тиждень";
    if (taskDayStart > oneWeekLater && taskDayStart <= oneMonthLater)
      return "Місяць";
    return "Пізніше";
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть заголовок завдання.");
      return;
    }

    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: generateUniqueId(),
        task: newTask.trim(),
        note: taskNote.trim(),
        date: selectedDate.toISOString(),
        completed: false,
      },
    ]);

    setNewTask("");
    setTaskNote("");
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

  const handleUpdateTask = () => {
    if (!currentTask.task.trim()) {
      Alert.alert("Помилка", "Заголовок завдання не може бути пустим.");
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === currentTask.id
          ? { ...task, task: currentTask.task, note: currentTask.note }
          : task
      )
    );
    setIsViewTaskModalVisible(false);
    setCurrentTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setIsViewTaskModalVisible(false);
  };

  const renderCategory = (category: string) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
        data={tasks.filter((task) => determineCategory(new Date(task.date)) === category)}
        renderItem={({ item }) => {
          const taskDate = new Date(item.date);
          return (
            <TouchableOpacity
              onPress={() => {
                setCurrentTask(item);
                setIsViewTaskModalVisible(true);
              }}
              style={styles.taskContainer}
            >
              <View style={styles.taskContent}>
              <TouchableOpacity
  onPress={() => toggleTaskCompletion(item.id)}
  style={styles.taskCheckbox} // Чекбокс поруч із текстом
>
  <Ionicons
    name={item.completed ? "checkmark-circle" : "ellipse-outline"}
    size={28} // Збільшуємо розмір іконки
    color={item.completed ? "green" : "gray"}
  />
</TouchableOpacity>
<View style={styles.taskContent}>
  <Text
    style={[
      styles.task,
      item.completed && { textDecorationLine: "line-through" },
    ]}
  >
    {item.task}
  </Text>
  <Text style={styles.taskDate}>
    {taskDate.toLocaleDateString()} {taskDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </Text>
</View>
              </View>
            </TouchableOpacity>
          );
        }}
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
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Модальне вікно перегляду завдання */}
      {currentTask && (
        <Modal
          visible={isViewTaskModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsViewTaskModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: "70%" }]}>
              <TextInput
                style={[styles.input, styles.modalTitle]}
                placeholder="Заголовок завдання"
                value={currentTask.task}
                onChangeText={(text) =>
                  setCurrentTask((prev: any) => ({ ...prev, task: text }))
                }
              />
              <TextInput
                style={[styles.input, styles.modalNote]}
                placeholder="Нотатка"
                value={currentTask.note}
                onChangeText={(text) =>
                  setCurrentTask((prev: any) => ({ ...prev, note: text }))
                }
                multiline
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setIsViewTaskModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={{ textAlign: "center" }}>Скасувати</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdateTask}
                  style={styles.addTaskButton}
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    Зберегти
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteTask(currentTask.id)}
                style={styles.deleteButton}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  Видалити
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Модальне вікно створення завдання */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.categoryTitle}>Додати нове завдання</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Заголовок завдання"
                  value={newTask}
                  onChangeText={setNewTask}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Нотатка (додатковий опис)"
                  value={taskNote}
                  onChangeText={setTaskNote}
                  multiline
                />
                <View style={styles.dateTimeRow}>
                  <View style={styles.dateTimeColumn}>
                    <Text style={styles.pickerLabel}>Дата</Text>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        if (date) setSelectedDate(date);
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
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
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
