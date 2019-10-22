import React from 'react';
import { Route, Switch } from 'react-router-dom';

import GameList from './components/GameList/GameList';

const MainRouter = () => (
    <div>
        <Switch>
            <Route exact path='/' component={GameList} />
        </Switch>
    </div>
);

export default MainRouter;