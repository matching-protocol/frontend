import { Box } from '@mui/material'

export default function Stepper({
  steps,
  current,
  change
}: {
  steps: number
  current: number
  change: (step: number) => void
}) {
  return (
    <Box display="flex" gap={8}>
      {[...Array(steps).keys()].map(step => (
        <Box
          key={step}
          sx={{
            borderRadius: '50%',
            border: '1px solid #161616',
            opacity: step === current ? 1 : 0.4,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: current > step ? 'pointer' : 'auto'
          }}
          onClick={() => current > step && change(step)}
        >
          {step + 1}
        </Box>
      ))}
    </Box>
  )
}
