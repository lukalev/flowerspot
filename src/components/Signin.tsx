import React, { ReactNode } from 'react';
import { Col, Container, FormGroup, Label, Input, Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Flowrs';
import Utils from '../Utils';

interface IState {
    email: string,
    password: string,
    modalMessage: string,
    modalValid: boolean,
};

interface IOwnProps {
    toggle(): void;
}
interface IStateProps {}
type ActionCreators = typeof actionCreators;
type IProps = IOwnProps & ActionCreators & IStateProps;

class Signin extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.state = {
        email: '',
        password: '',
        modalMessage: '',
        modalValid: false,
        }
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const { currentTarget } = event;
        const value = currentTarget.type === 'checkbox' ? currentTarget.checked : currentTarget.value;
        const { name } = currentTarget;
        this.setState({ [name]: value } as Pick<IState, keyof IState>);
    }

    submitModal() {
        const state:any = this.state;

        const data = {
            email: state.email,
            password: state.password,
        };

        Utils.postData<any>('/users/login', JSON.stringify(data)).then(res => {
            if (res.auth_token) {
                this.props.setAuthorizationToken(res.auth_token);
                state.modalMessage = 'Congratulations! You have successfully logged into FlowerSpot!';
                state.modalValid = true;
                Utils.getData<any>('/users/me').then((me:any) => {
                    if (me.user) {
                        this.props.setUser({firstName:me.user.first_name, lastName:me.user.last_name})
                        setTimeout(()=>this.props.toggle(),1500);
                    }
                });
            }
            else {
                state.modalMessage = res.error || 'Ups, something went wrong!';
                state.modalValid = false;
            }
            this.setState(state);
        });
    }

    render() {
        const { email, password,  modalValid, modalMessage } = this.state;
        const feedbackClass = modalMessage ? (modalValid ? 'valid-feedback' : 'invalid-feedback') : '';

        const inputCreate = (type:any, id:string, value:any, name:string):ReactNode => 
        <FormGroup>
            <Label for='firstName'>{name}</Label>
            <Input type={type} id={id} name={id} value={value} autoComplete='off' placeholder={type==='password' ? '********' : ''} onChange = {(e) => this.handleChange(e)} />
        </FormGroup>;

        return (
        <Container>

            <Col className='mb-4 mt-4'><h4>Welcome Back</h4></Col>
            <Col>
                {inputCreate('email','email',email,'Email')}
            </Col>
            <Col>
                {inputCreate('password','password',password,'Password')}
            </Col>
            <Col className='mt-4'><Button className='w-100' onClick={() => this.submitModal()}>Login to your Account</Button></Col>
            <Col><div className={feedbackClass}>{modalMessage}</div></Col>
            {!modalValid ? 
            <Col className='mt-4'><Button className='w-100' color='link' onClick={this.props.toggle}>I don't want to Login</Button></Col>
            :
            null}
        </Container>
        );
    }

}

export default connect(
    null,   //no need for global state
    dispatch => bindActionCreators(actionCreators, dispatch)    //actions needed
)(Signin);