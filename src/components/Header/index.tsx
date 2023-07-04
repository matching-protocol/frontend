import { useMemo, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import {
  AppBar,
  Box,
  styled,
  // Typography,
  // useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography
} from '@mui/material'
import theme, { HideOnMobile } from 'theme/index'
import Image from 'components/Image'
import BrandLogo from 'assets/svg/match_logo.svg'
import { routes } from 'constants/routes'
import MobileHeader from './MobileHeader'
import Button from 'components/Button/Button'
import { ChainList } from 'constants/chain'
import SwapSelect from 'components/Swap/SwapSelect'
import Web3Status from './Web3Status'
import MarketIcon from 'assets/images/market.png'
import AccountIcon from 'assets/images/account-lg.png'
import StatIcon from 'assets/images/statistics.png'
import HelpIcon from 'assets/images/help.png'
import { ExternalLink } from 'theme/components'
import { useHistory } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useWalletModalToggle } from 'state/application/hooks'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
  icon?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  { title: 'Market', route: routes.market, icon: <Image src={MarketIcon} /> },
  { title: 'Account', route: routes.account, icon: <Image src={AccountIcon} width="24px" /> },
  { title: 'Statistics', route: routes.stat, icon: <Image src={StatIcon} /> },
  { title: 'Help', route: routes.help, icon: <Image src={HelpIcon} /> }
]

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  height: theme.height.header,
  borderBottom: '1px solid #00000020',
  backgroundColor: theme.palette.background.default,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 60px 00 40px',
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    top: 'unset',
    borderTop: '1px solid ' + theme.bgColor.bg4,
    justifyContent: 'center'
  },
  '& .link': {
    textDecoration: 'none',
    fontSize: 14,
    color: theme.palette.text.primary,
    opacity: 0.5,
    marginRight: 28,
    '&.active': {
      opacity: 1
    },
    '&:hover': {
      opacity: 1
    }
  }
}))

const MainLogo = styled(NavLink)({
  '& img': {
    // width: 180.8,
    height: 30
  },
  '&:hover': {
    cursor: 'pointer'
  }
})

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  opacity: 0.6,
  display: 'flex',
  alignItems: 'center',
  filter: 'grayscale(1)',
  '&.active': {
    opacity: 1,
    filter: 'unset',
    '& svg': {
      stroke: theme.palette.primary.main
    },
    '& .filledSvg': {
      fill: theme.palette.primary.main,
      stroke: 'none'
    }
  },
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const StyledExternalLink = styled(ExternalLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  opacity: 0.6,
  display: 'flex',
  alignItems: 'center',
  '&.active': {
    opacity: 1,
    '& svg': {
      stroke: theme.palette.primary.main
    },
    '& .filledSvg': {
      fill: theme.palette.primary.main,
      stroke: 'none'
    }
  },
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// const LinksWrapper = muiStyled('div')({
//   marginLeft: 60.2
// })

export default function Header() {
  const history = useHistory()
  const { chainId, library, account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const selectedChain = useMemo(() => {
    if (!chainId) return undefined
    for (const item of ChainList) {
      if (chainId === item.id) return item
    }
    return undefined
  }, [chainId])

  const onOffer = useCallback(() => {
    history.push(routes.SameMakeOffer)
  }, [history])

  const drawer = useMemo(
    () => (
      <Box
        sx={{
          padding: '115px 44px',
          minHeight: '100%'
        }}
        gridTemplateRows="auto auto auto 1fr"
        display="grid"
        justifyContent="space-between"
        gap="80px"
      >
        <List>
          {Tabs.map(({ title, route, icon, link }, idx) => (
            <ListItem key={title} sx={{ padding: '12px 0' }}>
              {link ? (
                <StyledExternalLink href={link}>
                  <ListItemIcon sx={{ color: 'currentColor', minWidth: 40 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={title}
                    primaryTypographyProps={{
                      sx: { fontSize: '16px' }
                    }}
                  />
                </StyledExternalLink>
              ) : (
                <StyledNavLink
                  key={title + idx}
                  id={`${route}-nav-link`}
                  to={route ?? ''}
                  onClick={() => {}}
                  className="link"
                >
                  <ListItemIcon sx={{ color: 'currentColor', minWidth: 40 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={title}
                    primaryTypographyProps={{
                      sx: { fontSize: '16px', fontWeight: 500 }
                    }}
                  />
                </StyledNavLink>
              )}
            </ListItem>
          ))}
        </List>
        <Box sx={{ position: 'fixed', bottom: '30px' }}>
          <Web3Status />
        </Box>
        <Box sx={{ opacity: 0 }}>1</Box>
      </Box>
    ),
    []
  )

  return (
    <>
      <MobileHeader />
      <StyledAppBar>
        <HideOnMobile breakpoint="md">
          <Box display="flex" alignItems="center">
            <MainLogo id={'logo'} to={'/'}>
              <Image src={BrandLogo} alt={'brand-logo'} />
            </MainLogo>
            <Typography
              sx={{
                marginLeft: 10
              }}
              color={theme.palette.primary.main}
              variant="h6"
            >
              Match DEX
            </Typography>
            {/* <LinksWrapper>
              {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
                subTab ? (
                  <PlainSelect placeholder={title} key={title + idx}>
                    {subTab.map((sub, idx) =>
                      sub.link ? (
                        <MenuItem key={sub.link + idx}>
                          <ExternalLink href={sub.link} className={'link'}>
                            {sub.titleContent ?? sub.title}
                          </ExternalLink>
                        </MenuItem>
                      ) : (
                        <MenuItem key={sub.title + idx}>
                          <NavLink to={sub.route ?? ''} className={'link'}>
                            {sub.titleContent ?? sub.title}
                          </NavLink>
                        </MenuItem>
                      )
                    )}
                  </PlainSelect>
                ) : link ? (
                  <ExternalLink href={link} className={'link'} key={link + idx}>
                    {titleContent ?? title}
                  </ExternalLink>
                ) : (
                  <NavLink key={title + idx} id={`${route}-nav-link`} to={route ?? ''} className={'link'}>
                    {titleContent ?? title}
                  </NavLink>
                )
              )}
            </LinksWrapper> */}
          </Box>
        </HideOnMobile>
        {/* <Web3Status /> */}
        <Box display="flex" gap={16}>
          <Button width="144px" height="44px" onClick={account ? onOffer : toggleWalletModal} fontSize={13}>
            Make an Offer
          </Button>
          {selectedChain && (
            <SwapSelect
              list={ChainList}
              onChange={e => account && triggerSwitchChain(library, e.id, account)}
              selected={selectedChain}
              width="fit-content"
              fontSize={13}
            />
          )}
        </Box>
      </StyledAppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          boxShadow: 'none',
          '& .MuiPaper-root': {
            borderColor: 'transparent'
          },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: theme.width.drawer,
            background: '#FFFFFF'
          }
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  )
}

// function FAQButton() {
//   const theme = useTheme()
//   return (
//     <Box display="flex" alignItems="center" justifyContent="center">
//       <span
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderRadius: '50%',
//           border: `1px solid ${theme.palette.success.main}`,
//           width: '18px',
//           height: '18px',
//           marginRight: '12px',
//           color: theme.palette.success.main
//         }}
//       >
//         <Typography variant="body1">?</Typography>
//       </span>
//       FAQ
//     </Box>
//   )
// }
