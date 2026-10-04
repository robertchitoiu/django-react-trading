import { useEffect, useState } from "react"
import { getPortfolio } from "../api/user"
import toast from "react-hot-toast"
import { TOAST_STYLE } from "../constants"
import Navbar from "../components/Navbar"
import '../styles/Portfolio.css'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'

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

   const chartItems = portfolioItems.map(item => {
      return (
         { 'name': item.symbol, 'value': item.quantity }
      )
   }).reduce((acc, item) => {
      const foundItem = acc.find((thing) => thing.name === item.name)
      if (foundItem) {
         foundItem.value += item.value
      } else {
         acc.push(item)
      }

      return acc
   }, [])

   return (
      <>
         <Navbar />
         <div className="portfolio-page">
            <div className="left">
               <div className="header-container">
                  <div>
                     <h1 className="header-title">Portfolio</h1>
                     <p className="header-subtitle">Here you can view all the shares you have bought.</p>
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
            <div className="right">
               <PieChart
                  style={{
                     width: '100%',
                     maxWidth: '520px',
                     aspectRatio: 1
                  }}
                  responsive
               >
                  <Pie
                     data={chartItems}
                     dataKey="value"
                     nameKey="name"
                     innerRadius="55%"
                     outerRadius="75%"
                     paddingAngle={3}
                     stroke="none"
                  >
                     {chartItems.map((entry, index) => (
                        <Cell
                           key={`cell-${entry.name}`}
                           fill={[
                              '#4f46e5',
                              '#06b6d4',
                              '#10b981',
                              '#f59e0b',
                              '#ef4444',
                              '#8b5cf6',
                              '#ec4899',
                              '#14b8a6'
                           ][index % 8]}
                        />
                     ))}
                  </Pie>
                  <Tooltip
                     formatter={(value) => [`${value} shares`, 'Quantity']}
                     contentStyle={{
                        backgroundColor: '#111d35',
                        border: '1px solid #1e2d4a',
                        borderRadius: '8px',
                        color: '#ffffff'
                     }}
                     labelStyle={{
                        color: '#ffffff',
                        fontWeight: '600'
                     }}
                  />
                  <Legend
                     verticalAlign="bottom"
                     height={50}
                     formatter={(value) => (
                        <span style={{ color: '#ffffff' }}>
                           {value}
                        </span>
                     )}
                  />
               </PieChart>
            </div>
         </div>
      </>
   )
}

export default Portfolio