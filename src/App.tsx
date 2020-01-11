import React from 'react';
import { Route } from 'react-router-dom';
import Layout from './components/Layout';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Flowrs from './components/Flowrs';

const AnimatedSwitch = require('react-router-transition').AnimatedSwitch;

export default (props:any) => (
  
  <Layout history={props.history}>
        {/* animated switch for smoother transitions */}
        
        <AnimatedSwitch 
        atEnter={{ opacity: 0 }}
        atLeave={{ opacity: 0 }}
        atActive={{ opacity: 1 }}>

        {/* some routes as examples */}

        <Route exact path={'/Signin'} component={Signin} />
        <Route exact path={'/Signup'} component={Signup} />

        <Route exact path={'*'} component={Flowrs} />
      
        </AnimatedSwitch>    
  </Layout>
);
