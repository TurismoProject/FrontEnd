"use client";

import { useState } from "react";
import type { Page, ReservationEvent } from "../types";
import { departureDate } from "../format";
import { useResource } from "../use-resource";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Pagination,
  StatusBadge,
} from "./shared";
import styles from "../supplier.module.css";

const eventLabels: Record<string, string> = {
  CREATED: "Reserva criada",
  CONFIRMED: "Reserva confirmada",
  CANCELLED: "Reserva cancelada",
  ATTENDANCE_RECORDED: "Comparecimento atualizado",
  DEPARTURE_COMPLETED: "Saída concluída",
  DEPARTURE_CANCELLED: "Saída cancelada",
};

export function ReservationHistory({
  departureId,
  reservationId,
  responsibleName,
  timeZone,
  onClose,
}: {
  departureId: string;
  reservationId: string;
  responsibleName: string;
  timeZone: string;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useResource<Page<ReservationEvent>>(
    `saidas/${departureId}/reservas/${reservationId}/historico?page=${page}&limit=10`,
  );
  return (
    <Modal
      title="Histórico da reserva"
      description={`Alterações da reserva de ${responsibleName}. Horários no fuso ${timeZone}.`}
      onClose={onClose}
    >
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : (
        data && (
          <>
            {!data.items.length ? (
              <EmptyState
                title="Nenhuma alteração"
                description="Os eventos desta reserva aparecerão aqui."
              />
            ) : (
              <ol className={styles.timeline}>
                {data.items.map((event) => (
                  <li key={event.id}>
                    <div className={styles.timelineDot} />
                    <div>
                      <strong>
                        {eventLabels[event.action] || event.action}
                      </strong>
                      <time dateTime={event.createdAt}>
                        {departureDate(event.createdAt, timeZone)}
                      </time>
                      <p className={styles.muted}>
                        {event.actorRole === "Supplier"
                          ? "Fornecedor"
                          : event.actorRole === "User"
                            ? "Turista"
                            : "Administrador"}{" "}
                        ·{" "}
                        <span title={event.actorId}>
                          {event.actorId.slice(0, 8)}
                        </span>
                      </p>
                      {event.details.reason && (
                        <p className={styles.historyReason}>
                          {event.details.reason}
                        </p>
                      )}
                      {event.details.attendance && (
                        <StatusBadge status={event.details.attendance} />
                      )}
                      {event.details.participantCount !== undefined && (
                        <p>{event.details.participantCount} participantes</p>
                      )}
                      {event.details.participantIds && (
                        <p className={styles.muted}>
                          {event.details.participantIds.length} participantes
                          atualizados
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <Pagination
              page={page}
              total={data.total}
              limit={data.limit}
              onChange={setPage}
            />
          </>
        )
      )}
    </Modal>
  );
}
