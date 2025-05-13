import { BasicInfoStep } from "./basicInfo-step";
import { BirthdayStep } from "./birthday-step";
import { EmailStep } from "./email-step";
import { NameStep } from "./name-step";
import { PasswordStep } from "./password-step";

export default function RegisterSteps({
  step = "name",
}: {
  step?: "name" | "email" | "password" | "birthday" | "basicInfo";
}) {
  return (
    <>
      {step === "name" && <NameStep />}
      {step === "basicInfo" && <BasicInfoStep />}
      {step === "email" && <EmailStep />}
      {step === "password" && <PasswordStep />}
      {step === "birthday" && <BirthdayStep />}
    </>
  );
}
