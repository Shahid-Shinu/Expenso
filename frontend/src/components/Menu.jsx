import { useSelector } from "react-redux";
import { Menu, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconHome, IconPlus, IconCategory, IconUser, IconLogout } from "@tabler/icons-react";

const ExpenseMenu = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <Group position="center">
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button variant="filled" color="blue">
            Menu
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item icon={<IconHome size={18} />} onClick={() => navigate("/home")}>
            Dashboard
          </Menu.Item>
          <Menu.Item icon={<IconPlus size={18} />} onClick={() => navigate("/add-expense")}>
            Add Expense
          </Menu.Item>
          <Menu.Item icon={<IconCategory size={18} />} onClick={() => navigate("/categories")}>
            Categories
          </Menu.Item>
          {user && (
            <>
              <Menu.Item icon={<IconUser size={18} />} onClick={() => navigate("/profile")}>
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item icon={<IconLogout size={18} />} color="red" onClick={() => navigate("/logout")}>
                Logout
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default ExpenseMenu;
