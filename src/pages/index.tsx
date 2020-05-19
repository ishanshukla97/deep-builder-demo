import React from "react";
import { Route } from "react-router-dom"
import ModelBuilder from "./ModelBuilder"
import { FAQPage } from "./FAQ";

interface IPageProps {

}

const Pages: React.FC<IPageProps> = props => {
    return <>
        <Route path="/" exact render={() => (<ModelBuilder />)} />
        <Route path='/faq' render={() => <FAQPage />} />
    </>
}

export default Pages;