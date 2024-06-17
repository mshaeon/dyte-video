import { Box } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  isDisabled: boolean;
};

export const DisableToggle = ({ children, isDisabled }: Props) => {
  if (!isDisabled) {
    return <>{children}</>;
  }

  return (
    <Box
      className="disable-toggle"
      onClick={(event) => {
        event.stopPropagation();
      }}
      sx={{
        opacity: 0.5,
        cursor: "not-allowed",
        ".dissable-toggle": {
          pointerEvents: "none",
        },
      }}
    >
      {children}
    </Box>
  );
};
