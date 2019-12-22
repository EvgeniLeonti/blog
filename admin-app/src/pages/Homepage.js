import React from "react";
import CONSTANTS from "../constants"

const Homepage = (props) => {
 props.setNavigation(CONSTANTS.NAVIGATION.HOMEPAGE);

 return <div>
  <p>This is the home page.</p>
  <p>It will include a lot of stuff in the future.</p>
 </div>
};

export default Homepage;