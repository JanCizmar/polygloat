import {default as React, FunctionComponent} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AppState} from '../../store';
import {LINKS} from '../../constants/links';
import {securityService} from '../../service/securityService';
import {container} from 'tsyringe';

interface PrivateRouteProps {

}

export const PrivateRoute: FunctionComponent<PrivateRouteProps & React.ComponentProps<typeof Route>> =
    ({children, ...rest}) => {

        const allowPrivate = useSelector((state: AppState) => state.global.security.allowPrivate);
        const ss = container.resolve(securityService);
        const afterLoginLink = ss.getAfterLoginLink();

        if (allowPrivate && afterLoginLink) {
            ss.removeAfterLoginLink();
            children = <Redirect to={afterLoginLink}/>;
        }

        return (
            <Route
                {...rest}
                render={({location}) =>
                    allowPrivate ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: LINKS.LOGIN.build(),
                                state: {from: location}
                            }}
                        />
                    )
                }
            />
        );
    };
