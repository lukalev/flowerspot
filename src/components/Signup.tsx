import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../store/Flowrs';
import { Col, Container, FormGroup, Label, Input, Button, Row } from 'reactstrap';
import Utils from '../Utils';

interface IState {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string,
    modalMessage: string,
    modalValid: boolean,
};

interface IOwnProps {
    toggle(signInOpen:boolean): void;
}
interface IStateProps {}
type ActionCreators = typeof actionCreators;
type IProps = IOwnProps & ActionCreators & IStateProps;

class Signup extends React.Component<IProps, IState> {
    
    constructor(props: any) {
        super(props);
        
        this.state = {
          firstName: 'test',
          lastName: 'test',
          email: 'test@est.si',
          password: 'test',
          dateOfBirth: '',
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
            first_name: state.firstName,
            last_name: state.lastName,
            email: state.email,
            password: state.password,
            date_of_birth: new Date(state.dateOfBirth).toJSON(),
        };
        Utils.postData<any>('/users/register', JSON.stringify(data)).then(res => {
            if (res.auth_token) {
                this.props.setAuthorizationToken(res.auth_token);
                state.modalMessage = 'Congratulations! You have successfully signed up for Flowerspot!';
                state.modalValid = true;
                setTimeout(()=>this.props.toggle(true),2000);
            }
            else {
                state.modalMessage = res.error || 'Ups, something went wrong!';
                state.modalValid = false;
            }
            this.setState(state);
        });
    }

    render() {
        const { firstName, lastName, email, dateOfBirth, password,  modalValid, modalMessage } = this.state;
        const feedbackClass = modalMessage ? (modalValid ? 'valid-feedback' : 'invalid-feedback') : '';

        const inputCreate = (type:any, id:string, value:any, name:string):ReactNode => 
            <FormGroup>
                <Label for='firstName'>{name}</Label>
                <Input type={type} id={id} name={id} value={value} autoComplete='off' placeholder={type==='password' ? '********' : ''} onChange = {(e) => this.handleChange(e)} />
            </FormGroup>;
        return (
            <Container>
                <Row>
                <Col className='mb-4 mt-4'><h4>Create an Account</h4></Col>
                </Row>
                <Row>
                <Col className='col-md-6'>
                    {inputCreate('text','firstName',firstName,'Name')}
                </Col>
                <Col className='col-md-6'>
                    {inputCreate('text','lastName',lastName,'Surname')}
                </Col>
                </Row>
                <Row>
                <Col>
                    {inputCreate('date','dateOfBirth',dateOfBirth,'Date of birth')}
                </Col>
                </Row>
                <Row>
                <Col>
                    {inputCreate('email','email',email,'Email')}
                </Col>
                </Row>
                <Row>
                <Col>
                    {inputCreate('password','password',password,'Password')}
                </Col>
                </Row>
                <Row>
                <Col className='mt-4'><Button className='w-100' onClick={() => this.submitModal()}>Create Account</Button></Col>
                </Row>
                <Row>
                <Col><div className={feedbackClass}>{modalMessage}</div></Col>
                </Row>
                {!modalValid ? 
                <Row>
                <Col className='mt-4'><Button className='w-100' color='link' onClick={()=>this.props.toggle(false)}>I don't want to register</Button></Col>
                </Row>
                :
                null}
            </Container>
        )
    }
}
export default connect(
    null,
    dispatch => bindActionCreators(actionCreators, dispatch)    //actions needed
)(Signup);