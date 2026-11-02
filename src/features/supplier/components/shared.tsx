"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "../supplier.module.css";

export function ActionButton({
  secondary,
  danger,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      {...props}
      className={`${styles.button} ${secondary ? styles.secondary : ""} ${danger ? styles.danger : ""} ${className}`}
    />
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.pageHeading}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.muted}>{description}</p>
      </div>
      {children}
    </div>
  );
}

export function LoadingState({
  label = "Carregando dados…",
}: {
  label?: string;
}) {
  return (
    <div className={styles.state} role="status">
      <LoaderCircle className={styles.spin} size={24} />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className={styles.error} role="alert">
      <AlertCircle size={20} />
      <div>
        <p>{message}</p>
        {retry && (
          <button className={styles.textButton} onClick={retry}>
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={styles.state}>
      <h3>{title}</h3>
      <p className={styles.muted}>{description}</p>
    </div>
  );
}

export function Pagination({
  page,
  total,
  limit,
  onChange,
}: {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className={styles.pagination}>
      <span>
        {total} {total === 1 ? "registro" : "registros"} · Página {page} de{" "}
        {pages}
      </span>
      <div className={styles.actions}>
        <ActionButton
          secondary
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Página anterior"
        >
          <ArrowLeft size={16} />
        </ActionButton>
        <ActionButton
          secondary
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          aria-label="Próxima página"
        >
          <ArrowRight size={16} />
        </ActionButton>
      </div>
    </div>
  );
}

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  NOT_RECORDED: "Não registrado",
  BOARDED: "Embarcou",
  NO_SHOW: "Ausente",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = ["CONFIRMED", "COMPLETED", "BOARDED"].includes(status)
    ? styles.positive
    : ["CANCELLED", "NO_SHOW"].includes(status)
      ? styles.negative
      : status === "PENDING"
        ? styles.warning
        : styles.neutral;
  return (
    <span className={`${styles.badge} ${tone}`}>
      <span />
      {statusLabels[status] || status}
    </span>
  );
}

export function Modal({
  title,
  description,
  children,
  onClose,
  busy = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.modal}
          onEscapeKeyDown={(event) => {
            if (busy) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (busy) event.preventDefault();
          }}
        >
          <div className={styles.modalHeading}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                disabled={busy}
                className={styles.iconButton}
                aria-label="Fechar janela"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className={styles.muted}>
            {description}
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Confirma ações operacionais e mantém o erro junto à seleção quando o backend rejeita. */
export function ConfirmationDialog({
  title,
  description,
  needsReason = false,
  danger = false,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  needsReason?: boolean;
  danger?: boolean;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Modal
      title={title}
      description={description}
      onClose={onClose}
      busy={busy}
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          try {
            await onConfirm(reason.trim());
            onClose();
          } catch (failure) {
            setError(
              failure instanceof Error
                ? failure.message
                : "Não foi possível concluir a ação.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {needsReason && (
          <label className={styles.field}>
            Motivo do cancelamento
            <textarea
              required
              minLength={3}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explique o motivo para manter o histórico."
              rows={3}
            />
          </label>
        )}
        {error && <ErrorState message={error} />}
        <div className={styles.modalActions}>
          <ActionButton
            type="button"
            secondary
            onClick={onClose}
            disabled={busy}
          >
            Voltar
          </ActionButton>
          <ActionButton
            danger={danger}
            disabled={busy || (needsReason && reason.trim().length < 3)}
          >
            {busy ? "Salvando…" : "Confirmar ação"}
          </ActionButton>
        </div>
      </form>
    </Modal>
  );
}
