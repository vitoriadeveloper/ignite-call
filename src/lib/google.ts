import { google } from "googleapis";
import { prisma } from "./prisma";
import dayjs from "dayjs";

// confere se o token ja expirou ou não e atualiza a informação
export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: "google",
      user_id: userId,
    },
  });

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  });

  if (!account.expires_at) {
    return auth;
  }

  // para pegar em milissegundos, já que dayjs aceita em mili e nao em seg
  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date());

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken();
    const {
      access_token,
      expiry_date,
      refresh_token,
      scope,
      token_type,
      id_token,
    } = credentials;

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        id_token,
        refresh_token,
        scope,
        token_type,
        // para salvar no banco em segundos
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null,
      },
    });
    auth.setCredentials({
      access_token,
      refresh_token,
      expiry_date,
    });
  }
  return auth;
}
