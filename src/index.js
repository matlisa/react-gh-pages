import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Histogram from './hist'
import bundles from './bundles.json'

class BPCI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bundle: "1",
      param: [],
      alpha: 5,
      beta: 5,
      quantity: 25000,
      samples: new Array(25000).fill().map(() => (randb(5,5))),
    }
  }
  handleChange(event, index){
    this.setState({[event.target.name]:event.target.value});
    this.setState({"samples": new Array(this.state['quantity']).fill().map(() => (randb(this.state['alpha'], this.state['beta'])))});
  }
  handleSubmit(e, index){
    e.preventDefault();
    e.stopPropagation();

    const bundle = this.state.bundle
    const param = this.state.param
    const alpha = this.state.alpha
    const beta = this.state.beta
    const new_param = {
        alpha: alpha,
        beta: beta,
    }

    param[bundle] = new_param
    this.setState({
      param: param,
    });
  }

  render() {

      const parameters = this.state.param;

      const info = parameters.map((param, bundle) => {
          const bundle_name = Object.values(bundles)[bundle-1]['episode']
          const alpha = param.alpha
          const beta = param.beta
          return (
             <tr key={bundle}>
               <td>{bundle_name}</td>
               <td>{alpha}</td>
               <td>{beta}</td>
             </tr>
          );
        });

      var obj = Object.values(bundles)
      var optionItems = obj.map((bundle) =>
                <option key={bundle.id} value={bundle.id}>{bundle.episode}</option>
                );

      const download = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parameters));

      return (

      <div className="bpci">
        <div class="col-12 col-sm-6 col-md-8">
          <PDF
              bundle={this.state['bundle']}
              alpha={this.state['alpha']}
              beta={this.state['beta']}
              quantity={this.state['quantity']}
              samples={this.state['samples']}
              onChange={i => this.handleChange(i)} />
        </div>
        <div class="col-6 col-md-4">
            <form className="bpci" onSubmit={i => this.handleSubmit(i)}>
                <select class="form-control" id="bundle-dropdown" name="bundle" onChange={i => this.handleChange(i)}>
                    {optionItems}
                </select>
                <br />
                <label>alpha: {this.state.alpha}</label>
                <div>
                  <input name="alpha" type="range" min="0" max="5" step="0.01" onChange={i => this.handleChange(i)}/>
                </div>
                <label>beta: {this.state.beta}</label>
                <div>
                  <input name="beta" type="range" min="0" max="5" step="0.01" onChange={i => this.handleChange(i)}/>
                </div>
                <input type="submit" class="btn btn-default" value="Save" />
            </form>
            <table class="table">
                <thead>
                  <tr>
                    <th>Bundle</th>
                    <th>Alpha</th>
                    <th>Beta</th>
                  </tr>
                </thead>
                <tbody>
                {info}
                </tbody>
            </table>
            <a id="download" href={download} download="parameters.json" class="btn btn-info" role="button">Download</a>
        </div>
      </div>
      );
  }
}

class PDF extends React.Component {
//  constructor(props) {
//    super(props);
//    this.state = {
//      bundle: "",
//      samples: Array(25000).fill().map(() => randb(5,5)),
//      quantity: 25000,
//      alpha: 5,
//      beta: 5,
//    }
//    this.handleChange = this.handleChange.bind(this)
//  }

//  handleChange(event, index){
//    this.setState({[event.target.name]:event.target.value});
//    this.setState({"samples": new Array(this.state['quantity']).fill().map(() => (randb(this.state['alpha'], this.state['beta'])))});
//  }

  render() {

    return (

      <div className="pdf">

          <Histogram ref={(container)=>{this.container = container}} data={this.props.samples} quantity={this.props.quantity}
           style={{width: "100%"}}/>

      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <BPCI />,
  document.getElementById('root')
);

function randb(alpha, beta) {
  const u = randg(alpha);
  return u / (u + randg(beta));
}

// Returns a gamma deviate by the method of Marsaglia and Tsang.
function randg(shape) {
  let oalph = shape, a1, a2, u, v, x, mat;
  if (!shape) shape = 1;
  if (shape < 1) shape += 1;
  a1 = shape - 1 / 3;
  a2 = 1 / Math.sqrt(9 * a1);
  do {
    do {
      x = randn();
      v = 1 + a2 * x;
    } while (v <= 0);
    v = v * v * v;
    u = Math.random();
  } while (
    u > 1 - 0.331 * Math.pow(x, 4) &&
    Math.log(u) > 0.5 * x * x + a1 * (1 - v + Math.log(v))
  );
  if (shape === oalph) return a1 * v; // alpha > 1
  do u = Math.random(); while (u === 0); // alpha < 1
  return Math.pow(u, 1 / oalph) * a1 * v;
}

// Returns a normal deviate (mu=0, sigma=1).
function randn() {
  let u, v, x, y, q;
  do {
    u = Math.random();
    v = 1.7156 * (Math.random() - 0.5);
    x = u - 0.449871;
    y = Math.abs(v) + 0.386595;
    q = x * x + y * (0.19600 * y - 0.25472 * x);
  } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
  return v / u;
}
