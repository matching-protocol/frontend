import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { styled } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
import WarningModal from '../components/Modal/WarningModal'
import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
// import Footer from 'components/Footer'
import { routes } from 'constants/routes'
import Market from './Market'
import MakeOffer from './MakeOffer'
import TakeOffer from './TakeOffer'
import Account from './Account'
import InitProvider from './InitProvider'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%',
  maxHeight: '100vh',
  overflow: 'auto'
  // alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  // minHeight: `calc(100vh - ${theme.height.header})`,
  minHeight: '100vh',
  // padding: '50px 0 80px',
  // justifyContent: 'center',
  alignItems: 'center',
  // flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  // position: 'relative',
  // [theme.breakpoints.down('md')]: {
  //   minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
  //   paddingTop: 20
  // },
  background: theme.palette.background.paper,
  paddingLeft: theme.width.drawer,
  paddingTop: theme.height.header
}))

export default function App() {
  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <InitProvider>
          <AppWrapper id="app">
            <ContentWrapper>
              <Header />
              <BodyWrapper id="body">
                <Popups />
                <Polling />
                <WarningModal />
                <Web3ReactManager>
                  <Switch>
                    <Route exact strict path="/" component={Market} />
                    <Route exact strict path={routes.market} component={Market} />
                    <Route exact strict path={routes.makeOffer} component={MakeOffer} />
                    <Route exact strict path={routes.takeOffer + '/:orderId'} component={TakeOffer} />
                    <Route exact strict path={routes.account} component={Account} />
                    <Route exact strict path={routes.stat} component={ComingSoon} />
                    <Route exact strict path={routes.help} component={ComingSoon} />
                  </Switch>
                </Web3ReactManager>
              </BodyWrapper>
              {/* <Footer /> */}
            </ContentWrapper>
          </AppWrapper>
        </InitProvider>
      </ModalProvider>
    </Suspense>
  )
}
