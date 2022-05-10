import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData } from './api/travelAdvisorAPI';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
const App = () => {
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    const [places, setPlaces] = useState([]);
    
    const [coords, setCoords] = useState({});
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoords({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        if (bounds) {
            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
                    setRating('');
                });
        }
    }, [bounds, type]);
    return (
        <>
            <CssBaseline />
            <Header />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                        places = {places}
                    />
                </Grid>
                <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Map 
                        setBounds={setBounds}
                        setCoords={setCoords}
                        coords={coords}
                        places={places}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default App;