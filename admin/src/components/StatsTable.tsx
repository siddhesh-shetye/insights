import React from 'react';

const StatsTable = ({ data }: { data: any[] }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
            <tr>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Date</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Count</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>UTM Source</th>
            </tr>
        </thead>
        <tbody>
            {data.map((row, i) => (
                <tr key={i}>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.date}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.count}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{row.utm_source}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default StatsTable;