// import React from "react";
// import { RouterProvider } from "react-router-dom";
// import router from "./router/MainRouter";

// function App() {
//   return (
//     <div>
//       <RouterProvider router={router} />
      
//     </div>
//   );
// }

// export default App;



import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';  // Import RouterProvider
import MainRouter from './router/MainRouter'; // Import MainRouter

function App() {
  const [user, setUser] = useState(null); // Store user info in state

  return (
    <RouterProvider 
      router={MainRouter(user, setUser)}  // Pass user and setUser to MainRouter
    />
  );
}

export default App;
