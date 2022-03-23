import { useCallback } from 'react'
import { Tabs as MuiTabs, Tab } from '@mui/material'

export default function Tabs({
  titles,
  current,
  onChange
}: {
  titles: string[]
  current: number
  onChange: (val: number) => void
  // onChange?: ((event: SyntheticEvent<Element, Event>, value: any) => void
}) {
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<any>, value: any) => {
      onChange(value)
    },
    [onChange]
  )

  return (
    <MuiTabs value={current} onChange={handleOnChange} sx={{ '& .MuiTabs-indicator': { display: 'none' } }} centered>
      {titles.map((tab, idx) => (
        <Tab
          disableRipple
          key={idx}
          label={tab}
          sx={{
            textTransform: 'none',
            padding: '0 20px',
            fontSize: 20,
            color: 'rgba(0,0,0,.4)',
            '&.Mui-selected': {
              opacity: 1
            },
            '&:hover': {
              color: 'rgba(0,0,0,.8)'
            }
          }}
        />
      ))}
    </MuiTabs>
  )
}
