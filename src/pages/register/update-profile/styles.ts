import { styled, Box, Text } from "@ignite-ui/react";

export const ProfileBox = styled(Box, {
  marginTop: "$6",
  flexDirection: "column",
  display: "flex",
  gap: "$4",

  label: {
    flexDirection: "column",
    display: "flex",
    gap: "$2",
  },
});

export const FormAnnotation = styled(Text, {
  color: "$gray200",
});
