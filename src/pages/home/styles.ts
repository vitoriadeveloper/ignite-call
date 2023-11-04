import { styled, Heading, Text } from "@ignite-ui/react";

export const Conatiner = styled("div", {
  // 1160 is the size of the container and 2 its because we don't need a margin on the right side of the container
  maxWidth: "calc(100vw - (100vw - 1160px)/2)",
  // will make the element go all the way to the right only if it has a smaller width
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "$20",
  height: "100vh",
});

export const Hero = styled("div", {
  maxWidth: 480,
  padding: "0 $10",

  [`> ${Heading}`]: {
    "@media (max-width:600px)": {
      fontSize: "$6xl",
    },
  },
  [`> ${Text}`]: {
    marginTop: "$2",
    color: "$gray200",
  },
});

export const Preview = styled("div", {
  paddingRight: "$8",
  overflow: "hidden",
  "@media (max-width:600px)": {
    display: "none",
  },
});
