import React from 'react';
import { Link, browserHistory } from 'react-router';
import _ from 'underscore';
import ReactD3 from 'react-d3-components';
import * as db from '../models/menu';

export default class Stats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userScores: [], // [{uu1:4},{uu2:2}]
      chartValues: [{x: 'user1', y: 0}, {x: 'user2', y: 0}, {x: 'user3', y: 0}]
    }   
  }

  componentDidMount() {
    this.getUniqueUsers();
  }

  // getGamesByUser() {
  //   db.gamesByPlayerId()
  //     .then(gameList => {
  //               const scores = gameList.map(game => game.score)
  //               const total = scores.reduce((sum,score) => {
  //                 return sum += score;
  //           },0);

  //     this.setState({userScores: this.state.userScores.concat({[user]:total})});
  //       console.log('state is ~~', JSON.stringify(this.state.userScores));
  //        this.generateLeaderBoard();
  //   })
  // }

  getUniqueUsers() {
    //get all users
    db.playerList()
      .then(players => {
        console.log('users,0~~~~~~',JSON.stringify(players))
          players = this.GetTop5Users(players);
          const users = players.map(player => player.name).filter((name,index,self) => self.indexOf(name) === index)
          console.log('users,1~~~~~~',users)
            this.updateUserScoresState(users);
        })
  }

  GetTop5Users(players){
    const sortedPlayers = _.sortBy(players,'score')
    const top5Players = _.first(sortedPlayers, 5) 
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
            console.log('state is ~~', JSON.stringify(this.state.userScores));
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
    this.setState({chartValues: values})
  }

  tooltipScatter(x,y) {
    console.log(x,y)
    // y is wrong now...
    return "x: " + x + " y: " + y;
  }
 
  render() {
   
    const BarChart = ReactD3.BarChart;
    const PieChart = ReactD3.PieChart;

    const data = {
        label: 'Leaderboard',
        values: this.state.chartValues
    };

    const sort = null;
    return (
      <div className="container">
        <Link to="/"><button className='stats'>Back</button></Link> 
        <div className="col-xs-8 col-xs-offset-2">
        <h3>Leaderboard</h3>

          <PieChart
                 data={data}
                 width={600}
                 height={400}
                 margin={{top: 30, bottom: 10, left: 100, right: 100}}
                 
                 tooltipHtml={this.tooltipScatter}
                 
                 />
        </div>
      </div>
        
    )
  }
}
