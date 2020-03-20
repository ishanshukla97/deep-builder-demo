import React from "react";
import { Route } from "react-router-dom"
import ModelBuilder from "./ModelBuilder"

interface IPageProps {

}

const Pages: React.FC<IPageProps> = props => {
    return <>
        <Route path="/" render={() => <ModelBuilder />} />
    </>
}

export default Pages;