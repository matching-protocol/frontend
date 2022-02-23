import { useMemo } from 'react'
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
  Drawer
} from '@mui/material'
import { HideOnMobile } from 'theme/index'
import Image from 'components/Image'
import BrandLogo from 'assets/svg/matching_protocol.svg'
import { routes } from 'constants/routes'
import MobileHeader from './MobileHeader'
import Button from 'components/Button/Button'
import { ChainList } from 'constants/chain'
import ChainSelect from 'components/Select/ChainSelect'
import Web3Status from './Web3Status'
import MarketIcon from 'assets/images/market.png'
import AccountIcon from 'assets/images/account.png'
import StatIcon from 'assets/images/statistics.png'
import HelpIcon from 'assets/images/help.png'
import { ExternalLink } from 'theme/components'

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
  { title: 'Market', route: routes.test1, icon: <Image src={MarketIcon} /> },
  { title: 'Account', route: routes.test2, icon: <Image src={AccountIcon} /> },
  { title: 'Statistics', route: routes.test3, icon: <Image src={StatIcon} /> },
  { title: 'Help', route: routes.test3, icon: <Image src={HelpIcon} /> }
]

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  height: theme.height.header,
  borderBottom: '1px solid #00000020',
  backgroundColor: theme.palette.background.default,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 60px 00 40px',
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
    width: 180.8,
    height: 34.7
  },
  '&:hover': {
    cursor: 'pointer'
  }
})

// const LinksWrapper = muiStyled('div')({
//   marginLeft: 60.2
// })

export default function Header() {
  const drawer = useMemo(
    () => (
      <Box
        sx={{
          padding: '50px 40px',
          minHeight: '100%'
        }}
        gridTemplateRows="auto auto auto 1fr"
        display="grid"
        justifyContent="space-between"
        gap="52px"
      >
        <List>
          {Tabs.map(({ title, route, icon, link }, idx) => (
            <ListItem key={title} sx={{ padding: '10px 0' }}>
              {link ? (
                <ExternalLink href={link}>
                  <ListItemIcon sx={{ color: 'currentColor', minWidth: 40 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={title}
                    primaryTypographyProps={{
                      sx: { fontSize: '16px' }
                    }}
                  />
                </ExternalLink>
              ) : (
                <NavLink
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
                      sx: { fontSize: '16px' }
                    }}
                  />
                </NavLink>
              )}
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto', alignSelf: 'flex-end', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
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
            width: 272
          }
        }}
        open
      >
        {drawer}
      </Drawer>
      <StyledAppBar>
        <HideOnMobile breakpoint="md">
          <Box display="flex" alignItems="center">
            <MainLogo id={'chainswap'} to={'/'}>
              <Image src={BrandLogo} alt={'brand-logo'} />
            </MainLogo>
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
          <Button width="144px" height="44px">
            Make an Offer
          </Button>
          <ChainSelect chainList={ChainList} selectedChain={ChainList[0]} />
        </Box>
      </StyledAppBar>
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
