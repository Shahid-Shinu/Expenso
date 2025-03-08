import { useEffect, useState, useMemo } from 'react';
import { useSelector } from "react-redux";
import { groupBy } from "lodash";
import { Modal, Button, TextInput, SegmentedControl, MultiSelect } from '@mantine/core';
import { MantineReactTable } from 'mantine-react-table';
import { useDisclosure } from '@mantine/hooks';
import { CSVLink } from 'react-csv';
import BarChart from '../components/BarChart';
import StackedBarChart from '../components/StackedBarChart';
import { showNotification } from "@mantine/notifications";
import { DatePickerInput } from "@mantine/dates";
import { categories } from "../Expense";
import axios from 'axios';
import { Loader } from "@mantine/core";
import _ from "lodash";

const fetchExpenses = async (user, dateRange, selectedCategory, searchQuery) => {
  try {
    const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/expenses/stats/${user.id}?start=${dateRange[0] || 0}&end=${dateRange[1] || 0}&category=${selectedCategory.join(',') || ''}&searchQuery=${searchQuery}`);
    return data;
  } catch (error) {
    showNotification({ title: "Error", message: error.message, color: "red" });
    return [];
  }
};

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800"]

const StatsStackedBarChart = ({ expenses }) => {
  const [selectedView, setSelectedView] = useState("Monthly");

  // Grouping Data based on selected view
  const groupedExpenses = useMemo(() => {
    if (selectedView === "Weekly") {
      return _.groupBy(expenses, (exp) => {
        return new Date(exp.createdAt).toISOString().slice(0, 10);
      });
    } else if (selectedView === "Monthly") {
      return _.groupBy(expenses, (exp) => {
        return new Date(exp.createdAt).toISOString().slice(0, 7);
      });
    } else {
      return _.groupBy(expenses, (exp) => {
        return new Date(exp.createdAt).getFullYear();
      });
    }
  }, [expenses, selectedView]);

  // Chart Labels and Data Preparation
  const labels = _.sortBy(Object.keys(groupedExpenses), (label) => new Date(label));
  const categories = [...new Set(expenses.map((exp) => exp.category))];
  const title = 'Category Wise Expenses'

  const datasets = categories.map((category, index) => ({
    label: category,
    data: labels.map(
      (label) =>
        _.sumBy(groupedExpenses[label].filter((exp) => exp.category === category), "amount") || 0
    ),
    backgroundColor: COLORS[index % COLORS.length],
    borderWidth: 1,
    barThickness: 40,
  }));

  return (
    <>
      <div className='flex justify-center'>
        <SegmentedControl
          value={selectedView}
          onChange={setSelectedView}
          data={["Weekly", "Monthly", "Yearly"]}
          color='grape'
          className='mb-3 mt-10 w-1/2'
        />
      </div>
      <div className='h-[55vh]'>
        <StackedBarChart className={'pb-24'} labels={labels} datasets={datasets} title={title}/>
      </div>
    </>
  )

}

const StatsPage = () => {
  const [chartData, setChartData] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const startDate = new Date(new Date().setMonth(new Date().getMonth() - 6))
  const [dateRange, setDateRange] = useState([startDate, new Date()]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    fetchExpenses(user, dateRange, selectedCategory, searchQuery).then((data) => {
      const grouped = groupBy(data, "category");
      console.log(Object.keys(grouped))
      setExpenses(data)
      setChartData({
        labels: _.sortBy(Object.keys(grouped).map((category) => category)),
        datasets: [
          {
            data: Object.values(grouped).map((items) => items.reduce((acc, val) => acc + val.amount, 0)),
            backgroundColor: COLORS,
          },
        ],
      });
      setLoading(false)
    });
  }, [dateRange, selectedCategory, searchQuery]);

  const handleBarClick = (index) => {
    const category = chartData.labels[index];
    const filtered = expenses.filter((expense) => expense.category === category);
    setFilteredData(filtered);
    console.log(filtered)
    open();
  };

  const tableColumns = [
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'createdAt', header: 'Date' },
  ];

  if(loading) {
    return <Loader size="lg" />;
  }

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
        <MultiSelect
          label="Category"
          placeholder="All Categories"
          data={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          clearable
          className="flex-1"
        />
        <TextInput
          placeholder="Search by name, description or date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>
      {chartData.labels && (
        <BarChart chartData={chartData} onBarClick={handleBarClick} />
      )}
      {expenses.length && (
        <StatsStackedBarChart expenses={expenses}/>
      )}

      <Modal opened={opened} onClose={close} title="Expenses" size="auto">
        <div className='fit'>
          <CSVLink data={filteredData.map((id, ...rest) => rest)} filename="expenses.csv">
            <Button color="blue" mb="md">
              Export to CSV
            </Button>
          </CSVLink>

          <MantineReactTable columns={tableColumns} data={filteredData} initialState={{ pagination: { pageSize: 5 } }} enablePagination/>
        </div>
      </Modal>
    </>
  );
};

export default StatsPage;
