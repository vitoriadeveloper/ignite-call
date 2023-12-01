import { Text, TextArea, TextInput, Button } from "@ignite-ui/react";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";
import { CalendarBlank, Clock } from "phosphor-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { api } from "@/src/lib/axios";
import { useRouter } from "next/router";

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome precisa no mínimo conter 3 caracteres" }),
  email: z.string().email({ message: "Digite um email válido" }),
  observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;
interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}
export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({ resolver: zodResolver(confirmFormSchema) });
  const router = useRouter();

  const username = String(router.query.username);
  async function handleConfirmScheduling(data: ConfirmFormData) {
    const { name, email, observations } = data;
    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    });

    onCancelConfirmation();
  }

  const date = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const describeTime = dayjs(schedulingDate).format("HH:mm[h]");
  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {date}
        </Text>
        <Text>
          <Clock />
          {describeTime}
        </Text>
      </FormHeader>
      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          crossOrigin={undefined}
          placeholder="Seu nome"
          {...register("name")}
        />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>
      <label>
        <Text size="sm">Endereço de email</Text>
        <TextInput
          crossOrigin={undefined}
          placeholder="johndoe@gmail.com"
          {...register("email")}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register("observations")} />
      </label>
      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
