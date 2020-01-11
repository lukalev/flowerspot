import React, { Fragment } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Container, Navbar, NavbarToggler, NavItem, NavLink, Modal, Button, ModalBody, Collapse} from 'reactstrap';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { actionCreators, IGlobalState } from '../store/Flowrs';
import { RouteComponentProps } from 'react-router-dom';
import Signup from './Signup';
import Signin from './Signin';
import Profile from './Profile';
import './NavMenu.css'

interface IState {
    isOpen: boolean,
    signUpOpen: boolean,
    signInOpen: boolean,
    profileOpen: boolean,
};
interface IStateProps {
    flowrs:IGlobalState
}
// interface IOwnProps extends RouteComponentProps<any> {}
type ActionCreators = typeof actionCreators;
//type IProps = IOwnProps & ActionCreators & IStateProps;
interface IProps {
  history:any;
  flowrs?:any;
}
class NavMenu extends React.Component<IProps, IState> {
  constructor(props:IProps) {
    super(props);

    this.state = {
        isOpen: false,
        signUpOpen: false,
        signInOpen: false,
        profileOpen: false,

    };
  }
  menuToggle() {
    let state:IState = this.state;
    state.isOpen = !state.isOpen;
    this.setState(state);
  }
  toggleModalRegister(signInOpen:boolean) {
    const state:IState = this.state;
    state.signUpOpen = !state.signUpOpen;
    state.signInOpen = signInOpen;
    state.isOpen = false;
    this.setState(state);
  }
  toggleModalLogin() {
    const state:IState = this.state;
    state.signInOpen = !state.signInOpen;
    state.isOpen = false;
    this.setState(state);
  }
  toggleModalProfile() {
    const state:IState = this.state;
    state.profileOpen = !state.profileOpen;
    state.isOpen = false;
    this.setState(state);
  }
  render() {
    const loggedIn = (this.props.flowrs && this.props.flowrs.user && this.props.flowrs.user.firstName.length>0);

    return (
      <header>
            <Navbar className='navbar-expand-md navbar-toggleable-md navbar-light' >
                <Container fluid>
                    <NavLink tag={RRNavLink} to={'/'}>
                      <img className='logo' alt='Flowerspot' src={process.env.PUBLIC_URL + '/logo.png'} />
                    </NavLink>
                    <NavbarToggler onClick={() => this.menuToggle()} className='mr-2' />
                    <Collapse className='d-md-inline-flex' isOpen={this.state.isOpen} navbar>
                        <ul className='navbar-nav ml-auto'>
                        <NavItem className='mx-2 mx-lg-3'>
                            <NavLink exact tag={RRNavLink} activeClassName='active' to={'/'}>Flowers</NavLink>
                        </NavItem>
                        <NavItem className='mx-2 mx-lg-3'>
                            <NavLink tag={RRNavLink} activeClassName='active' to={'/Latest'}>Latest</NavLink>
                        </NavItem>
                        <NavItem className='mx-2 mx-lg-3'>
                            <NavLink tag={RRNavLink} activeClassName='active' to={'/Favorites'}>Favorites</NavLink>
                        </NavItem>
                        { loggedIn ?
                        <NavItem className='mx-2 mx-lg-3'>
                            <Button color='secondary' className='mt-2 mb-3 mt-md-0 mb-md-0' onClick={()=>this.toggleModalProfile()}>{this.props.flowrs.user?.firstName + ' ' + this.props.flowrs.user?.lastName}</Button>
                        </NavItem>
                        :
                        <Fragment>
                        <NavItem className='mx-2 mx-lg-3'>
                            <a className='nav-link secondary' onClick={()=>this.toggleModalLogin()}>Login</a>
                        </NavItem> 
                        <NavItem className='ml-md-3 my-2 my-md-0'>
                            <Button color='secondary' className='mt-2 mb-3 mt-md-0 mb-md-0' onClick={()=>this.toggleModalRegister(false)}>New Account</Button>
                        </NavItem>
                        </Fragment>
                        }
                      </ul>
                      </Collapse>
                </Container>
            </Navbar>
            <Modal backdrop='static' isOpen={this.state.signInOpen} toggle={() => this.toggleModalLogin()}>
                <ModalBody>
                    <Signin toggle={()=>this.toggleModalLogin()} />
                </ModalBody>
            </Modal>
            <Modal backdrop='static' isOpen={this.state.signUpOpen} toggle={() => this.toggleModalRegister(false)}>
                <ModalBody>
                    <Signup toggle={(signInOpen:boolean)=>this.toggleModalRegister(signInOpen)} />
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.profileOpen} toggle={() => this.toggleModalProfile()}>
                <ModalBody>
                    {/* <Profile {...this.props} toggle={()=>this.toggleModalProfile()} /> */}
                    <Profile toggle={()=>this.toggleModalProfile()} />

                </ModalBody>
            </Modal>
      </header>
    );
  }

}

export default (connect(
    (state:any) => state,
    dispatch => bindActionCreators(actionCreators, dispatch),   //actions needed
)(NavMenu));