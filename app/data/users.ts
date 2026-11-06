export type Role = "USER" | "ADMIN" | "MANAGER";

export type User = {
  username: string;
  role: Role;
  name: string;
  email: string;
};

export const EMAIL_DOMAIN = "@company.com";

const users: (User & { password: string })[] = [
  { username: "user", password: "pass", role: "USER", name: "น.ส. ใช้งาน ธรรมดา", email: "user@company.com" },
  { username: "admin", password: "pass", role: "ADMIN", name: "นาย ผู้ดูแล ระบบ", email: "admin@company.com" },
  { username: "manager", password: "pass", role: "MANAGER", name: "นาง ผู้จัดการ ใหญ่", email: "manager@company.com" },
];

export const verifyUser = (username: string, password: string): User | null => {
  const found = users.find(
    (u) => u.username === username.trim().toLowerCase() && u.password === password,
  );
  if (!found) return null;
  return { username: found.username, role: found.role, name: found.name, email: found.email };
};
