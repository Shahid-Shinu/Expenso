import { useState } from "react";
import { TextInput, NumberInput, Select, Button, Notification } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconShoppingCart,
  IconBus,
  IconMovie,
  IconHome,
  IconPizza,
  IconDots,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const SelectItem = ({ value, label, icon, ...others }) => (
  <div {...others} className="flex items-center gap-2 p-2">
    {icon} <span>{label}</span>
  </div>
);

const Expense = () => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [category, setCategory] = useState("");
  const xIcon = <IconX size={20} />;
  const checkIcon = <IconCheck size={20} />;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id

  // Category options with icons
  const categories = [
    { value: "Food", label: "Food", icon: <IconPizza size={18} /> },
    { value: "Transport", label: "Transport", icon: <IconBus size={18} /> },
    { value: "Shopping", label: "Shopping", icon: <IconShoppingCart size={18} /> },
    { value: "Bills", label: "Bills", icon: <IconHome size={18} /> },
    { value: "Entertainment", label: "Entertainment", icon: <IconMovie size={18} /> },
    { value: "Other", label: "Other", icon: <IconDots size={18} /> },
  ];

  const handleSubmit = async () => {
    if (!expenseName || !expenseAmount || !category) {
        notifications.show({
          title: 'Bummer!',
          message: 'Need to Fill all the required details',
          icon: xIcon,
          color: "red",
          autoClose: 2000
        })
    }

    try {
      const response = await axios.post(`${VITE_API_URL}/addExpense`, {
        name: expenseName,
        amount: parseFloat(expenseAmount),
        category,
        userId: userId,
      });

      console.log("Expense Added:", response.data);
      notifications.show({
        title: "Success",
        message: "Expense added successfully!",
        color: "green",
        icon: <IconCheck size={16} />,
        autoClose: 2000
      });

      setExpenseName("");
      setExpenseAmount("");
      setCategory("");
    } catch (error) {
      console.error("Error adding expense:", error);
      notifications.show({
        title: "Error",
        message: "Failed to add expense!",
        color: "red",
        icon: <IconX size={16} />,
        autoClose: 2000
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Add Expense</h2>

      <TextInput
        label="Expense Name"
        placeholder="Enter expense name"
        value={expenseName}
        onChange={(e) => setExpenseName(e.target.value)}
        className="mb-4"
        styles={{ input: { backgroundColor: "#1e293b", color: "white" } }}
      />

      <NumberInput
        label="Expense Amount"
        placeholder="Enter amount"
        value={expenseAmount}
        onChange={setExpenseAmount}
        className="mb-4"
        styles={{ input: { backgroundColor: "#1e293b", color: "white" } }}
      />

      <Select
        label="Category"
        placeholder="Select category"
        data={categories}
        itemComponent={SelectItem}
        value={category}
        onChange={setCategory}
        className="mb-4"
        styles={{ input: { backgroundColor: "#1e293b", color: "white" } }}
      />

      <Button fullWidth onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500">
        Submit
      </Button>
    </div>
  );
};

export default Expense;
