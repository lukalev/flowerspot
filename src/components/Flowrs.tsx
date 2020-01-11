import React, { Fragment } from 'react';
import { Row, Col, Input, Container, InputGroup } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators, IGlobalState } from '../store/Flowrs';
import { RouteComponentProps } from 'react-router-dom';
import Utils from '../Utils';
import './Flowrs.css';

interface IState {
    query: string,
    loading: boolean,
    flowers: any[],
};

interface IOwnProps extends RouteComponentProps<any> {}
interface IStateProps {
    flowrs?:IGlobalState
}
type ActionCreators = typeof actionCreators;
type IProps = IOwnProps & ActionCreators & IStateProps;

class Flowrs extends React.Component<IProps, IState> {

    private timeout: any;

    constructor(props: IProps) {
        super(props);
        this.timeout =  0;
        
        this.state = {
            query: (props.flowrs && props.flowrs.query) || '',
            loading: !!(props.flowrs && props.flowrs.loading),
            flowers: (props.flowrs && props.flowrs.flowers) || [],
        };
    }
    componentDidMount() {
        this.props.listFlowers(1, false);  
    }
    static getDerivedStateFromProps(nextProps:any, prevState:any) {
        if(nextProps.flowrs !== prevState.flowrs){
            return { loading: !!(nextProps.flowrs && nextProps.flowrs.loading), flowers: (nextProps.flowrs && nextProps.flowrs.flowers) || []};
        }
        else return null;
    }
    applySearch(e:any) {
        const query = e.target.value;
        const state:any = this.state;
        state.query = query;        
        this.setState(state);  
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.props.searchFlowers(query);
            this.props.setQuery(query);
        }, 1500);
    }
    clearSearch() {
        const state:any = this.state;
        state.query = '';        
        this.setState(state);  
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.props.listFlowers(1, true);
            this.props.setQuery('');
        }, 1500);
    }
    render() {
        let state:any = this.state;
        let flowersList:any = null;
        if (state.loading) {
            flowersList = <Col><div className='text-center'>Loading...</div></Col>;
        }
        else if (state.flowers && state.flowers.length>0) {
            flowersList = state.flowers.map((flowr:any,i:number) => {
                return <Col key={i} className='col-md-auto flower-item'>
                            <div className='flower-content'>
                            <div className='flower-overlay'></div>
                            <img alt={flowr.name} onError={Utils.addDefaultSrc} src={flowr.profile_picture} />

                            <div className='flower-data' >
                                <h6>{flowr.name}</h6>
                                <div className='flower-subtext'>{flowr.latin_name}</div>
                                {/* <div className='text-smaller'>{flowr.favorite.toString()}</div> */}
                            </div>
                            </div>
                        </Col>
            });
        }
        else {
            flowersList = <Col><div className='text-center'>No results</div></Col>;
        }

        const searchInput = <InputGroup>
                                <Input type='search' className='px-3' value={state.query} onChange={(e) => this.applySearch(e)} id='search' placeholder='Looking for something specific?' />
                                <span className='input-group-append'>
                                    <button className='btn' type='button'>
                                        {state.query.length > 0 ? <i className='fa fa-close' onClick={() => this.clearSearch()}></i> : <i className='fa fa-search'></i>}
                                    </button>
                                </span>
                            </InputGroup>
        return (
                <Fragment>
                <Row className='align-items-center search-header'>
                            <div className='search-overlay' ></div>
                            <Col className='m-auto text-center col-10 col-lg-6 col-xl-5'>
                                <h2>Discover flowers around you</h2>
                                <h6 className='mt-3 mb-5'>Explore between more than 8.427 sightings</h6>
                                {searchInput}
                            </Col>
                        </Row>
                <Container>
                
                <Row className='flower-list'>
                    {flowersList}
                </Row>
               
                </Container>
                </Fragment>
        );
    }
}

export default connect(
    (state:any) => state,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(Flowrs);