import { useDispatch } from "react-redux";
import { useState } from "react";
import { signupUser } from "./features/authSlice";
import { Button, TextInput, Container, Title, Paper } from "@mantine/core";

const Signup = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    dispatch(signupUser(username, password));
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
        <Button fullWidth onClick={handleSignup}>Sign Up</Button>
      </Paper>
    </Container>
  );
};

export default Signup;
