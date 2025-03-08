import { ActionIcon } from "@mantine/core";
import { IconHome, IconPlus, IconChartBar } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const DashboardFooter = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleNavigation = (path) => {
    if (!user) {
      notifications.show({
        title: "Login Required",
        message: "Please log in to access this feature.",
        color: "red",
        icon: <IconX size={20} />,
        autoClose: 2000,
      });
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-900 p-4 flex justify-between items-center">
      <ActionIcon
        size={50}
        radius="xl"
        variant="filled"
        color="purple"
        onClick={() => handleNavigation("/home")}
      >
        <IconHome size={32} />
      </ActionIcon>

      <div className="relative flex justify-center w-full">
        <ActionIcon
          size={64}
          radius="xl"
          variant="filled"
          color="blue"
          className="absolute -top-6 shadow-lg border-4 border-white"
          onClick={() => handleNavigation("/add-expense")}
        >
          <IconPlus size={40} />
        </ActionIcon>
      </div>

      <ActionIcon
        size={50}
        radius="xl"
        variant="filled"
        color="purple"
        onClick={() => handleNavigation("/stats")}
      >
        <IconChartBar size={32} />
      </ActionIcon>
    </div>
  );
};

export default DashboardFooter;
