import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ExpenseMenu from "./components/Menu";
import DashboardFooter from "./components/DashboardFooter";
import { Home } from "./Home";
import Expense from "./Expense";
import Login from "./Login";
import Signup from "./Signup";
import { logoutSuccess } from "./features/authSlice";
import { Button, Group } from "@mantine/core";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header with Menu & Auth Buttons */}
        <div className="flex justify-between m-5 items-center">
          <ExpenseMenu />
          <Group>
            {user ? (
              <Button variant="outline" color="red" onClick={() => dispatch(logoutSuccess())}>
                Logout
              </Button>
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
    </Router>
  );
}

export default App;
