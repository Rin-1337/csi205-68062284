"use client";

import { useState } from "react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { Button } from "@/components/tailgrids/core/button";
import { EMAIL_DOMAIN, verifyUser } from "@/app/data/users";
import type { User } from "@/app/data/users";

type Props = {
  isOpen: boolean;
  onLogin: (user: User) => void;
};

export default function LoginModal({ isOpen, onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = verifyUser(username, password);
    if (!user) {
      setError("Invalid username or password");
      return;
    }
    setError("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
    onLogin(user);
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <Modal className="w-full max-w-md rounded-2xl bg-white shadow-2xl outline-none">
        <Dialog aria-label="Login" className="p-6 outline-none">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Heading slot="title" className="mb-4 text-center text-xl font-bold text-gray-800">
              Who are you?
            </Heading>

            <div className="mb-3 flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-300">
              <i className="bi bi-keyboard text-lg text-gray-600" />
              <input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user | admin | manager"
                className="min-w-0 flex-1 outline-none"
              />
              <span className="text-gray-800">{EMAIL_DOMAIN}</span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-300">
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-lg text-gray-600"
              >
                <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"} />
              </button>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="pass"
                className="min-w-0 flex-1 outline-none"
              />
            </div>

            <p className="mt-2 h-5 text-sm text-red-600">{error}</p>

            <div className="mt-3 flex justify-end">
              <Button type="submit" variant="primary" appearance="outline">
                Login
              </Button>
            </div>
          </form>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
