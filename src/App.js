import React, {Component} from 'react';
const axios = require('axios');
const ini = require('ini');
var config="";
const electron = window.require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
// const electron = require('electron');
const fs = window.require("fs");
const ipc = electron.ipcRenderer;

export default class App extends Component{
      constructor(props){
            super(props);
            this.state={
                  config_ini:config
            }
      }
      componentWillMount(){
            ipc.on("message", (event, data) => {
                  alert("Hello world");
            });
            ipc.send("callback","Here is react component");
          console.log("####",this.state.config_ini);
            
      }
      componentDidMount(){
            axios('./config.ini').then(((config_file) => {
                       const config2 = ini.parse(config_file.data);
                       console.log(config2);
                       this.setState({ config_ini: config2 }, () => {
                             console.log("@@", this.state.config_ini);
                             ipc.send("callback", config2);
                       });
                 }))
      }

      handleChange(e){
            var ids = e.target.id.split(".");
            let new_config = this.state.config_ini;
            new_config[ids[0]][ids[1]] = e.target.value;
            this.setState({config_ini:new_config})
            console.log(this.state.config_ini[ids[0]][ids[1]]);
            console.log(this.state.config_ini);
      }
      handleBtnChange(e){
            var ids = e.target.id.split(".");
            let new_config = this.state.config_ini;
            if (new_config[ids[0]][ids[1]] == 0) {
                  new_config[ids[0]][ids[1]] = "1";
            }
            else{
                  new_config[ids[0]][ids[1]] = "0";
            } console.log("about to change");
            this.setState({config_ini:new_config});
      console.log(this.state.config_ini);
            
      }
      LogOpt(e){
            let new_config = this.state.config_ini;
            new_config.Optimizer.OptimizerType=e.target.value;
            this.setState({config_ini:new_config},()=>{
                  console.log("about to change");
                  if (new_config.Optimizer.OptimizerType == 'opt one') {
                  axios('./config2.ini').then(((config_file) => {
                       const config2 = ini.parse(config_file.data);
                       console.log(config2);
                       this.setState({ config_ini: config2 }, () => {
                             console.log("@@", this.state.config_ini);
                       });
                 }))
           }
                  else if (new_config.Optimizer.OptimizerType=="opt two"){
                   axios('./config.ini').then(((config_file) => {
                       const config2 = ini.parse(config_file.data);
                       console.log(config2);
                       this.setState({ config_ini: config2 }, () => {
                             console.log("@@", this.state.config_ini);
                       });
                 }))
           }
           else{
                 alert('last');
           }
            });
            console.log(this.state.config_ini);
      }
      saveIni(){
            let config = this.state.config_ini;
            fs.writeFile("./test.ini", ini.stringify(config), function (err) {
                  if (err) {
                        return console.log(err);
                  }

                  console.log("The file was saved!");
            });
            console.log(config);
      }
      render(){
            var config = this.state.config_ini;
            return(
                  <div>
                  
                        {Object.keys(config).map((val,idx)=>{
                              if(val=='Optimizer'){
                                   return(
                                          <div>
                                          <h1 key={idx}>{val}</h1>
                                          <label>
                                                <input type='radio' name='opt' value='opt one' onChange={(e)=>{this.LogOpt(e)}}/>
                                                Optimizer One
                                          </label>
                                          <br/>
                                          <label>
                                                <input type='radio' name='opt' value='opt two' onChange={(e)=>{this.LogOpt(e)}}/>
                                                Optimizer Two
                                          </label>
                                          <br/>
                                          <label>
                                                <input type='radio' name='opt' value='opt three' onChange={(e)=>{this.LogOpt(e)}}/>
                                                Optimizer Three
                                          </label>
                                    </div>
                                   );

                              }
                              else{
                                    return( 
                              <div> 
                                    <h1 key={idx}>{val}</h1>
                                    {Object.keys(config[val]).map((subval,subidx)=>{
                                          if(config[val][subval]=='0' || config[val][subval]=='1' ){
                                                return(
                                                      <li key={subidx} id={val+"."+subval}>
                                                            <span>{subval}</span>
                                                            <input type='submit' id={val+"."+subval} value={config[val][subval]==0?"OFF":"ON"} onClick={(e)=>this.handleBtnChange(e)}/>
                                                      </li>
                                          ); 
                                          }
                                          else{
                                                return(
                                                      <li key={subidx} id={val+"."+subval}>
                                                            <span>{subval}</span>
                                                            <input type='text' id={val+"."+subval} onChange={(e)=>this.handleChange(e)}/>
                                                      </li>
                                          ); 
                                          }
                                          })}
                              </div>
                            );
                              }
                        }
                        )}
                        <button onClick={()=>this.saveIni()}>Save</button>
                  </div>
            );
      };
}