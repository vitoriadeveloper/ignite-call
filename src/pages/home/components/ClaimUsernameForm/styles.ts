import { Box, styled, Text } from "@ignite-ui/react";

export const Form = styled(Box, {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "$2",
  marginTop: "$4",
  padding: "$4",

  "@media(max-width:600px)": {
    gridTemplateColums: "1fr",
  },
});

export const ErrorsMessage = styled("div", {
  marginTop: "$2",
  [`> ${Text}`]: {
    color: "$gray400",
  },
});
