import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Departure } from "../types";
import { countLabel, currency, departureDate } from "../format";
import { queryString } from "../api";
import { EmptyState, StatusBadge } from "./shared";
import styles from "../supplier.module.css";

/** O contexto da saída evita percorrer o catálogo ao abrir os detalhes pelo link. */
export function departureHref(departure: Departure) {
  return `/empresario/reservas/${departure.id}?${queryString({ productId: departure.productId, startsAt: departure.startsAt })}`;
}

export function DepartureTable({ items }: { items: Departure[] }) {
  if (!items.length)
    return (
      <EmptyState
        title="Nenhuma saída encontrada"
        description="As saídas cadastradas aparecerão aqui. Experimente ajustar os filtros."
      />
    );
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Passeio / saída</th>
            <th>Situação</th>
            <th>Reservas</th>
            <th>Ocupação confirmada</th>
            <th>
              <span className={styles.srOnly}>Abrir saída</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((departure) => (
            <tr key={departure.id}>
              <td>
                <Link
                  className={styles.tourName}
                  href={departureHref(departure)}
                >
                  {departure.product.name}
                </Link>
                <span className={styles.tableDetail}>
                  <CalendarDays size={13} />
                  {departureDate(departure.startsAt, departure.timeZone)}
                </span>
                <span className={styles.tableDetail}>
                  {currency(departure.pricePerPerson)} / pessoa
                </span>
              </td>
              <td>
                <StatusBadge status={departure.status} />
              </td>
              <td>
                <strong>{departure.metrics.totalReservations}</strong>
                <span className={styles.tableDetail}>
                  {countLabel(
                    departure.metrics.pendingReservations,
                    "pendente",
                    "pendentes",
                  )}
                </span>
              </td>
              <td>
                <div className={styles.capacityLabel}>
                  <strong>
                    {departure.metrics.confirmedParticipants}
                    <span> / {departure.capacity}</span>
                  </strong>
                  <span>
                    {departure.acceptsReservations
                      ? `${departure.availableSeats} vagas`
                      : "Reservas fechadas"}
                  </span>
                </div>
                <meter
                  className={styles.capacityMeter}
                  min={0}
                  max={departure.capacity}
                  value={departure.metrics.confirmedParticipants}
                  aria-label={`Ocupação de ${departure.product.name}`}
                />
              </td>
              <td>
                <Link
                  href={departureHref(departure)}
                  className={styles.openLink}
                  aria-label={`Ver reservas de ${departure.product.name}`}
                >
                  <ArrowUpRight size={19} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
