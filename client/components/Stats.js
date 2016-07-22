import React from 'react';
import { Link, browserHistory } from 'react-router';
import _ from 'underscore';
import ReactD3 from 'react-d3-components';
import * as db from '../models/menu';

import ScoresChart from './Stats_ScoresChart';
import WinsChart from './Stats_WinsChart';

export default class Stats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userScores: [], // [{uu1:4},{uu2:2}]
      pieChartValues: [{x: 'user1', y: 0}, {x: 'user2', y: 0}, {x: 'user3', y: 0}]

    }
  }

  componentDidMount() {
    this.getUniqueUsers();

  }

  getUniqueUsers() {
    //get all users
    db.playerList()
      .then(players => {
          players = this.GetTop5Users(players);
          const users = players.map(player => player.name).filter((name,index,self) => self.indexOf(name) === index)
            this.updateUserScoresState(users);
        })
  }


  GetTop5Users(players){
    const sortedPlayers = _.sortBy(players,'score')
    const noZeroPlayers = _.reject(sortedPlayers,player => player.score == 0)
    const top5Players = _.first(noZeroPlayers, 5) 
    //console.log(top5Players);
    return top5Players;
  }

  updateUserScoresState(users) {
    users.forEach(user => {
      db.gamesByUsername(user)
        .then(gameList => {
          const scores = gameList.map(game => game.score)
          const total = scores.reduce((sum,score) => {
            return sum += score;
          },0);

          this.setState({userScores: this.state.userScores.concat({[user]:total})});
            //console.log('state is ~~', JSON.stringify(this.state.userScores));
             this.generateLeaderBoard();
        })

    })

  }

  generateLeaderBoard() {
    const values = this.state.userScores.map(userScore => {
      const key = Object.keys(userScore)[0];
      return {x: key, y: userScore[key]}
    })
    //console.log(values)
    this.setState({pieChartValues: values})
  }


  tooltipPieChart(x,y) {
    //console.log(x,y)
    return y.toString();
  }

  tooltipStacked(x, y0, y, total) {
    //console.log('3~~~~',x,y0,y,total)
    return y.toString();
  }

  render() {

    const BarChart = ReactD3.BarChart;
    const PieChart = ReactD3.PieChart;
    const data = {
        label: 'Leaderboard',
        values: this.state.pieChartValues
    };
    const dataStacked = [
    {
    label: 'somethingA',
          values: [
              {x: 'SomethingA', y: 10}, //{x: user1.name, y: user1.wins}
              {x: 'SomethingC', y: 3}//{x: user2.name, y: user2.wins}
          ]
    },
    {
    label: 'somethingB',
          values: [
              {x: 'SomethingA', y: 6},//{x: user1.name, y: user1.losses}
              {x: 'SomethingC', y: 5}//{x: user2.name, y: user2.losses}
          ]
    }   
    ];

    const sort = null;
    return (
      <div className="container stats">
        <div className="row header">
          <div className="col-xs-12">
            <Link to="/"><button className='btn btn-default statsButton'>Back</button></Link> 
            <h1>Leaderboard</h1>
            <hr/>
          </div>
        </div>
        
        <div className="statsContent">
          <div className="row">
            <ScoresChart />
          </div>
          <div className="row">
            <WinsChart />
          </div>
        </div>
      </div>

    )
  }
}
