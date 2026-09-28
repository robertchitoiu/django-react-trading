import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react'
import { getChartData } from '../api/user'
import toast from 'react-hot-toast'
import { TOAST_STYLE } from '../constants'

function BalanceChart() {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        getChartData()
                .then(data => setChartData(data))
                .catch(() => toast.error('Failed to load chart data!', {style: TOAST_STYLE}))
    }, [])


    return (
        <ResponsiveContainer width="100%" height={300}>  
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>  
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />  
                <XAxis   
                    dataKey="date"   
                    stroke="#8892a4"   
                    tick={{ fill: '#8892a4', fontSize: 12 }}  
                />  
                <YAxis   
                    stroke="#8892a4"  
                    tick={{ fill: '#8892a4', fontSize: 12 }}  
                />  
                <Tooltip  
                    contentStyle={{  
                        backgroundColor: '#111d35',  
                        border: '1px solid #1e2d4a',  
                        borderRadius: '8px',  
                        color: '#ffffff'  
                    }}  
                />  
                <Line   
                    type="monotone"  
                    dataKey="balance"   
                    stroke="#3676f6"  
                    strokeWidth={2}  
                    dot={false}  
                />
                <Legend   
                    wrapperStyle={{  
                        color: '#8892a4',  
                        fontSize: '13px',  
                        paddingTop: '16px'  
                    }}  
                    formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}  
                />  
            </LineChart>  
        </ResponsiveContainer>  
    )
}

export default BalanceChart