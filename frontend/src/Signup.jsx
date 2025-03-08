import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { signupUser } from "./features/authSlice";
import { Button, TextInput, Container, Title, Paper } from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.auth.user);

  const handleSignup = () => {
    if (!username || !password) {
      notifications.show({
        title: "Error",
        message: "Username and password are required.",
        color: "red",
        autoClose: 2000,
      });
      return;
    }

    dispatch(signupUser(username, password, navigate));
  };

  useEffect(() => {
    if(user) {
      navigate('/home')
    }
  }, [user])


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
        <span className="text-sm mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login here
          </Link>
       </span>
      </Paper>
    </Container>
  );
};

export default Signup;
