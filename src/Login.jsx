import { useDispatch } from "react-redux";
import { loginUser } from "./features/authSlice";
import { useState } from "react";
import { Button, TextInput, Container, Title, Paper } from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      notifications.show({
        title: "Error",
        message: "Username and password are required.",
        color: "red",
        autoClose: 2000,
      });
      return;
    }
    dispatch(loginUser(username, password, navigate));
  };

  return (
    <Container size="xs" mt={50}>
      <Paper shadow="xs" p="xl">
        <Title align="center" mb="md">Login</Title>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
          mb="md"
        />
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          mb="md"
        />
        <Button fullWidth onClick={handleLogin}>Login</Button>
        <span className="text-sm mt-2">
          New user?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300">
            Register here
          </Link>
       </span>
      </Paper>
    </Container>
  );
};

export default Login;
