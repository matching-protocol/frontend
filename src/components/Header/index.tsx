import { NavLink } from 'react-router-dom'
import { AppBar, Box, styled, Typography, useTheme } from '@mui/material'
import { HideOnMobile } from 'theme/index'
import Image from 'components/Image'
import BrandLogo from '../../assets/svg/matching_protocol.svg'
import { routes } from 'constants/routes'
import MobileHeader from './MobileHeader'
import Button from 'components/Button/Button'
import { ChainList } from 'constants/chain'
import ChainSelect from 'components/Select/ChainSelect'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  { title: 'Test1', route: routes.test1 },
  { title: 'Test2', route: routes.test2 },
  { title: 'Test3', route: routes.test3 },
  { title: 'Test4', link: 'https://www.google.com/' },
  {
    title: 'About',
    subTab: [
      { title: 'About1', link: 'https://www.google.com/' },
      { title: 'About2', link: 'https://www.google.com/' },
      {
        title: 'faq',
        titleContent: <FAQButton />,
        route: 'faq'
      }
    ]
  }
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
  // const { chainId } = useActiveWeb3React()

  return (
    <>
      <MobileHeader />
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

function FAQButton() {
  const theme = useTheme()
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: `1px solid ${theme.palette.success.main}`,
          width: '18px',
          height: '18px',
          marginRight: '12px',
          color: theme.palette.success.main
        }}
      >
        <Typography variant="body1">?</Typography>
      </span>
      FAQ
    </Box>
  )
}
