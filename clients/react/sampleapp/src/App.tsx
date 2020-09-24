import React from 'react';
import './App.css';
import {PolygloatProvider, T, useSetLanguage} from "polygloat-react";

const ChooseLanguage = () => {
    const setLanguage = useSetLanguage();

    return (<div>
        <select onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">En</option>
            <option value="de">De</option>
        </select>
    </div>);
};

const App = () => (
    <PolygloatProvider
        filesUrlPrefix="i18n/"
        //   apiUrl="http://localhost:8080"
        //  apiKey="ga9amv7ut8slf6av0rfjdjcvqo"
    >

        <ChooseLanguage/>

        <div className="App">
            <h1><T>hello</T></h1>
            <h1><T>hello</T></h1>
            <h1><T>test</T></h1>
        </div>

    </PolygloatProvider>
);

export default App;
