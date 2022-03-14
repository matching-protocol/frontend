import LogoText from 'components/LogoText'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'

export function FilterButton({ onClick, selected }: { onClick: () => void; selected: boolean }) {
  if (selected) {
    return (
      <Button width="152px" height="60px" onClick={onClick} borderRadius={1.6}>
        <LogoText logo={<FilterIcon color="#FFFFFF" />} text="Filter" />
      </Button>
    )
  }

  return (
    <StyledOutlineButton width={152} height={60} onClick={onClick}>
      <LogoText logo={<FilterIcon />} text="Filter" />
    </StyledOutlineButton>
  )
}

export function CardButton({ onClick, selected }: { onClick: () => void; selected: boolean }) {
  return (
    <StyledOutlineButton width={60} height={60} selected={selected} onClick={onClick}>
      <CardModeIcon />
    </StyledOutlineButton>
  )
}

export function TableButton({ onClick, selected }: { onClick: () => void; selected: boolean }) {
  return (
    <StyledOutlineButton width={60} height={60} selected={selected} onClick={onClick}>
      <TableModeIcon />
    </StyledOutlineButton>
  )
}

function StyledOutlineButton({
  children,
  width,
  height,
  selected,
  onClick
}: {
  children: React.ReactNode
  width: number
  height: number
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <OutlineButton
      width={width}
      height={height}
      style={{
        '& > *': { opacity: selected ? 1 : 0.5 },
        '&:hover > *': {
          opacity: 1
        },
        '&:hover svg path, &:hover svg circle': {
          stroke: '#fff'
        },
        '&:hover span': {
          color: '#fff'
        }
      }}
      onClick={onClick}
    >
      {children}
    </OutlineButton>
  )
}

function FilterIcon({ color }: { color?: string }) {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <path d="M3 17L3 8" stroke={color || '#161616'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 4L3 1" stroke={color || '#161616'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M11 10L11 1"
        stroke={color || '#161616'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 17L11 14"
        stroke={color || '#161616'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="12" r="2" transform="rotate(-90 11 12)" stroke={color || '#161616'} strokeWidth="1.8" />
      <circle cx="3" cy="6" r="2" transform="rotate(-90 3 6)" stroke={color || '#161616'} strokeWidth="1.8" />
    </svg>
  )
}

function TableModeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M1 14H17V16C17 16.5523 16.5523 17 16 17H2C1.44772 17 1 16.5523 1 16V14Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 7.5H17V10.5H1V7.5Z" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17 4L1 4V2C1 1.44772 1.44771 1 2 1L16 1C16.5523 1 17 1.44772 17 2V4Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CardModeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11 11H17V16C17 16.5523 16.5523 17 16 17H12C11.4477 17 11 16.5523 11 16V11Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 1H7V6C7 6.55228 6.55228 7 6 7H2C1.44772 7 1 6.55228 1 6V1Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 11H7V16C7 16.5523 6.55228 17 6 17H2C1.44772 17 1 16.5523 1 16V11Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 1H17V6C17 6.55228 16.5523 7 16 7H12C11.4477 7 11 6.55228 11 6V1Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
