import { Component } from 'react';

export default class TestComponent extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}