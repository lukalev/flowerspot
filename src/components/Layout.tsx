import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

interface IProps {
  history:any;
}
export default class Layout extends React.Component<IProps> {

  render() {
    return (
      <div>
          <NavMenu history={this.props.history}/>
          <Container fluid>
            {this.props.children}
          </Container>
      </div> );
    }
}
