"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { Drawer } from "@/components/ui/drawer";
import { HeaderProduto } from "@/components/HeaderProduto";
import { FooterComponent } from "@/components/Footer";

interface UserData {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  memberSince: string;
}

type ProfileSection = "info" | "email" | "password" | "purchaseHistory";

const initialUser: UserData = {
  id: "user123",
  name: "Usuário Exemplo Silva",
  nickname: "UsuaEx",
  email: "usuario.exemplo@email.com",
  phone: "(11) 98765-4321",
  profileImageUrl: "https://placehold.co/150x150/E0E0E0/333?text=User",
  memberSince: "15 de Janeiro de 2023",
};

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
    />
  </svg>
);

interface UserInfoHeaderProps {
  user: UserData;
  onLogout: () => void;
}
const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-center">
        <img
          src={
            user.profileImageUrl ||
            "https://placehold.co/100x100/E0E0E0/333?text=U"
          }
          alt="Foto do Perfil"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-300 mb-4 sm:mb-0 sm:mr-6"
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/100x100/E0E0E0/333?text=Error")
          }
        />
        <div className="flex-grow text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {user.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Membro desde: {user.memberSince}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 sm:mt-0 sm:ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

interface UserProfileNavProps {
  activeSection: ProfileSection;
  setActiveSection: (section: ProfileSection) => void;
}
const NavItem: React.FC<{
  label: string;
  section: ProfileSection;
  activeSection: ProfileSection;
  onClick: () => void;
}> = ({ label, section, activeSection, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150
      ${
        activeSection === section
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
      }`}
  >
    {label}
  </button>
);
const UserProfileNav: React.FC<UserProfileNavProps> = ({
  activeSection,
  setActiveSection,
}) => {
  return (
    <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 space-y-2 mb-6 md:mb-0 md:mr-6 lg:mr-8 flex-shrink-0">
      <NavItem
        label="Informações Pessoais"
        section="info"
        activeSection={activeSection}
        onClick={() => setActiveSection("info")}
      />
      <NavItem
        label="Alterar E-mail"
        section="email"
        activeSection={activeSection}
        onClick={() => setActiveSection("email")}
      />
      <NavItem
        label="Alterar Senha"
        section="password"
        activeSection={activeSection}
        onClick={() => setActiveSection("password")}
      />
      <NavItem
        label="Histórico de Compras"
        section="purchaseHistory"
        activeSection={activeSection}
        onClick={() => setActiveSection("purchaseHistory")}
      />
    </nav>
  );
};

interface UserInfoSectionProps {
  user: UserData;
  onUpdateProfile: (
    updatedData: Partial<Pick<UserData, "name" | "nickname" | "phone">>
  ) => void;
}
const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  user,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [nickname, setNickname] = useState(user.nickname || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    setName(user.name);
    setNickname(user.nickname || "");
    setPhone(user.phone || "");
    setMessage(null);
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const updatedData: Partial<Pick<UserData, "name" | "nickname" | "phone">> =
      {};
    if (name !== user.name) updatedData.name = name;
    if (nickname !== (user.nickname || "")) updatedData.nickname = nickname;
    if (phone !== (user.phone || "")) updatedData.phone = phone;

    if (Object.keys(updatedData).length === 0) {
      setMessage({ text: "Nenhuma alteração detectada.", type: "error" });
      return;
    }

    onUpdateProfile(updatedData);
    setMessage({
      text: "Informações atualizadas com sucesso!",
      type: "success",
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Informações Pessoais
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome Completo:
          </label>
          <input
            type="text"
            id="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Apelido (Opcional):
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Telefone (Opcional):
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(XX) XXXXX-XXXX"
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {message && (
          <p
            className={`text-sm mt-2 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border border-green-300 text-green-700"
                : "bg-red-50 border border-red-300 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

interface ChangeEmailFormProps {
  currentEmail: string;
  onChangeEmail: (newEmail: string) => void;
}
const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({
  currentEmail,
  onChangeEmail,
}) => {
  const [newEmail, setNewEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!newEmail || !confirmEmail || !password) {
      setMessage({ text: "Todos os campos são obrigatórios.", type: "error" });
      return;
    }
    if (newEmail === currentEmail) {
      setMessage({
        text: "O novo e-mail não pode ser igual ao e-mail atual.",
        type: "error",
      });
      return;
    }
    if (newEmail !== confirmEmail) {
      setMessage({ text: "Os e-mails não coincidem.", type: "error" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setMessage({ text: "Formato de e-mail inválido.", type: "error" });
      return;
    }

    if (password !== "senha123") {
      setMessage({
        text: "Senha atual incorreta para confirmação.",
        type: "error",
      });
      return;
    }

    onChangeEmail(newEmail);
    setMessage({
      text: "E-mail alterado com sucesso! (Simulação)",
      type: "success",
    });
    setNewEmail("");
    setConfirmEmail("");
    setPassword("");
    setShowPassword(false);
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Alterar E-mail
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentEmailDisplay"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            E-mail Atual:
          </label>
          <input
            type="email"
            id="currentEmailDisplay"
            value={currentEmail}
            readOnly
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="newEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Novo E-mail:
          </label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="confirmEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirmar Novo E-mail:
          </label>
          <input
            type="email"
            id="confirmEmail"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="passwordForEmailChange"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Senha Atual (para confirmação):
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="passwordForEmailChange"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        {message && (
          <p
            className={`text-sm mt-2 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border border-green-300 text-green-700"
                : "bg-red-50 border border-red-300 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Salvar Novo E-mail
        </button>
      </form>
    </div>
  );
};

interface ChangePasswordFormProps {
  onChangePassword: () => void;
}
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onChangePassword,
}) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage({ text: "Todos os campos são obrigatórios.", type: "error" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage({ text: "As novas senhas não coincidem.", type: "error" });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({
        text: "A nova senha deve ter pelo menos 8 caracteres.",
        type: "error",
      });
      return;
    }

    if (currentPassword !== "senha123") {
      setMessage({ text: "Senha atual incorreta.", type: "error" });
      return;
    }

    onChangePassword();
    setMessage({
      text: "Senha alterada com sucesso! (Simulação)",
      type: "success",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Alterar Senha
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentPasswordForm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Senha Atual:
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPasswordForm"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={
                showCurrentPassword
                  ? "Ocultar senha atual"
                  : "Mostrar senha atual"
              }
            >
              {showCurrentPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="newPasswordForm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nova Senha:
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPasswordForm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={
                showNewPassword ? "Ocultar nova senha" : "Mostrar nova senha"
              }
            >
              {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="confirmNewPasswordForm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirmar Nova Senha:
          </label>
          <div className="relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              id="confirmNewPasswordForm"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={
                showConfirmNewPassword
                  ? "Ocultar confirmação de nova senha"
                  : "Mostrar confirmação de nova senha"
              }
            >
              {showConfirmNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        {message && (
          <p
            className={`text-sm mt-2 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border border-green-300 text-green-700"
                : "bg-red-50 border border-red-300 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Alterar Senha
        </button>
      </form>
    </div>
  );
};

const SecuritySettingsSection: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    alert(
      `Autenticação de Dois Fatores ${
        !twoFactorEnabled ? "habilitada" : "desabilitada"
      } (Simulação)`
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Configurações de Segurança
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Autenticação de Dois Fatores (2FA)
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Adicione uma camada extra de segurança à sua conta.
          </p>
          <div className="mt-4">
            {twoFactorEnabled ? (
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                  2FA Habilitado
                </span>
                <button
                  onClick={handleToggleTwoFactor}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Desabilitar
                </button>
              </div>
            ) : (
              <button
                onClick={handleToggleTwoFactor}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Habilitar 2FA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PurchaseHistorySection: React.FC = () => {
  const purchaseHistoryMock = [
    {
      id: "ph001",
      date: "10/05/2025",
      item: "Produto A",
      amount: "R$ 99,90",
      status: "Entregue",
    },
    {
      id: "ph002",
      date: "22/04/2025",
      item: "Serviço B",
      amount: "R$ 49,00",
      status: "Concluído",
    },
    {
      id: "ph003",
      date: "01/03/2025",
      item: "Produto C",
      amount: "R$ 129,50",
      status: "Enviado",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Histórico de Compras
      </h2>
      {purchaseHistoryMock.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item/Serviço
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseHistoryMock.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        purchase.status === "Entregue" ||
                        purchase.status === "Concluído"
                          ? "bg-green-100 text-green-800"
                          : purchase.status === "Enviado"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">
          Você ainda não possui compras no seu histórico.
        </p>
      )}
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData>(initialUser);
  const [activeSection, setActiveSection] = useState<ProfileSection>("info");

  const handleLogout = () => {
    alert("Você foi deslogado! (Simulação)");
  };

  const handleUpdateProfile = (
    updatedData: Partial<Pick<UserData, "name" | "nickname" | "phone">>
  ) => {
    console.log("Atualizando perfil com:", updatedData);
    setUser((prevUser) => ({ ...prevUser!, ...updatedData }));
  };

  const handleChangeEmail = (newEmail: string) => {
    console.log("Alterando e-mail para:", newEmail);
    setUser((prevUser) => ({ ...prevUser!, email: newEmail }));
  };

  const handleChangePassword = () => {
    console.log("Lógica de alteração de senha executada (simulação).");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "info":
        return (
          <UserInfoSection user={user} onUpdateProfile={handleUpdateProfile} />
        );
      case "email":
        return (
          <ChangeEmailForm
            currentEmail={user.email}
            onChangeEmail={handleChangeEmail}
          />
        );
      case "password":
        return <ChangePasswordForm onChangePassword={handleChangePassword} />;
      case "purchaseHistory":
        return <PurchaseHistorySection />;
      default:
        const _exhaustiveCheck: never = activeSection;
        return <p>Seção não encontrada.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Drawer>
        <HeaderProduto />
      </Drawer>
      <div className="flex-grow max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {" "}
        <UserInfoHeader user={user} onLogout={handleLogout} />
        <div className="flex flex-col md:flex-row">
          <UserProfileNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <main className="flex-grow">{renderSection()}</main>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default UserProfilePage;
