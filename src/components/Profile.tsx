import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators, IGlobalState } from '../store/Flowrs';
import { Col, Container, Button } from 'reactstrap';

interface IOwnProps {
    toggle(): void;
}
interface IStateProps {
    flowrs?:IGlobalState
}
type ActionCreators = typeof actionCreators;
type IProps = IOwnProps & ActionCreators & IStateProps;

class Profile extends React.Component<IProps> {
    
    constructor(props: any) {
        super(props);   
    }

    submitModal() {
        this.props.clearAuthorizationToken();
        this.props.setUser(undefined);
        this.props.toggle();
    }

    render() {
        if (this.props.flowrs && this.props.flowrs.user) {
            const { firstName, lastName } = this.props.flowrs.user;
            return (
            <Container>

                <Col className='mt-4'><h4>{firstName} {lastName}</h4></Col>
                <Col className='mt-4 mb-4'><Button className='w-100' onClick={() => this.submitModal()}>Logout</Button></Col>
                
            </Container>
            )
        }
        else {
            return null;
        }
    }
}
// export default connect<any>(
//     (state:any) => state,
//     dispatch => bindActionCreators(actionCreators, dispatch),
// )(Profile);
export default connect(
    null,   //no need for global state
    dispatch => bindActionCreators(actionCreators, dispatch),
)(Profile);