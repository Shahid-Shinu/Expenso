import { Menu, Button, Group } from "@mantine/core";
import { IconHome, IconPlus, IconCategory, IconUser, IconLogout } from "@tabler/icons-react";

const ExpenseMenu = () => {
  return (
    <Group position="center">
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button variant="filled" color="blue">
            Menu
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item icon={<IconHome size={18} />} onClick={() => console.log("Dashboard")}>
            Dashboard
          </Menu.Item>
          <Menu.Item icon={<IconPlus size={18} />} onClick={() => console.log("Add Expense")}>
            Add Expense
          </Menu.Item>
          <Menu.Item icon={<IconCategory size={18} />} onClick={() => console.log("Categories")}>
            Categories
          </Menu.Item>
          <Menu.Item icon={<IconUser size={18} />} onClick={() => console.log("Profile")}>
            Profile
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item icon={<IconLogout size={18} />} color="red" onClick={() => console.log("Logout")}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default ExpenseMenu;
