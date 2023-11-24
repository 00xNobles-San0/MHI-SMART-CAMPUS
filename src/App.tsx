import './App.css'
import ReservationService from "./cpanel/services/reservation"
function App() {

  const res = new ReservationService()

  res.createReservation("fljsjgl")
  return (
    <>
    </>
  )
}

export default App
