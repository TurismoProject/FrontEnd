import { Check, History, Users } from "lucide-react";
import type { Reservation } from "../types";
import { countLabel, currency } from "../format";
import { ActionButton, StatusBadge } from "./shared";
import styles from "../supplier.module.css";

export function ReservationCard({
  reservation,
  selected,
  onToggle,
  participantIds,
  onToggleParticipant,
  editable,
  confirmationExpired,
  boardingOpen,
  onBoardGroup,
  onHistory,
}: {
  reservation: Reservation;
  selected: boolean;
  onToggle: () => void;
  participantIds: string[];
  onToggleParticipant: (id: string) => void;
  editable: boolean;
  confirmationExpired: boolean;
  boardingOpen: boolean;
  onBoardGroup: (participantIds: string[]) => void;
  onHistory: () => void;
}) {
  const selectable = editable && reservation.status !== "CANCELLED";
  const unrecordedIds = reservation.participants
    .filter((participant) => participant.attendance === "NOT_RECORDED")
    .map((participant) => participant.id);
  const groupBoardingHint = !editable
    ? "Esta saída está encerrada."
    : reservation.status !== "CONFIRMED"
      ? "O embarque está disponível apenas para reservas confirmadas."
      : !boardingOpen
        ? "O embarque fica disponível duas horas antes do início."
        : !unrecordedIds.length
          ? "Todos os passageiros deste grupo já têm comparecimento registrado."
          : unrecordedIds.length > 100
            ? "Selecione os passageiros em grupos de até 100 por operação."
            : "";
  const participantHintId = `passenger-selection-${reservation.id}`;
  const participantSelectionHint = !editable
    ? "Esta saída está encerrada. O comparecimento dos passageiros não pode ser alterado."
    : reservation.status === "PENDING"
      ? confirmationExpired
        ? "Esta reserva ficou pendente após o horário de início. Não é possível confirmá-la nem registrar o comparecimento de seus passageiros."
        : "Confirme esta reserva para selecionar passageiros e registrar o comparecimento."
      : reservation.status === "CANCELLED"
        ? "Passageiros de reservas canceladas não podem ser selecionados."
        : participantIds.length >= 100
          ? "Limite de 100 passageiros por operação. Desmarque um passageiro para selecionar outro."
          : "";
  return (
    <article
      className={`${styles.reservationCard} ${selected ? styles.selectedCard : ""}`}
    >
      <div className={styles.reservationHeader}>
        <div className={styles.responsible}>
          <input
            type="checkbox"
            aria-label={`Selecionar reserva de ${reservation.responsibleName}, ${reservation.id.slice(0, 8)}`}
            checked={selected}
            onChange={onToggle}
            disabled={!selectable}
          />
          <div>
            <span className={styles.eyebrow}>RESPONSÁVEL PELA RESERVA</span>
            <h3>{reservation.responsibleName}</h3>
            <span className={styles.tableDetail}>
              Reserva #{reservation.id.slice(0, 8)}
            </span>
          </div>
        </div>
        <StatusBadge status={reservation.status} />
      </div>
      <div className={styles.reservationMeta}>
        <span>
          <Users size={15} />
          {countLabel(
            reservation.participants.length,
            "participante",
            "participantes",
          )}
        </span>
        <strong>{currency(reservation.totalPrice)}</strong>
        <div className={styles.reservationActions}>
          <ActionButton
            disabled={Boolean(groupBoardingHint)}
            title={groupBoardingHint || undefined}
            onClick={() => onBoardGroup(unrecordedIds)}
          >
            <Check size={15} />
            Embarcar grupo
          </ActionButton>
          <ActionButton secondary onClick={onHistory}>
            <History size={15} />
            Histórico
          </ActionButton>
        </div>
      </div>
      {reservation.cancellationReason && (
        <p className={styles.cancellationReason}>
          Motivo: {reservation.cancellationReason}
        </p>
      )}
      <details className={styles.passengers} open>
        <summary>
          Passageiros desta reserva{" "}
          <span>({reservation.participants.length})</span>
        </summary>
        {participantSelectionHint && (
          <p id={participantHintId} className={styles.participantHint}>
            {participantSelectionHint}
          </p>
        )}
        <ul>
          {reservation.participants.map((participant) => (
            <li key={participant.id}>
              <label>
                <input
                  type="checkbox"
                  aria-label={`Selecionar passageiro ${participant.name}, ${participant.id.slice(0, 8)}`}
                  aria-describedby={
                    participantSelectionHint ? participantHintId : undefined
                  }
                  checked={participantIds.includes(participant.id)}
                  onChange={() => onToggleParticipant(participant.id)}
                  disabled={
                    !editable ||
                    reservation.status !== "CONFIRMED" ||
                    (participantIds.length >= 100 &&
                      !participantIds.includes(participant.id))
                  }
                />
                <span>{participant.name}</span>
              </label>
              <StatusBadge status={participant.attendance} />
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}
