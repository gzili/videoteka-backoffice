import { forwardRef } from 'react';
import { Box } from "@mui/material";

export const ObjectField = forwardRef((props, ref) => {
  const { label, children } = props;

  return (
      <Box
          sx={{
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderRadius: "4px",
            position: "relative",
            minHeight: "48px",
            py: "16px",
            px: "14px",
            '&:hover': {
              borderColor: "black",
            }
          }}
      >
        <Box
            sx={{
              position: "absolute",
              top: "-8px",
              left: "8px",
              fontSize: "0.75em",
              backgroundColor: "white",
              px: "5px",
              lineHeight: "1.2",
            }}
        >
          {label}
        </Box>
        <Box>
          {children}
        </Box>
      </Box>
  );
});