import { BasicInfoStep } from "./basicInfo-step";
import { EmailStep } from "./email-step";
import { NameStep } from "./name-step";
import { PasswordStep } from "./password-step";

export default function RegisterSteps({
  step = "name",
}: {
  step?: "name" | "email" | "password" | "basicInfo";
}) {
  return (
    <>
      {step === "name" && <NameStep />}
      {step === "basicInfo" && <BasicInfoStep />}
      {step === "email" && <EmailStep />}
      {step === "password" && <PasswordStep />}
    </>
  );
}
