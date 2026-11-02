"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  RotateCw,
  Users,
  X,
} from "lucide-react";
import type {
  AttendanceStatus,
  Page,
  Reservation,
  ReservationStatus,
} from "../types";
import { queryString, supplierRequest } from "../api";
import { countLabel, currency, departureDate } from "../format";
import { useResource } from "../use-resource";
import { useDeparture } from "../use-departure";
import {
  ActionButton,
  ConfirmationDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  Pagination,
  StatusBadge,
} from "./shared";
import { ReservationCard } from "./reservation-card";
import { ReservationHistory } from "./reservation-history";
import styles from "../supplier.module.css";

type Operation =
  | { kind: "reservation"; action: "CONFIRM" | "CANCEL" }
  | { kind: "attendance"; attendance: AttendanceStatus }
  | { kind: "groupBoarding"; participantIds: string[]; responsibleName: string }
  | { kind: "departure"; status: "COMPLETED" | "CANCELLED" };

function operationTitle(operation: Operation) {
  if (operation.kind === "groupBoarding") return "Embarcar este grupo?";
  if (operation.kind === "reservation")
    return operation.action === "CONFIRM"
      ? "Confirmar reservas selecionadas?"
      : "Cancelar reservas selecionadas?";
  if (operation.kind === "departure")
    return operation.status === "COMPLETED"
      ? "Concluir esta saída?"
      : "Cancelar esta saída?";
  return operation.attendance === "BOARDED"
    ? "Registrar embarque dos selecionados?"
    : operation.attendance === "NO_SHOW"
      ? "Registrar ausência dos selecionados?"
      : "Limpar comparecimento dos selecionados?";
}

export function DepartureDetailsPage({ departureId }: { departureId: string }) {
  const params = useSearchParams();
  const departure = useDeparture(
    departureId,
    params.get("productId") || "",
    params.get("startsAt") || "",
  );
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ReservationStatus | "">("");
  const reservations = useResource<Page<Reservation>>(
    departure.data
      ? `saidas/${departureId}/reservas?${queryString({ page, limit: 20, status })}`
      : null,
  );
  const [reservationIds, setReservationIds] = useState<string[]>([]);
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [history, setHistory] = useState<Reservation | null>(null);
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

  const clearSelection = () => {
    setReservationIds([]);
    setParticipantIds([]);
  };
  const refresh = () => {
    clearSelection();
    departure.reload();
    reservations.reload();
    setNow(Date.now());
  };
  const data = departure.data;
  if (departure.loading) return <LoadingState label="Carregando saída…" />;
  if (departure.error || !data)
    return (
      <>
        <Link href="/empresario/reservas" className={styles.backLink}>
          <ArrowLeft size={16} />
          Voltar às saídas
        </Link>
        <ErrorState
          message={departure.error || "Saída indisponível."}
          retry={departure.reload}
        />
      </>
    );

  const editable = data.status === "SCHEDULED" && Boolean(reservations.data);
  const beforeStart = new Date(data.startsAt).getTime() > now;
  const confirmationExpired = data.status === "SCHEDULED" && !beforeStart;
  const boardingOpen =
    new Date(data.startsAt).getTime() - now <= 2 * 60 * 60 * 1000;
  const items = reservations.data?.items || [];
  const selected = items.filter((item) => reservationIds.includes(item.id));
  const selectedPeople = selected.reduce(
    (sum, reservation) => sum + reservation.participants.length,
    0,
  );
  const canCancelSelected = !selected.some((reservation) =>
    reservation.participants.some(
      (participant) => participant.attendance === "BOARDED",
    ),
  );
  const canConfirmSelected =
    beforeStart &&
    !selected.some((reservation) => reservation.status === "CANCELLED");
  const canComplete =
    !beforeStart &&
    data.metrics.pendingReservations === 0 &&
    data.metrics.unrecordedParticipants === 0;
  const selectable = items.filter((item) => item.status !== "CANCELLED");
  const cancellation =
    operation &&
    ((operation.kind === "reservation" && operation.action === "CANCEL") ||
      (operation.kind === "departure" && operation.status === "CANCELLED"));

  async function performOperation(reason: string) {
    if (!operation) return;
    let path: string;
    let body: object;
    if (operation.kind === "reservation") {
      path = `saidas/${departureId}/reservas/resolver`;
      body = {
        reservationIds,
        action: operation.action,
        ...(reason ? { reason } : {}),
      };
    } else if (
      operation.kind === "attendance" ||
      operation.kind === "groupBoarding"
    ) {
      path = `saidas/${departureId}/participantes/comparecimento`;
      body =
        operation.kind === "groupBoarding"
          ? { participantIds: operation.participantIds, attendance: "BOARDED" }
          : { participantIds, attendance: operation.attendance };
    } else {
      path = `saidas/${departureId}/status`;
      body = { status: operation.status, ...(reason ? { reason } : {}) };
    }
    const result = await supplierRequest<{ changed?: number }>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    setNotice(
      result.changed === 0
        ? "Os itens selecionados já estavam nessa situação. Nenhuma alteração foi necessária."
        : "Operação concluída. Os dados foram atualizados.",
    );
    refresh();
  }

  return (
    <>
      <Link href="/empresario/reservas" className={styles.backLink}>
        <ArrowLeft size={16} />
        Todas as saídas
      </Link>
      <PageHeading
        eyebrow="DETALHES DA SAÍDA"
        title={data.product.name}
        description={`${departureDate(data.startsAt, data.timeZone)} · ${data.timeZone}`}
      >
        <ActionButton
          secondary
          onClick={refresh}
          disabled={reservations.loading}
        >
          <RotateCw size={16} />
          Atualizar
        </ActionButton>
      </PageHeading>
      {notice && (
        <p className={styles.success} role="status">
          {notice}
        </p>
      )}
      <section className={styles.departureSummary}>
        <div>
          <span className={styles.muted}>Situação da saída</span>
          <StatusBadge status={data.status} />
        </div>
        <div>
          <span className={styles.muted}>Ocupação confirmada</span>
          <strong>
            <Users size={17} />
            {data.metrics.confirmedParticipants} / {data.capacity}
          </strong>
        </div>
        <div>
          <span className={styles.muted}>Preço por pessoa</span>
          <strong>{currency(data.pricePerPerson)}</strong>
        </div>
        <div>
          <span className={styles.muted}>Embarcados / ausentes</span>
          <strong>
            {data.metrics.boardedParticipants} /{" "}
            {data.metrics.noShowParticipants}
          </strong>
        </div>
      </section>
      <section className={styles.panel}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Reservas e passageiros</h2>
            <p className={styles.muted}>
              Selecione reservas para resolver pedidos e passageiros para
              registrar comparecimento.
            </p>
          </div>
          <label className={styles.field}>
            Situação da reserva
            <select
              value={status}
              onChange={(event) => {
                clearSelection();
                setPage(1);
                setStatus(event.target.value as ReservationStatus | "");
              }}
            >
              <option value="">Todas</option>
              <option value="PENDING">Pendentes</option>
              <option value="CONFIRMED">Confirmadas</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </label>
        </div>
        <div className={styles.selectionBar}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={
                selectable.length > 0 &&
                selectable.every((item) => reservationIds.includes(item.id))
              }
              disabled={!editable || !selectable.length}
              onChange={(event) =>
                setReservationIds(
                  event.target.checked ? selectable.map((item) => item.id) : [],
                )
              }
            />
            Selecionar reservas desta página
          </label>
          <span>
            {countLabel(reservationIds.length, "reserva", "reservas")} ·{" "}
            {countLabel(selectedPeople, "participante", "participantes")}
          </span>
          <div className={styles.actions}>
            <ActionButton
              disabled={
                !editable || !reservationIds.length || !canConfirmSelected
              }
              title={
                !beforeStart
                  ? "O horário de início da saída já passou."
                  : undefined
              }
              aria-describedby={
                confirmationExpired ? "confirmation-expired-notice" : undefined
              }
              onClick={() =>
                setOperation({ kind: "reservation", action: "CONFIRM" })
              }
            >
              <Check size={15} />
              Confirmar
            </ActionButton>
            <ActionButton
              secondary
              disabled={
                !editable || !reservationIds.length || !canCancelSelected
              }
              title={
                !canCancelSelected
                  ? "Há passageiros embarcados na seleção."
                  : undefined
              }
              onClick={() =>
                setOperation({ kind: "reservation", action: "CANCEL" })
              }
            >
              <X size={15} />
              Cancelar
            </ActionButton>
          </div>
        </div>
        {confirmationExpired && (
          <div
            id="confirmation-expired-notice"
            className={styles.confirmationNotice}
            role="status"
          >
            <Clock3 size={18} aria-hidden="true" />
            <p>
              <strong>O horário de início desta saída já passou.</strong> Não é
              possível confirmar novas reservas. O comparecimento dos
              passageiros de reservas já confirmadas ainda pode ser registrado.
            </p>
          </div>
        )}
        <div className={styles.attendanceBar}>
          <div>
            <strong>
              {countLabel(
                participantIds.length,
                "passageiro selecionado",
                "passageiros selecionados",
              )}
            </strong>
            <p>Até 100 por operação, em reservas confirmadas.</p>
          </div>
          <div className={styles.actions}>
            <ActionButton
              secondary
              disabled={!editable || !participantIds.length || !boardingOpen}
              onClick={() =>
                setOperation({ kind: "attendance", attendance: "BOARDED" })
              }
            >
              Marcar embarque
            </ActionButton>
            <ActionButton
              secondary
              disabled={!editable || !participantIds.length || beforeStart}
              onClick={() =>
                setOperation({ kind: "attendance", attendance: "NO_SHOW" })
              }
            >
              Marcar ausência
            </ActionButton>
            <ActionButton
              secondary
              disabled={!editable || !participantIds.length}
              onClick={() =>
                setOperation({ kind: "attendance", attendance: "NOT_RECORDED" })
              }
            >
              Limpar registro
            </ActionButton>
          </div>
        </div>
        <p className={styles.operationHint}>
          Embarque disponível duas horas antes do início. Ausência disponível a
          partir do início. As seleções ficam restritas à página atual.
        </p>
        {reservations.loading ? (
          <LoadingState />
        ) : reservations.error ? (
          <ErrorState
            message={reservations.error}
            retry={reservations.reload}
          />
        ) : (
          reservations.data && (
            <>
              {!items.length ? (
                <EmptyState
                  title="Nenhuma reserva nesta seleção"
                  description="As solicitações dos turistas aparecerão aqui. Você também pode mudar o filtro de situação."
                />
              ) : (
                <div className={styles.reservationList}>
                  {items.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      selected={reservationIds.includes(reservation.id)}
                      onToggle={() =>
                        setReservationIds((ids) =>
                          ids.includes(reservation.id)
                            ? ids.filter((id) => id !== reservation.id)
                            : [...ids, reservation.id],
                        )
                      }
                      participantIds={participantIds}
                      onToggleParticipant={(participantId) =>
                        setParticipantIds((ids) =>
                          ids.includes(participantId)
                            ? ids.filter((id) => id !== participantId)
                            : ids.length < 100
                              ? [...ids, participantId]
                              : ids,
                        )
                      }
                      editable={editable}
                      confirmationExpired={confirmationExpired}
                      boardingOpen={boardingOpen}
                      onBoardGroup={(ids) =>
                        setOperation({
                          kind: "groupBoarding",
                          participantIds: ids,
                          responsibleName: reservation.responsibleName,
                        })
                      }
                      onHistory={() => setHistory(reservation)}
                    />
                  ))}
                </div>
              )}
              <Pagination
                page={page}
                total={reservations.data.total}
                limit={reservations.data.limit}
                onChange={(value) => {
                  clearSelection();
                  setPage(value);
                }}
              />
            </>
          )
        )}
      </section>
      <section className={`${styles.panel} ${styles.closeDeparture}`}>
        <div>
          <h2>
            <CalendarDays size={18} />
            Encerramento da saída
          </h2>
          <p className={styles.muted}>
            {data.status !== "SCHEDULED"
              ? "Esta saída está encerrada e seu histórico foi preservado."
              : "Para concluir: início ocorrido, nenhuma reserva pendente e comparecimento de todos os confirmados registrado."}
          </p>
        </div>
        <div className={styles.actions}>
          <ActionButton
            secondary
            disabled={!editable || data.metrics.boardedParticipants > 0}
            title={
              data.metrics.boardedParticipants > 0
                ? "Não é possível cancelar com passageiros embarcados."
                : undefined
            }
            onClick={() =>
              setOperation({ kind: "departure", status: "CANCELLED" })
            }
          >
            Cancelar saída
          </ActionButton>
          <ActionButton
            disabled={!editable || !canComplete}
            onClick={() =>
              setOperation({ kind: "departure", status: "COMPLETED" })
            }
          >
            Concluir saída
          </ActionButton>
        </div>
      </section>
      {operation && (
        <ConfirmationDialog
          title={operationTitle(operation)}
          description={
            operation.kind === "departure"
              ? operation.status === "CANCELLED"
                ? "Todas as reservas ativas desta saída serão canceladas. A saída não poderá ser reaberta."
                : "A saída será encerrada e não aceitará novas alterações."
              : operation.kind === "groupBoarding"
                ? `${countLabel(operation.participantIds.length, "passageiro sem registro será marcado como embarcado", "passageiros sem registro serão marcados como embarcados")} na reserva de ${operation.responsibleName}. Os registros de quem já embarcou ou está ausente serão preservados.`
                : operation.kind === "reservation"
                  ? `${countLabel(reservationIds.length, "reserva", "reservas")}, com ${countLabel(selectedPeople, "participante", "participantes")}. Toda a seleção será validada; se algum item impedir a ação, nenhuma alteração será aplicada.`
                  : `${countLabel(participantIds.length, "passageiro selecionado", "passageiros selecionados")}. O registro anterior será atualizado e a alteração ficará no histórico.`
          }
          needsReason={Boolean(cancellation)}
          danger={Boolean(cancellation)}
          onClose={() => setOperation(null)}
          onConfirm={performOperation}
        />
      )}
      {history && (
        <ReservationHistory
          departureId={departureId}
          reservationId={history.id}
          responsibleName={history.responsibleName}
          timeZone={data.timeZone}
          onClose={() => setHistory(null)}
        />
      )}
    </>
  );
}
