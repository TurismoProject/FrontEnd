"use client";

import { useState } from "react";
import { SlidersHorizontal, RotateCw } from "lucide-react";
import { queryString } from "../api";
import { departurePeriod, validatePeriod } from "../format";
import type { Departure, DepartureStatus, Page } from "../types";
import { useResource } from "../use-resource";
import {
  ActionButton,
  ErrorState,
  LoadingState,
  PageHeading,
  Pagination,
} from "./shared";
import { DepartureTable } from "./departure-table";
import styles from "../supplier.module.css";

export function DeparturesPage() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "",
    productId: "",
  });
  const [draft, setDraft] = useState(filters);
  const [validation, setValidation] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useResource<Page<Departure>>(
    `saidas?${queryString({ ...departurePeriod(filters.from, filters.to), status: filters.status, productId: filters.productId, page, limit: 20 })}`,
  );

  return (
    <>
      <PageHeading
        eyebrow="SUA OPERAÇÃO"
        title="Reservas"
        description="Encontre uma saída para gerenciar reservas e acompanhar os passageiros."
      >
        <ActionButton secondary onClick={reload} disabled={loading}>
          <RotateCw size={16} />
          Atualizar
        </ActionButton>
      </PageHeading>
      <section className={styles.panel}>
        <div className={styles.sectionHeading}>
          <div>
            <h2>Saídas dos passeios</h2>
            <p className={styles.muted}>
              Datas dos filtros no fuso de Maceió (UTC−3).
            </p>
          </div>
          <SlidersHorizontal size={20} />
        </div>
        <form
          className={styles.filters}
          onSubmit={(event) => {
            event.preventDefault();
            const message = validatePeriod(draft.from, draft.to);
            setValidation(message);
            if (!message) {
              setPage(1);
              setFilters(draft);
            }
          }}
        >
          <label className={styles.field}>
            A partir de
            <input
              type="date"
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
              value={draft.to}
              min={draft.from || undefined}
              onChange={(event) =>
                setDraft({ ...draft, to: event.target.value })
              }
            />
          </label>
          <label className={styles.field}>
            Situação
            <select
              value={draft.status}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  status: event.target.value as DepartureStatus | "",
                })
              }
            >
              <option value="">Todas as situações</option>
              <option value="SCHEDULED">Agendadas</option>
              <option value="COMPLETED">Concluídas</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </label>
          <label className={styles.field}>
            ID do passeio <span className={styles.optional}>(opcional)</span>
            <input
              placeholder="UUID do passeio"
              value={draft.productId}
              pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              title="Informe o UUID do passeio"
              onChange={(event) =>
                setDraft({ ...draft, productId: event.target.value })
              }
            />
          </label>
          <div className={styles.filterActions}>
            <ActionButton>Filtrar</ActionButton>
            <ActionButton
              secondary
              type="button"
              onClick={() => {
                const empty = { from: "", to: "", status: "", productId: "" };
                setDraft(empty);
                setFilters(empty);
                setPage(1);
                setValidation("");
              }}
            >
              Limpar
            </ActionButton>
          </div>
        </form>
        {validation && <ErrorState message={validation} />}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : (
          data && (
            <>
              <DepartureTable items={data.items} />
              <Pagination
                page={page}
                total={data.total}
                limit={data.limit}
                onChange={setPage}
              />
            </>
          )
        )}
      </section>
      <p className={styles.pageNote}>
        Reservas pendentes são solicitações de confirmação. Apenas participantes
        de reservas confirmadas ocupam vagas.
      </p>
    </>
  );
}
