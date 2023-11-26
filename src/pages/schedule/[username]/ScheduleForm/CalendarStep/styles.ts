import { Box, styled } from "@ignite-ui/react";

export const Container = styled(Box, {
  margin: "$6 auto 0 ",
  padding: 0, // para ter a linha no proximo passo
  display: "grid",
  maxWidth: "100%",
  position: "relative",

  // com calendario fechado
  width: 540,
  gridTemplateColumns: "1fr",
});
