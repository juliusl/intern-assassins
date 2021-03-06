/// <reference path="../../../typings/react/index.d.ts" />
/// <reference path="../../../typings/react-dom/index.d.ts" />

/* tslint:disable no-unused-variable */
import * as React from "react";
/* tslint:enable no-unused-variable */

import * as ReactDom from "react-dom";
import { App } from "./components/apps/app";
import { Footer } from "./components/footer";

const appWrapper: HTMLElement = document.getElementById("app-wrapper");
const footerWrapper: HTMLElement = document.getElementById("footer-wrapper");

ReactDom.render(<App />, appWrapper);
ReactDom.render(<Footer />, footerWrapper);

appWrapper.className = appWrapper.className.replace("loading", "");
