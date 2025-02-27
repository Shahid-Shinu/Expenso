import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth?.user); // Use optional chaining
  const navigate = useNavigate();

  if (!user) {
    navigate("/login")
    return
  }

  return children;
};

export default ProtectedRoute;
