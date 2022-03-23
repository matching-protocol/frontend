import { styled } from '@mui/material'

const StyledSvg = styled('svg')({ cursor: 'pointer', borderRadius: '50%' })

export default function SwitchButton({ disabled }: { disabled?: boolean }) {
  return (
    <StyledSvg
      sx={{
        '&:hover circle': {
          strokeOpacity: disabled ? 0.4 : 1
        }
      }}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <circle cx="16" cy="16" r="16" fill="black" />
      {/* <circle cx="16" cy="16" r="15.5" stroke="white" /> */}
      <path
        d="M17.3576 8.00038C17.1951 7.99554 17.0352 8.03738 16.9001 8.11999C16.765 8.2026 16.6616 8.32184 16.6045 8.46095C16.5473 8.60006 16.5393 8.75204 16.5815 8.89553C16.6238 9.03903 16.7141 9.16681 16.8398 9.26093L20.6856 12.272H8.79457C8.69106 12.27 8.58813 12.2868 8.49183 12.3215C8.39553 12.3563 8.3078 12.4084 8.23379 12.4746C8.15978 12.5408 8.10097 12.6198 8.06083 12.7071C8.02068 12.7944 8 12.8881 8 12.9827C8 13.0774 8.02068 13.1712 8.06083 13.2584C8.10097 13.3457 8.15978 13.4247 8.23379 13.4909C8.3078 13.5571 8.39553 13.6092 8.49183 13.644C8.58813 13.6788 8.69106 13.6956 8.79457 13.6935H22.7914C22.9495 13.6926 23.1035 13.6476 23.2329 13.5646C23.3622 13.4816 23.4609 13.3646 23.5156 13.229C23.5704 13.0934 23.5787 12.9458 23.5393 12.8058C23.5 12.6658 23.4149 12.5402 23.2955 12.4455L17.8556 8.17951C17.718 8.06778 17.5415 8.00434 17.3576 8.00038ZM8.79457 18.3158C8.63652 18.3168 8.48254 18.3617 8.35316 18.4447C8.22377 18.5277 8.12513 18.6448 8.07038 18.7804C8.01562 18.916 8.00736 19.0635 8.04669 19.2035C8.08602 19.3435 8.17107 19.4692 8.29051 19.5638L13.7365 23.8298C13.8142 23.8904 13.9041 23.9364 14.0013 23.9653C14.0984 23.9941 14.2007 24.0051 14.3025 23.9978C14.4043 23.9904 14.5035 23.9649 14.5945 23.9225C14.6855 23.88 14.7664 23.8217 14.8327 23.7507C14.899 23.6797 14.9493 23.5974 14.9809 23.5086C15.0124 23.4198 15.0245 23.3262 15.0165 23.2332C15.0084 23.1401 14.9804 23.0493 14.934 22.9661C14.8877 22.883 14.8238 22.809 14.7462 22.7484L10.9019 19.7373H22.7914C22.895 19.7394 22.998 19.7227 23.0944 19.6879C23.1908 19.6532 23.2786 19.6012 23.3526 19.535C23.4267 19.4687 23.4856 19.3897 23.5258 19.3024C23.566 19.2151 23.5867 19.1213 23.5867 19.0266C23.5867 18.9319 23.566 18.838 23.5258 18.7507C23.4856 18.6634 23.4267 18.5844 23.3526 18.5181C23.2786 18.4519 23.1908 18.3999 23.0944 18.3652C22.998 18.3304 22.895 18.3137 22.7914 18.3158H8.79457Z"
        fill={disabled ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF'}
      />
    </StyledSvg>
  )
}
