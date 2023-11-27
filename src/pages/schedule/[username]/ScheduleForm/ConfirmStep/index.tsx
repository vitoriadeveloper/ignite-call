import { Text, TextArea, TextInput, Button } from "@ignite-ui/react";
import { ConfirmForm, FormActions, FormHeader } from "./styles";
import { CalendarBlank, Clock } from "phosphor-react";

export function ConfirmStep() {
  return (
    <ConfirmForm as="form">
      <FormHeader>
        <Text>
          <CalendarBlank />
          22 de setembro de 2022
        </Text>
        <Text>
          <Clock />
        </Text>
      </FormHeader>
      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput crossOrigin={undefined} placeholder="Seu nome" />
      </label>
      <label>
        <Text size="sm">Endereço de email</Text>
        <TextInput crossOrigin={undefined} placeholder="johndoe@gmail.com" />
      </label>
      <label>
        <Text size="sm">Observações</Text>
        <TextArea />
      </label>
      <FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit">Confirmar</Button>
      </FormActions>
    </ConfirmForm>
  );
}
