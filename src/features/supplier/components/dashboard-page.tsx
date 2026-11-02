"use client";

import Link from "next/link";
import Image from "next/image";
import brandIcon from "@/../public/iconebranco.png";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Clock3,
  Ticket,
  Users,
} from "lucide-react";
import type { Dashboard, Departure, Page } from "../types";
import { queryString } from "../api";
import { countLabel, displayDate, localDate, validatePeriod } from "../format";
import { useResource } from "../use-resource";
import { useSupplier } from "./supplier-shell";
import {
  ActionButton,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
} from "./shared";
import { DepartureTable } from "./departure-table";
import styles from "../supplier.module.css";

export function DashboardPage() {
  const supplier = useSupplier();
  const today = localDate();
  const [period, setPeriod] = useState({
    from: `${today.slice(0, 7)}-01`,
    to: today,
  });
  const [draft, setDraft] = useState(period);
  const [validation, setValidation] = useState("");
  const dashboard = useResource<Dashboard>(
    `painel/reservas?${queryString(period)}`,
  );
  const upcoming = useResource<Page<Departure>>(
    `saidas?${queryString({ status: "SCHEDULED", startsFrom: `${today}T00:00:00-03:00`, limit: 5 })}`,
  );
  const totals = dashboard.data?.totals;
  const cards = totals
    ? [
        {
          label: "Reservas no período",
          value: totals.totalReservations,
          detail: countLabel(
            totals.confirmedReservations,
            "confirmada",
            "confirmadas",
          ),
          icon: Ticket,
        },
        {
          label: "Aguardando confirmação",
          value: totals.pendingReservations,
          detail: countLabel(
            totals.pendingParticipants,
            "participante solicitado",
            "participantes solicitados",
          ),
          icon: Clock3,
        },
        {
          label: "Participantes confirmados",
          value: totals.confirmedParticipants,
          detail: `${countLabel(totals.boardedParticipants, "embarcado", "embarcados")} · ${countLabel(totals.noShowParticipants, "ausente", "ausentes")}`,
          icon: Users,
        },
        {
          label: "Participações realizadas",
          value: totals.completedParticipants,
          detail: countLabel(
            totals.completedDepartures,
            "saída concluída",
            "saídas concluídas",
          ),
          icon: CircleCheck,
        },
      ]
    : [];

  return (
    <>
      <PageHeading
        eyebrow="VISÃO GERAL"
        title={`Olá, ${supplier.name}.`}
        description="Um olhar sobre suas reservas e as próximas experiências."
      />
      <div className={styles.welcomeBanner}>
        <div>
          <span className={styles.storyTag}>CADA PASSAGEIRO CONTA</span>
          <h2>
            Seu próximo passeio começa
            <br />
            com uma boa organização.
          </h2>
          <p>Acompanhe suas saídas e prepare cada embarque.</p>
          <Link className={styles.bannerLink} href="/empresario/reservas">
            Gerenciar reservas
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className={styles.bannerArt} aria-hidden="true">
          <Image src={brandIcon} alt="" sizes="245px" />
        </div>
      </div>
      <section aria-labelledby="resumo-title">
        <div className={styles.summaryHeading}>
          <div>
            <h2 id="resumo-title">Sua operação em números</h2>
            <p className={styles.muted}>
              Resultados pela data dos passeios, no fuso de cada saída.
            </p>
          </div>
          <form
            className={styles.periodForm}
            onSubmit={(event) => {
              event.preventDefault();
              const message = validatePeriod(draft.from, draft.to, 93);
              setValidation(message);
              if (!message) setPeriod(draft);
            }}
          >
            <label className={styles.field}>
              De
              <input
                type="date"
                required
                value={draft.from}
                onChange={(event) =>
                  setDraft({ ...draft, from: event.target.value })
                }
              />
            </label>
            <label className={styles.field}>
              Até
              <input
                type="date"
                required
                min={draft.from}
                value={draft.to}
                onChange={(event) =>
                  setDraft({ ...draft, to: event.target.value })
                }
              />
            </label>
            <ActionButton secondary>Aplicar</ActionButton>
          </form>
        </div>
        {validation && <ErrorState message={validation} />}
        {dashboard.loading ? (
          <LoadingState label="Carregando indicadores…" />
        ) : dashboard.error ? (
          <ErrorState message={dashboard.error} retry={dashboard.reload} />
        ) : (
          <>
            <p className={styles.appliedPeriod}>
              {displayDate(period.from)} — {displayDate(period.to)}
            </p>
            <div className={styles.metricGrid}>
              {cards.map(({ label, value, detail, icon: Icon }) => (
                <article className={styles.metricCard} key={label}>
                  <div className={styles.metricTitle}>
                    {label}
                    <Icon size={18} />
                  </div>
                  <strong className={styles.metricValue}>{value}</strong>
                  <span className={styles.muted}>{detail}</span>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
      <section className={styles.panel}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Agenda de saídas</h2>
            <p className={styles.muted}>
              As primeiras saídas agendadas a partir de hoje, incluindo as já
              iniciadas.
            </p>
          </div>
          <Link className={styles.inlineLink} href="/empresario/reservas">
            Ver todas
            <ArrowRight size={15} />
          </Link>
        </div>
        {upcoming.loading ? (
          <LoadingState />
        ) : upcoming.error ? (
          <ErrorState message={upcoming.error} retry={upcoming.reload} />
        ) : (
          upcoming.data && <DepartureTable items={upcoming.data.items} />
        )}
      </section>
      {dashboard.data && (
        <section className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>Resultados por passeio e dia</h2>
              <p className={styles.muted}>
                Participações realizadas contam embarcados em saídas concluídas.
              </p>
            </div>
            <CalendarDays size={20} />
          </div>
          {dashboard.data.byDateAndProduct.length === 0 ? (
            <EmptyState
              title="Seu histórico começa aqui"
              description="Os resultados aparecerão conforme as saídas e reservas forem registradas no período."
            />
          ) : (
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Passeio</th>
                    <th>Dia</th>
                    <th>Pendentes</th>
                    <th>Confirmadas</th>
                    <th>Canceladas</th>
                    <th>Participações realizadas</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.data.byDateAndProduct.map((group) => (
                    <tr key={`${group.date}:${group.productId}`}>
                      <td>
                        <strong>{group.productName}</strong>
                      </td>
                      <td>{displayDate(group.date)}</td>
                      <td>{group.totals.pendingReservations}</td>
                      <td>{group.totals.confirmedReservations}</td>
                      <td>{group.totals.cancelledReservations}</td>
                      <td>{group.totals.completedParticipants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      <p className={styles.pageNote}>
        Os indicadores representam reservas feitas pela plataforma. Uma pessoa
        em duas saídas conta como duas participações.
      </p>
    </>
  );
}
