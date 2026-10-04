import { useEffect, useState } from "react"
import { getPortfolio } from "../api/user"
import toast from "react-hot-toast"
import { TOAST_STYLE } from "../constants"
import Navbar from "../components/Navbar"
import '../styles/Portfolio.css'

function Portfolio() {
   const [portfolioItems, setPortfolioItems] = useState([])

   useEffect(() => {
      getPortfolio()
         .then(data => setPortfolioItems(data))
         .catch(err => toast.error(err.response.data.error, { style: TOAST_STYLE }))
   }, [])

   const portfolioEntries = portfolioItems.map(item => {
      return (
         <tr key={item.id}>
            <td>{item.symbol}</td>
            <td>{item.quantity}</td>
            <td>{item.account_name}</td>
         </tr>
      )
   })

   return (
      <>
         <Navbar />
         <div className="portfolio-page">
            <div className="header-container">
               <div>
                  <h1 className="header-title">Portfolio</h1>
                  <p className="header-subtitle">Here you can view all the actives bought.</p>
               </div>
            </div>
            {portfolioItems.length === 0 ? (
               <div className="empty-state">
                  <p>You don't have any items in your portfolio yet.</p>
               </div>
            ) : (
               <table className="table-container">
                  <thead>
                     <tr>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Account</th>
                     </tr>
                  </thead>
                  <tbody>
                     {portfolioEntries}
                  </tbody>
               </table>
            )}
         </div>
      </>
   )
}

export default Portfolio