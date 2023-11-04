import { Heading, Text } from "@ignite-ui/react";
import { Conatiner, Hero, Preview } from "./styles";
import Image from "next/image";
import previewImage from "../../assets/app-preview.png";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";
export default function Home() {
  return (
    <Conatiner>
      <Hero>
        <Heading as="h1">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>
        <ClaimUsernameForm />
      </Hero>
      <Preview>
        <Image
          src={previewImage}
          alt="App Preview"
          height={400}
          quality={100}
          priority
        />
      </Preview>
    </Conatiner>
  );
}
