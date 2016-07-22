import React from 'react';
import _ from 'underscore';
import ReactD3 from 'react-d3-components';
import * as db from '../models/menu';

export default class UserMoves extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fbName:'',
      userScores: [], // [{wins:4},{losses:2}]
      paper: 0,
      scissors:0,
      rock: 0,
      pieChartValues: [{x: 'paper', y: 0}, {x: 'scissors', y: 0},{x: 'rock', y: 0}]
    }
  }

  componentDidMount() {
    var fbName = sessionStorage.getItem('fbUser');
    if (fbName.length > 0){
      this.getPlayer(fbName);
      this.setState({fbName});
    }
  }

  getPlayer(player) {
    db.playerList()
      .then(players => {
        console.log('1~~~~', players, this.state.fbName)
          const targetPlayer = players.filter(player => player.name === this.state.fbName)[0]
          console.log('2~~~player is ~~~~',targetPlayer)
            this.updateUserScoresState(targetPlayer);
        })
  }


  updateUserScoresState(user) {

      this.setState({paper: user.paper});
      this.setState({scissors: user.scissors});
      this.setState({rock: user.rock});
      //console.log('3~~~~',this.state.wins)
      //console.log('4~~~~',this.state.losses)
     
      this.generateLeaderBoard();

  }

  generateLeaderBoard() {
    // const values = this.state.userScores.map(userScore => {
    //   const key = Object.keys(userScore)[0];
    //   return {x: key, y: userScore[key]}
    // })

    this.setState({pieChartValues: [{x: 'paper', y: this.state.paper}, {x: 'scissors', y: this.state.scissors},{x: 'rock', y: this.state.rock}]})
  }
  //[{x: 'paper', y: 0}, {x: 'scissors', y: 0},{x: 'rock', y: 0}]

  tooltipPieChart(x,y) {
    //console.log(x,y)
    return y.toString();
  }

  render() {

    const PieChart = ReactD3.PieChart;
    const data = {
        label: 'Your Stats',
        values: this.state.pieChartValues
    };

    return (
        <div className="col-xs-12 text-center">
          <br/>
          <br/>
              <div>
                  <PieChart
                         data={data}
                         width={600}
                         height={400}
                         margin={{top: 30, bottom: 10, left: 100, right: 100}}                
                         tooltipHtml={this.tooltipPieChart}
                         tooltipMode={'fixed'}
                         tooltipOffset={{top: 135, left: 200}}
                       />
                  
               </div>
        </div>

    )
  }
}
