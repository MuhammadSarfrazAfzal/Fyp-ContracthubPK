import './App.css'
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen'
import Dashboard from './components/Dashboard/Dashboard'
import NavBar from './components/NavBar/NavBar'
import MyContracts from './components/My Contracts/MyContracts'
import NewContract from './components/My Contracts/New Contracts/NewContracts'
import ContractsByStatus from './components/Reports/contract-report'
function App() {
  return (
    <>
        <WelcomeScreen></WelcomeScreen>
        <NavBar></NavBar> 
      
        <MyContracts></MyContracts>
        <NewContract></NewContract>
        <ContractsByStatus></ContractsByStatus>
    </>
  )
}

export default App
