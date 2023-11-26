import { Avatar, Heading, Text } from "@ignite-ui/react";
import { Container, UserHeader } from "./styles";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "@/src/lib/prisma";
import { ScheduleForm } from "./ScheduleForm";
interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}
export default function Schedule({ user }: Readonly<ScheduleProps>) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}e</Text>
      </UserHeader>
      <ScheduleForm />
    </Container>
  );
}

// como é uma pag dinamica(pelo username do user), precisamos informar ao next o

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // para gerar so quando o usuario acessar a pag
    fallback: "blocking", // so irá mostarr quando tiver pronto
  };
};

// executado no lado do servidor
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};
