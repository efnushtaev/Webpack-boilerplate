import React from "react";
import * as $ from "jquery";
import { render } from "react-dom";

import Post from "@modules/Post";
import "@styles/style";
import "@styles/less.less";

const post = new Post("Webpack Post");

import("lodash").then((res) => {
  console.log("Loadsh", res.default.random(0, 42, true));
});

$("#app").addClass("jQuery_class");

const App = () => (
  <div className="container box">
    <div className="pic"></div>
    <h2>Webpack Sandbox</h2>
    <p>{JSON.stringify(post)}</p>
  </div>
);

console.log(App);

render(<App />, document.getElementById("app"));
