import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/HomeScreen.styles";

const taskCategories = ["Сьогодні", "Завтра", "Тиждень", "Місяць", "Пізніше"];

export default function HomeScreen() {
  const [tasks, setTasks] = useState<
    { task: string; date: string; completed: boolean }[]
  >([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Функція для визначення категорії завдання
  const determineCategory = (taskDate: Date): string => {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor(
      (taskDate.getTime() - today.getTime()) / oneDay
    );

    if (daysDifference < 0) return "Пропущено"; // Якщо дата вже пройшла
    if (daysDifference === 0) return "Сьогодні";
    if (daysDifference === 1) return "Завтра";
    if (daysDifference <= 7) return "Тиждень";
    if (daysDifference <= 30) return "Місяць";
    return "Пізніше";
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть завдання.");
      return;
    }

    setTasks((prevTasks) => [
      ...prevTasks,
      { task: newTask.trim(), date: selectedDate.toISOString(), completed: false },
    ]);

    setNewTask("");
    setSelectedDate(new Date());
    setIsModalVisible(false);
  };

  // Функція для оновлення завдань при зміні дати
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          const taskDate = new Date(task.date);
          return { ...task, category: determineCategory(taskDate) };
        })
      );
    }, 60000); // Перевірка кожну хвилину
    return () => clearInterval(interval);
  }, []);

  const handleDeleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const toggleTaskCompletion = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const renderCategory = (category: string) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
        data={tasks.filter((task) => determineCategory(new Date(task.date)) === category)}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => toggleTaskCompletion(index)}
              style={{ flexDirection: "row", alignItems: "center" }}
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
              onPress={() => handleDeleteTask(index)}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(task, index) => `${task.task}-${task.date}-${index}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Немає завдань</Text>
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {taskCategories.map(renderCategory)}

      {/* Глобальна кнопка додавання */}
      <TouchableOpacity
        style={styles.globalAddButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Модальне вікно */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.categoryTitle}>Додати нове завдання</Text>

            {/* Вибір дати і часу */}
            <TouchableOpacity
              onPress={() => setIsDatePickerVisible(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                Дата: {selectedDate.toLocaleString()}
              </Text>
            </TouchableOpacity>

            {isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate}
                mode="datetime" // Дата і час
                display="default"
                onChange={(event, date) => {
                  setIsDatePickerVisible(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Введіть нове завдання"
              value={newTask}
              onChangeText={setNewTask}
            />
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
      </Modal>
    </View>
  );
}
