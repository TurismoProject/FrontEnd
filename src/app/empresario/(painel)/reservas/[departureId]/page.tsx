import { Suspense } from "react";
import { DepartureDetailsPage } from "@/features/supplier/components/departure-details-page";
import { LoadingState } from "@/features/supplier/components/shared";

export default function Page({ params }: { params: { departureId: string } }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <DepartureDetailsPage
        key={params.departureId}
        departureId={params.departureId}
      />
    </Suspense>
  );
}
