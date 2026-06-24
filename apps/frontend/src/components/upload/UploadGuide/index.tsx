import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { copy } from "@/constants/copy";

export function UploadGuide() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        borderColor: "#DADCE0",
        background: "#FAFAFA",
      }}
    >
      <Stepper alternativeLabel activeStep={-1} sx={{ gap: 0 }}>
        {copy.upload.guideSteps.map((step) => (
          <Step key={step.title}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": { mt: 1 },
                "& .MuiStepIcon-root": { width: 36, height: 36, color: "#1558B0" },
                "& .MuiStepIcon-root.Mui-active": { color: "#1558B0" },
                "& .MuiStepIcon-text": { fontSize: "13px", fontWeight: 700 },
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.primary"
                sx={{ mt: 0.5, fontWeight: 600 }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, lineHeight: 1.6, wordBreak: "keep-all", display: "block" }}
              >
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}
