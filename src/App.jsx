import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ExpenseMenu from "./components/Menu";
import DashboardFooter from "./components/DashboardFooter";
import Home from "./Home";
import Expense from "./Expense";
import Login from "./Login";
import Signup from "./Signup";
import { loginUser, logoutUser } from "./features/authSlice";
import { Button, Group, Text, Menu } from "@mantine/core";
import ProtectedRoute from "./ProtectedRoute";
import { useNavigate } from "react-router-dom";
import { IconUser, IconLogout } from "@tabler/icons-react";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/"); 
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Header with Menu & Auth Buttons */}
        <div className="flex justify-between m-5 items-center">
          <ExpenseMenu />
          <Group>
            {user ? (
              <Menu>
              <Menu.Target>
                <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md cursor-pointer">
                  <IconUser size={18} color="white" />
                  <Text className="text-white font-semibold">{user.username}</Text>
                </div>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconUser size={16} />}
                  onClick={() => console.log("Profile clicked")}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  icon={<IconLogout size={16} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            ) : (
              <>
                <Button component={Link} to="/login" variant="outline">
                  Login
                </Button>
                <Button component={Link} to="/signup" variant="filled">
                  Sign Up
                </Button>
              </>
            )}
          </Group>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-expense" element={<Expense />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </>
  );
}

export default App;
