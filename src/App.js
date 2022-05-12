import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api/travelAdvisorAPI';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
const App = () => {
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    const [places, setPlaces] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    
    const [childClicked, setChildClicked] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const [coords, setCoords] = useState({});
    const [bounds, setBounds] = useState(null);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [autocomplete, setAutocomplete] = useState(null);
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoords({ lat: latitude, lng: longitude });
        });
    }, []);

    useEffect(() => {
        const filtered = places.filter((place) => Number(place.rating) > rating);
        setFilteredPlaces(filtered);
        console.log(rating)
    }, [rating]);

    useEffect(() => {
        if (bounds) {
            setIsLoading(true);

            getWeatherData(coords.lat, coords.lng)
                .then((data) => setWeatherData(data));
            
                console.log(weatherData)

            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
                    setFilteredPlaces([]);
                    setRating('');
                    setIsLoading(false);
                });
        }
    }, [bounds, type]);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();

        setCoords({ lat, lng });
    };

    return (
        <>
            <CssBaseline />
            <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Map
                        setChildClicked={setChildClicked}
                        setBounds={setBounds}
                        setCoords={setCoords}
                        coords={coords}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        weatherData = {weatherData}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default App;