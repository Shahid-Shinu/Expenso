import { ActionIcon } from "@mantine/core";
import { IconHome, IconPlus, IconChartBar } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const DashboardFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 flex justify-between items-center">
      <ActionIcon
        size={50}
        radius="xl"
        variant="filled"
        color="gray"
        onClick={() => navigate("/home")}
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
          onClick={() => navigate("/add-expense")}
        >
          <IconPlus size={40} />
        </ActionIcon>
      </div>

      <ActionIcon
        size={50}
        radius="xl"
        variant="filled"
        color="gray"
        onClick={() => navigate("/stats")}
      >
        <IconChartBar size={32} />
      </ActionIcon>
    </div>
  );
};

export default DashboardFooter;
