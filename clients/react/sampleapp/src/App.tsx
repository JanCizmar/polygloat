import React from 'react';
import './App.css';
import {PolygloatProvider, T, useSetLanguage, useTranslate} from "polygloat-react";

const ChooseLanguage = () => {
    const setLanguage = useSetLanguage();

    return (<div>
        <select onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">En</option>
            <option value="de">De</option>
        </select>
    </div>);
};

const ComponentWithUseTranslation = () => {
    const t = useTranslate();

    return (
        <>
            <h1>{t("hello", {name: "Jan"})}</h1>
            <h1>{t("test")}</h1>
        </>
    );
}

const App = () => {
    return (
        <PolygloatProvider
            //filesUrlPrefix="i18n/"
            apiUrl="http://localhost:8080"
            apiKey="ga9amv7ut8slf6av0rfjdjcvqo"
        >

            <ChooseLanguage/>

            <div className="App">
                <h1><T parameters={{name: "Jan", surname: "Cizmar"}}>hello</T></h1>
                <h1><T noWrap>test</T></h1>
                <ComponentWithUseTranslation/>
            </div>


        </PolygloatProvider>
    )
};

export default App;
