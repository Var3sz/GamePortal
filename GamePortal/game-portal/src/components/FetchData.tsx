import React, { Component, useEffect, useState } from 'react';

interface WeatherData {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string | null; // Change to string | null if the Summary property is nullable in C#
}


export const FetchData = () => {
    const [data, setData] = useState<WeatherData[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('weatherforecast');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData = await response.json() as WeatherData[];
                if (responseData) {
                    setData(responseData);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Runs once when the component mounts

    return (
        <div>
            <h1>Weather Forecast</h1>
            {loading ? (
                <p>Loading...</p>
            ) : data ? (
                <ul>
                    {data && data.map((item: WeatherData, index: number) => (
                        <li key={item.date}>
                            <p>Date: {item.date}</p>
                            <p>Temperature: {item.temperatureC}°C, {item.temperatureF}°F</p>
                            <p>Summary: {item.summary}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default FetchData;