import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { categories } from "./Expense";
import { Card, Text, Group, ActionIcon, Modal, TextInput, NumberInput, Select, Button, Tooltip } from "@mantine/core";
import { IconCalendar, IconTrash, IconEdit, IconAlertTriangle, IconSum, IconSearch, IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const categoryIcons = categories.reduce((acc, { value, icon }) => {
  acc[value] = icon;
  return acc;
}, {});

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(null);
  const [category, setCategory] = useState("");
  const [createdDate, setCreatedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  // const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  const startDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
  const [dateRange, setDateRange] = useState([startDate, new Date()]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(5);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, currentPage]);

  useEffect(() => {
    if (user) {
      fetchExpenses();
      setCurrentPage(1)
    }
  }, [dateRange, selectedCategory, searchQuery]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/expenses/${user.id}?page=${currentPage}&limit=${expensesPerPage}&start=${dateRange[0] || 0}&end=${dateRange[1] || 0}&category=${selectedCategory || ''}&searchQuery=${searchQuery}`);
      setExpenses(response.data.expenses);
      setTotalExpenses(response.data.total)
      setTotalExpense(response.data.totalexpense)
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPages = Math.ceil(totalExpenses / expensesPerPage);

  // Open edit modal with pre-filled values
  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setExpenseName(expense.name);
    setExpenseAmount(expense.amount);
    setCategory(expense.category);
    setCreatedDate(expense.createdAt)
    setDescription(expense.description || "");
    setEditOpened(true);
  };

  const handleUpdateExpense = async () => {
    if (!selectedExpense) return;
    
    try {
      await axios.put(`${VITE_API_URL}/expense/${selectedExpense.id}`, {
        name: expenseName,
        amount: parseFloat(expenseAmount),
        category,
        createdAt: dayjs(createdDate).format("YYYY-MM-DD"),
        description,
      });

      notifications.show({
        title: "Updated",
        message: "Expense updated successfully!",
        color: "green",
        autoClose: 2000,
      });

      setEditOpened(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update expense!",
        color: "red",
        autoClose: 2000,
      });
    }
  };

  // Open Delete confirmation modal
  const handleDeleteClick = (expense) => {
    setSelectedExpense(expense);
    setDeleteModalOpen(true);
  };

  const confirmDeleteExpense = async () => {
    if (!selectedExpense) return;

    try {
      await axios.delete(`${VITE_API_URL}/expense/${selectedExpense.id}`);
      notifications.show({
        title: "Deleted",
        message: `"${selectedExpense.name}" has been removed successfully!`,
        color: "blue",
        autoClose: 2000,
      });

      setDeleteModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete expense!",
        color: "red",
        autoClose: 2000,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  return (
    <>
    <div className="flex flex-wrap gap-4 mb-4 items-end">
      <DatePickerInput
        type="range"
        label="Filter by Date"
        value={dateRange}
        onChange={setDateRange}
        className="flex-1"
        clearable
      />
      <Select
        label="Category"
        placeholder="All Categories"
        data={categories}
        value={selectedCategory}
        onChange={setSelectedCategory}
        clearable
        className="flex-1"
      />
      <TextInput
        placeholder="Search by name, description, date, or amount"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
      />
    </div>
    <div className="max-w-lg mx-auto p-6">
      <Card shadow="sm" p="lg" radius="md" className="bg-gray-900 text-white mb-4">
        <Group position="apart">
          <Text size="lg" weight={700}>Total Expense</Text>
          <IconSum size={28} className="text-blue-400" />
          <Text size="xl" weight={800} className="text-green-400 mt-2">
            ₹ {totalExpense.toFixed(2)}
          </Text>
        </Group>
      </Card>
      {/* <h2 className="text-2xl font-semibold text-white mb-4">Your Expenses</h2> */}

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion" centered>
        <Group spacing="sm">
          <IconAlertTriangle size={30} color="red" />
          <Text size="md">
            Are you sure you want to delete <b>{selectedExpense?.name}</b>?
          </Text>
        </Group>
        <Group position="apart" mt="md">
          <Button variant="outline" color="gray" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDeleteExpense}>
            Delete
          </Button>
        </Group>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Edit Expense" size="lg" centered>
        <TextInput label="Expense Name" placeholder="Enter name" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} />
        <NumberInput label="Amount" placeholder="Enter amount" value={expenseAmount} onChange={setExpenseAmount} />
        <Select label="Category" placeholder="Select category" value={category} onChange={setCategory} data={categories.map(c => ({ value: c.value, label: c.label }))}  dropdownPosition="bottom"/>
        <DatePickerInput label="Edit Created Date" value={createdDate ? new Date(createdDate) : new Date()} onChange={setCreatedDate} className="mb-2"/>
        <TextInput label="Description" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button fullWidth className="mt-4 bg-blue-600 hover:bg-blue-500" onClick={handleUpdateExpense}>
          Update Expense
        </Button>
      </Modal>

      {expenses.length === 0 ? (
        <Text color="dimmed" align="center">
          No expenses found.
        </Text>
      ) : (
        expenses.map((expense) => (
          <Card key={expense.id} shadow="sm" p="lg" radius="md" className="mb-3 bg-gray-800 text-white relative transition-transform hover:scale-[1.02]">
            {/* Floating Action Icons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Tooltip label="Edit" withArrow>
                <ActionIcon size="sm" color="yellow" className="opacity-80 hover:opacity-100" onClick={() => handleEditExpense(expense)}>
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete" withArrow>
                <ActionIcon size="sm" color="red" className="opacity-80 hover:opacity-100" onClick={() => handleDeleteClick(expense)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Tooltip>
            </div>

            {/* Expense Name, Icon & Date */}
            <Group align="center" spacing="xs">
              {categoryIcons[expense.category] || <IconDots size={24} />}
              <div className="flex-1">
                <Text size="lg" weight={600}>{expense.name}</Text>
                <Group spacing="xs">
                  <IconCalendar size={14} color="gray" />
                  <Text size="xs" color="dimmed">{formatDate(expense.createdAt)}</Text>
                </Group>
              </div>
            </Group>

            <Text size="xl" weight={700} className="text-blue-400 absolute top-10 right-4">
              ₹{expense.amount.toFixed(2)}
            </Text>

            {/* Expense Description */}
            <Text size="sm" color="dimmed" mt="sm">
              {expense.description || "No description"}
            </Text>
          </Card>
        ))
      )}
      <Group className=" bg-gray-800 text-white shadow p-4 flex justify-center gap-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          leftIcon={<IconChevronLeft size={16} />}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          rightIcon={<IconChevronRight size={16} />}
        >
          Next
        </Button>
      </Group>
    </div>
    </>
  );
};

export default Home;
