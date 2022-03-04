import { Box } from '@mui/material'

export default function Stepper({ steps, current }: { steps: number; current: number }) {
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
            justifyContent: 'center'
          }}
        >
          {step + 1}
        </Box>
      ))}
    </Box>
  )
}
