import React, { Component } from "react";
import $ from "jquery";
import noUiSlider from 'nouislider';
import "nouislider/distribute/nouislider.min.css";
import axios from 'axios';
import * as Survey1 from "survey-react";
import * as widgets from "surveyjs-widgets";

import 'bootstrap/dist/css/bootstrap.css';
import "survey-react/survey.css";


Survey1.StylesManager.applyTheme("bootstrap");

class SurveyComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            json:{},
            questionnaireId: this.props.match.params.QuestionnaireID
        }
       
        window["$"] = window["jQuery"] = $;
        require("emotion-ratings/dist/emotion-ratings.js");
        this.getQuestionnaire=this.getQuestionnaire.bind(this);
        this.sendAnswersToServer=this.sendAnswersToServer.bind(this);
        this.sendParsedResultToServer=this.sendParsedResultToServer.bind(this);
        this.getQuestionnaire();
    }

    async getQuestionnaire(){
        //to do: fix questionnaireId dynamic
          
           let url = `http://localhost:8180/questionnaires/getQuestionnaire/${this.state.questionnaireId}`;
           let response =await axios.get(
            url,
              { 
                  headers: { 
                      'Content-Type': 'application/json',
                     // 'x-auth-token': sessionStorage.getItem("token")
                     'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiJ0cmo4M00zQjBPTHVTZnBVSHBuSzR6aXVqcEV1Y0N3VHZ5LzNjYjQ3MHNzPSIsIlR5cGUiOlsicGF0aWVudCJdLCJpYXQiOjE2MDg2NDgzMDUsImV4cCI6MTY0MDE4NDMwNX0.HysQVw90QVt3saFRM2ujpRXpzDoTkqEGhEl2Xr99-Uw'
                  } 
              });
          
              if(response.data.data){
                  this.setState({
                   title: response.data.data.QuestionnaireEnglishText,
                   description: response.data.data.QuestionnaireText,
                 
                  });
            //      console.log(response.data.data.QuestionnaireEnglishText);
              //    console.log(response.data.data.QuestionnaireText);
                //  console.log(response.data.data.Questions);
                  let questions= response.data.data.Questions;
                  let elements=[];
                  let json={};
                  json.title=response.data.data.QuestionnaireEnglishText;
                  for (let i=0;i<questions.length;i++){
                      let singleQuestion={};
                      singleQuestion.title=questions[i].QuestionText;
                   if (questions[i].Type === "EQ5"){
                       singleQuestion.type="nouislider";
                      singleQuestion.name=response.data.data.QuestionnaireText;
                     
                   }
                   else if (questions[i].Type === "Single"){
                    singleQuestion.type= "radiogroup";
                    singleQuestion.isRequired= true;
                    let choices=[]; 
                    for (let j=0;j<questions[i].Answers.length;j++){
                        choices.push(questions[i].Answers[j]);
                    }
                    singleQuestion.choices=choices;
                }

                else if (questions[i].Type === "multi"){
                    singleQuestion.type="checkbox";
                    singleQuestion.hasNone= true;
                    singleQuestion.colCount= 5;
                    let choices=[]; 
                    for (let j=0;j<questions[i].Answers.length;j++){
                        choices.push(questions[i].Answers[j]);
                    }
                    singleQuestion.choices=choices;
                }
                else if(questions[i].Type === "VAS"){
                    singleQuestion.type= "emotionsratings";
                    singleQuestion.choices= [ "1", "2", "3", "4", "5" ];
                }

                elements.push(singleQuestion);
                  }
                  json.elements=elements;
                  this.setState({json:json});
                 // console.log(json);

              }

              else{
                  console.alert("Problem accured. please try again later.");
              }
   
              }

            async sendParsedResultToServer(result){
                       let url = `http://localhost:8180/auth/patients/answers/sendAnswers`;
                       const response = await axios.post(
                        url,
                        
                        result
                        , 
                        { 
                            headers: { 
                                'Content-Type': 'application/json',
                                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiJ0cmo4M00zQjBPTHVTZnBVSHBuSzR6aXVqcEV1Y0N3VHZ5LzNjYjQ3MHNzPSIsIlR5cGUiOlsicGF0aWVudCJdLCJpYXQiOjE2MDg2NDgzMDUsImV4cCI6MTY0MDE4NDMwNX0.HysQVw90QVt3saFRM2ujpRXpzDoTkqEGhEl2Xr99-Uw'
                            }
                        }
                      );

                          var token = response.data.data;
                          if(!token){
                              this.setState({
                                  wrongA: true
                              })
                          }
                          else{
                              this.setState({
                                  showID: false,
                                  showWrongUser: false,
                                  showQ: false,
                                  showChange: true,
                                  register: false,
                                  token: token
                              })
                          }


            }

            async sendAnswersToServer(serveryResult){
                if (serveryResult!=null){
                    const result={};
                    //to do fix dynamicly
                    result.UserID=localStorage.getItem("UserId");   //not sure if needed
                    result.QuestionnaireID=this.state.questionnaireId; 
                    result.ValidTime=new Date().getTime();
                    let totalAnswers=[];
                    let counter=0;
                    for (var i in serveryResult) {
                        if (Object.prototype.hasOwnProperty.call(serveryResult, i)) {
                           
                        let question={};
                        question.QuestionID=counter;
                        counter++;
                        let answers=[];
                        
                        if (Array.isArray(serveryResult.i)){
                        for(let j=0; j<serveryResult.i.length;j++){
                        answers.push(serveryResult[i][j].answerID);
                    }
                

                }else {
                    if (Object.prototype.hasOwnProperty.call(serveryResult[i], "answerID")) 
                    answers.push(serveryResult[i].answerID);

                    else
                    answers.push(parseInt(serveryResult[i]));
                }

                    question.AnswerID=answers;
                    totalAnswers.push(question);
                }
            }
                result.Answers=totalAnswers;
                console.log (result);
                this.sendParsedResultToServer(result);

              }
            }

    render() {
        widgets.nouislider(Survey1);
        widgets.emotionsratings(Survey1);

const survey = new Survey1.Model(this.state.json);
survey.onComplete.add(
             (result)=> {
            console.log(JSON.stringify(result.data, null, 3));
            this.sendAnswersToServer(result.data);

    });


        return (
          
            <Survey1.Survey
                model={survey}
            />
    
        );
    }
}

export default SurveyComponent;
