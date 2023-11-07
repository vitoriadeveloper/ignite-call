import { Button, TextInput, Text } from "@ignite-ui/react";
import { ErrorsMessage, Form } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "Deve conter apenas letras de a-z e hifens",
    }) // allows username from a-z in sensitive case
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data;
    await router.push(`/register?username=${username}`);
  }
  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          crossOrigin={undefined}
          size={"sm"}
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register("username")}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <ErrorsMessage>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : "Digite o nome do usuário"}
        </Text>
      </ErrorsMessage>
    </>
  );
}
