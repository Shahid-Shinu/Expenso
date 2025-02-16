import { useDispatch } from "react-redux";
import { loginUser } from "./features/authSlice";
import { useState } from "react";
import { Button, TextInput, Container, Title, Paper } from "@mantine/core";
const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    dispatch(loginUser(username, password));
  };

  return (
    <Container size="xs" mt={50}>
      <Paper shadow="xs" p="xl">
        <Title align="center" mb="md">Sign Up</Title>
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
      </Paper>
    </Container>
  );
};

export default Login;
