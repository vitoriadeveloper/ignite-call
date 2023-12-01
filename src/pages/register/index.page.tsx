import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/src/lib/axios";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Mínimo de 3 caracteres" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "Deve conter apenas letras de a-z e hifens",
    }) // allows username from a-z in sensitive case
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: "o nome precisa de no mínimo de 3 caracteres" }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerFormSchema) });

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      await router.push("/register/connect-calendar");
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }

      console.error(err);
    }
  }
  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query?.username));
    }
  }, [router.query.username, setValue]);
  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={1} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size={"sm"}>Nome de usuário</Text>
            <TextInput
              crossOrigin={undefined}
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register("username")}
            />
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size={"sm"}>Nome completo</Text>
            <TextInput
              crossOrigin={undefined}
              placeholder="seu-nome"
              {...register("name")}
            />

            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  );
}
