import React, {Component} from "react"
import {ExportCSV} from "./ExportCSV"
import "./Table.css"


class TableAns extends Component {
    constructor(props) {
        super()
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({[name]: checked }) : this.setState({ [name]: value })
    }
    
    


    render() {
        if(this.props.ready){
            var noData = false;
            if(this.props.data.length > 0){
                var i, week = false;
                var arr = []
                var dates = []
                let data = this.props.data;
                var table = {};
                var exportCSV = [];
                var dateO = new Date(this.props.date), dateOStr;
                var avgO = {};
                avgO["before"] = {sum: 0, counter: 0, text: ""};
                avgO["after"] = {sum: 0, counter: 0, text: ""};
                if(this.props.weekly){
                    var day = dateO.getDay();
                    var sun = new Date(this.props.date - day * 86400000);
                    var sat = new Date(sun.getTime() + 518400000);
                    dateOStr = sun.toLocaleDateString('en-GB', {day: 'numeric'}) + "-" + sat.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
                }
                if(this.props.monthly){
                    dateOStr = dateO.toLocaleDateString('en-GB', {month: 'short'});
                }
                var last = Math.min();
                for(i = 0; i < data.length; i++){
                    if(this.props.showDaily){
                        var date = new Date(data[i].ValidTime);
                        var dateStr = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'}).replace(/ /g, '-');
                        var text = "";
                        for(var j = 0 ; j < data[i]["Answers"][1]["AnswerID"].length; j++){
                            if(data[i]["Answers"][1]["AnswerID"][j] === 0){
                                text = text + "לא נטלתי, "
                            }
                            else if(data[i]["Answers"][1]["AnswerID"][j] === 1){
                                text = text + "בסיסית, "
                            }
                            else if(data[i]["Answers"][1]["AnswerID"][j] === 2){
                                text = text + "מתקדמת, "
                            }
                            else if(data[i]["Answers"][1]["AnswerID"][j] === 3){
                                text = text + "נרקוטית, "
                            }
                        }
                        text = text.slice(0, -2);
                        var d = new Date(data[i].ValidTime);
                        d.setHours(0,0,0,0);
                        dateO.setHours(0,0,0,0);
                        var num = Math.floor((d.getTime() - this.props.date) / 86400000);
                        if(num < 0){
                            num++;
                        }
                        if(last === num){
                            num++;
                        }
                        last = num;
                        if(!this.props.date){
                            num = "-"
                        }
                        arr.push(
                            <tr key={i}>
                                {(data[i].ValidTime < this.props.date || !this.props.date) ? <td className="before">{num}</td> : <td className="after">{num}</td>}
                                {(data[i].ValidTime < this.props.date || !this.props.date) ? <td className="before">{dateStr}</td> : <td className="after">{dateStr}</td>}
                                {(data[i].ValidTime < this.props.date || !this.props.date) ? <td className="before">{data[i]["Answers"][0]["AnswerID"][0]}</td> : <td className="after">{data[i]["Answers"][0]["AnswerID"][0]}</td>}
                                {(data[i].ValidTime < this.props.date || !this.props.date) ? <td className="before">{text}</td> : <td className="after">{text}</td>}
                            </tr>
                        )
                        var line = {};
                        line["מספר יום"] = num;
                        line["תאריך"] = dateStr;
                        line["רמת כאב"] = data[i]["Answers"][0]["AnswerID"][0];
                        line["תרופה"] = text;
                        exportCSV.push(line);
                    }
                    else if(this.props.weekly){
                        date = new Date(data[i].ValidTime)
                        var dayOfWeek = date.getDay();
                        var sunday = new Date(data[i].ValidTime - dayOfWeek * 86400000);
                        var saturday = new Date(sunday.getTime() + 518400000);
                        dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + "-" + saturday.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
                        if(dateOStr === dateStr){
                            if(data[i].ValidTime < this.props.date){
                                avgO["before"]["sum"] += data[i]["Answers"][0]["AnswerID"][0];
                                avgO["before"]["counter"]++;
                                for(j = 0; j < data[i]["Answers"][1]["AnswerID"].length; j++){
                                    if(!avgO["before"]["text"].includes("לא נטלתי") && data[i]["Answers"][1]["AnswerID"][j] === 0){
                                        avgO["before"]["text"] += "לא נטלתי, "
                                    }
                                    else if(!avgO["before"]["text"].includes("בסיסית") && data[i]["Answers"][1]["AnswerID"][j] === 1){
                                        avgO["before"]["text"] += "בסיסית, "
                                    }
                                    else if(!avgO["before"]["text"].includes("מתקדמת") && data[i]["Answers"][1]["AnswerID"][j] === 2){
                                        avgO["before"]["text"] += "מתקדמת, "
                                    }
                                    else if(!avgO["before"]["text"].includes("נרקוטית") && data[i]["Answers"][1]["AnswerID"][j] === 3){
                                        avgO["before"]["text"] += "נרקוטית, "
                                    }
                                }
                            }
                            else{
                                avgO["after"]["sum"] += data[i]["Answers"][0]["AnswerID"][0];
                                avgO["after"]["counter"]++;
                                for(j = 0; j < data[i]["Answers"][1]["AnswerID"].length; j++){
                                    if(!avgO["after"]["text"].includes("לא נטלתי") && data[i]["Answers"][1]["AnswerID"][j] === 0){
                                        avgO["after"]["text"] += "לא נטלתי, "
                                    }
                                    else if(!avgO["after"]["text"].includes("בסיסית") && data[i]["Answers"][1]["AnswerID"][j] === 1){
                                        avgO["after"]["text"] += "בסיסית, "
                                    }
                                    else if(!avgO["after"]["text"].includes("מתקדמת") && data[i]["Answers"][1]["AnswerID"][j] === 2){
                                        avgO["after"]["text"] += "מתקדמת, "
                                    }
                                    else if(!avgO["after"]["text"].includes("נרקוטית") && data[i]["Answers"][1]["AnswerID"][j] === 3){
                                        avgO["after"]["text"] += "נרקוטית, "
                                    }
                                }
                            }
                            if(!week){
                                dates.push(data[i].ValidTime);
                                week = true;
                            }
                            continue;
                        }
                        if(table[dateStr] == null){
                            table[dateStr] = {};
                            table[dateStr]["sum"] = 0;
                            table[dateStr]["counter"] = 0;
                            table[dateStr]["text"] = "";
                            dates.push(data[i].ValidTime);
                        }
                        table[dateStr]["sum"] += data[i]["Answers"][0]["AnswerID"][0];
                        table[dateStr]["counter"]++;
                        for(j = 0 ; j < data[i]["Answers"][1]["AnswerID"].length; j++){
                            if(!table[dateStr]["text"].includes("לא נטלתי") && data[i]["Answers"][1]["AnswerID"][j] === 0){
                                table[dateStr]["text"] += "לא נטלתי, "
                            }
                            else if(!table[dateStr]["text"].includes("בסיסית") && data[i]["Answers"][1]["AnswerID"][j] === 1){
                                table[dateStr]["text"] += "בסיסית, "
                            }
                            else if(!table[dateStr]["text"].includes("מתקדמת") && data[i]["Answers"][1]["AnswerID"][j] === 2){
                                table[dateStr]["text"] += "מתקדמת, "
                            }
                            else if(!table[dateStr]["text"].includes("נרקוטית") && data[i]["Answers"][1]["AnswerID"][j] === 3){
                                table[dateStr]["text"] += "נרקוטית, "
                            }
                        }
                        
                    }
                    else if(this.props.monthly){
                        date = new Date(data[i].ValidTime)
                        dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                        if(dateOStr === dateStr){
                            if(data[i].ValidTime < this.props.date){
                                avgO["before"]["sum"] += data[i]["Answers"][0]["AnswerID"][0];
                                avgO["before"]["counter"]++;
                                for(j = 0; j < data[i]["Answers"][1]["AnswerID"].length; j++){
                                    if(!avgO["before"]["text"].includes("לא נטלתי") && data[i]["Answers"][1]["AnswerID"][j] === 0){
                                        avgO["before"]["text"] += "לא נטלתי, "
                                    }
                                    else if(!avgO["before"]["text"].includes("בסיסית") && data[i]["Answers"][1]["AnswerID"][j] === 1){
                                        avgO["before"]["text"] += "בסיסית, "
                                    }
                                    else if(!avgO["before"]["text"].includes("מתקדמת") && data[i]["Answers"][1]["AnswerID"][j] === 2){
                                        avgO["before"]["text"] += "מתקדמת, "
                                    }
                                    else if(!avgO["before"]["text"].includes("נרקוטית") && data[i]["Answers"][1]["AnswerID"][j] === 3){
                                        avgO["before"]["text"] += "נרקוטית, "
                                    }
                                }
                            }
                            else{
                                avgO["after"]["sum"] += data[i]["Answers"][0]["AnswerID"][0];
                                avgO["after"]["counter"]++;
                                for(j = 0; j < data[i]["Answers"][1]["AnswerID"].length; j++){
                                    if(!avgO["after"]["text"].includes("לא נטלתי") && data[i]["Answers"][1]["AnswerID"][j] === 0){
                                        avgO["after"]["text"] += "לא נטלתי, "
                                    }
                                    else if(!avgO["after"]["text"].includes("בסיסית") && data[i]["Answers"][1]["AnswerID"][j] === 1){
                                        avgO["after"]["text"] += "בסיסית, "
                                    }
                                    else if(!avgO["after"]["text"].includes("מתקדמת") && data[i]["Answers"][1]["AnswerID"][j] === 2){
                                        avgO["after"]["text"] += "מתקדמת, "
                                    }
                                    else if(!avgO["after"]["text"].includes("נרקוטית") && data[i]["Answers"][1]["AnswerID"][j] === 3){
                                        avgO["after"]["text"] += "נרקוטית, "
                                    }
                                }
                            }
                            if(!week){
                                dates.push(data[i].ValidTime);
                                week = true;
                            }
                            continue;
                        }
                        if(table[dateStr] == null){
                            table[dateStr] = {};
                            table[dateStr]["sum"] = 0;
                            table[dateStr]["counter"] = 0;
                            table[dateStr]["text"] = "";
                            dates.push(data[i].ValidTime);
                        }
                        table[dateStr]["sum"] += data[i]["Answers"][0]["AnswerID"][0];
                        table[dateStr]["counter"]++;
                        for(j = 0 ; j < data[i]["Answers"][1]["AnswerID"].length; j++){
                            if(!table[dateStr]["text"].includes("לא נטלתי") && data[i]["Answers"][1]["AnswerID"][j] === 0){
                                table[dateStr]["text"] += "לא נטלתי, "
                            }
                            else if(!table[dateStr]["text"].includes("בסיסית") && data[i]["Answers"][1]["AnswerID"][j] === 1){
                                table[dateStr]["text"] += "בסיסית, "
                            }
                            else if(!table[dateStr]["text"].includes("מתקדמת") && data[i]["Answers"][1]["AnswerID"][j] === 2){
                                table[dateStr]["text"] += "מתקדמת, "
                            }
                            else if(!table[dateStr]["text"].includes("נרקוטית") && data[i]["Answers"][1]["AnswerID"][j] === 3){
                                table[dateStr]["text"] += "נרקוטית, "
                            }
                        }
                    }
                    
                }
                dates = dates.sort();
                if(this.props.weekly || this.props.monthly){
                    for (let [key,] of Object.entries(table)) {
                        table[key]["Data"] = table[key]["sum"] / table[key]["counter"];
                    }
                    var o = new Date(this.props.date);
                    for(i = 0; i < dates.length; i++){
                        date = new Date(dates[i]);
                        d = new Date(dates[i]);
                        d.setHours(0,0,0,0);
                        if(this.props.weekly){
                            var sundayO = new Date(o.getTime() - o.getDay() * 86400000);
                            sundayO.setHours(0,0,0,0);
                            dayOfWeek = date.getDay();
                            sunday = new Date(date.getTime() - dayOfWeek * 86400000);
                            sunday.setHours(0,0,0,0);
                            saturday = new Date(sunday.getTime() + 518400000);
                            dateStr = sunday.toLocaleDateString('en-GB', {day: 'numeric'}) + "-" + saturday.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
                            num = Math.floor((sunday.getTime() - sundayO.getTime()) / 604800000);
                        }
                        else{
                            var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
                            var firstDayO = new Date(o.getFullYear(), o.getMonth(), 1);
                            num = Math.floor((firstDay.getTime() - firstDayO.getTime()) / 2419200000);
                            if(num < 0){
                                num++;
                            }
                            dateStr = date.toLocaleDateString('en-GB', {month: 'short'});
                        }
                        if(last === num){
                            num++;
                        }
                        last = num;
                        if(!this.props.date){
                            num = "-"
                        }
                        if(dateStr === dateOStr){
                            avgO["before"]["text"] =  avgO["before"]["text"].slice(0, -2);
                            avgO["after"]["text"] =  avgO["after"]["text"].slice(0, -2);
                            arr.push(
                                <tr key={dateStr + "before"}>
                                    <td className="before">{num}</td>
                                    <td className="before">{dateStr}</td>
                                    {avgO["before"]["counter"] ? <td className="before">{(avgO["before"]["sum"] / avgO["before"]["counter"]).toFixed(2)}</td> : <td className="before">-</td>}
                                    {avgO["before"]["counter"] ? <td className="before">{avgO["before"]["text"]}</td> : <td className="before">-</td>}
                                </tr>
                            )
                            arr.push(
                                <tr key={dateStr + "after"}>
                                    <td className="after">{num}</td>
                                    <td className="after">{dateStr}</td>
                                    {avgO["after"]["counter"] ? <td className="after">{(avgO["after"]["sum"] / avgO["after"]["counter"]).toFixed(2)}</td> : <td className="after">-</td>}
                                    {avgO["after"]["counter"] ? <td className="after">{avgO["after"]["text"]}</td> : <td className="after">-</td>}
                                </tr>
                            )
                            var z = 0;
                            line = {};
                            if(this.props.date){
                                if(this.props.weekly){
                                    line["מספר שבוע"] = z;
                                }
                                else{
                                    line["מספר חודש"] = z;
                                }
                            }
                            line["תאריך"] = dateStr;
                            line["רמת כאב"] = (avgO["before"]["sum"] / avgO["before"]["counter"]).toFixed(2);
                            line["תרופות שהיו בשימוש"] = avgO["before"]["text"];
                            exportCSV.push(line);
                            line = {};
                            if(this.props.date){
                                if(this.props.weekly){
                                    line["מספר שבוע"] = z;
                                }
                                else{
                                    line["מספר חודש"] = z;
                                }
                            }
                            line["תאריך"] = dateStr;
                            line["רמת כאב"] = (avgO["after"]["sum"] / avgO["after"]["counter"]).toFixed(2);
                            line["תרופות שהיו בשימוש"] = avgO["after"]["text"];
                            exportCSV.push(line);
                            continue;
                        }
                        table[dateStr]["text"] =  table[dateStr]["text"].slice(0, -2);
                        arr.push(
                            <tr key={dateStr}>
                                 {(dates[i] < this.props.date || !this.props.date) ? <td className="before">{num}</td> : <td className="after">{num}</td>}
                                {(dates[i] < this.props.date || !this.props.date) ? <td className="before">{dateStr}</td> : <td className="after">{dateStr}</td>}
                                {(dates[i] < this.props.date || !this.props.date) ? <td className="before">{table[dateStr]["Data"].toFixed(2)}</td> : <td className="after">{table[dateStr]["Data"].toFixed(2)}</td>}
                                {(dates[i] < this.props.date || !this.props.date) ? <td className="before">{table[dateStr]["text"]}</td> : <td className="after">{table[dateStr]["text"]}</td>}
                            </tr>
                        )
                        line = {};
                        if(this.props.date){
                            if(this.props.weekly){
                                line["מספר שבוע"] = num;
                            }
                            else{
                                line["מספר חודש"] = num;
                            }
                        }
                        line["תאריך"] = dateStr;
                        line["רמת כאב"] = table[dateStr];
                        if(this.props.showDaily){
                            line["תרופה"] = text;
                        }
                        else{
                            line["תרופות שהיו בשימוש"] =  table[dateStr]["text"];
                        }
                        exportCSV.push(line);
                    }
                }
            }
            else{
                noData = true;
            }
        }
        return(
            <div>
                {this.props.ready ? <div>{noData ? <h4>לא קיים מידע על המשתמש</h4> :
                    <div className="center">
                    <table style={{width: "100%"}} id="daily" className="tabels">
                        <tbody>
                            <tr>
                                { this.props.showDaily ? <th>מספר יום</th> : null}
                                { this.props.weekly ? <th>מספר שבוע</th> : null} 
                                { this.props.monthly ? <th>מספר חודש</th> : null}
                                <th>תאריך</th>
                                <th>רמת כאב</th>
                                {this.props.showDaily ? <th>תרופה</th> : <th>תרופות שהיו בשימוש</th>}
                            </tr>
                            {arr}
                        </tbody>
                    </table>
                    <ExportCSV csvData={exportCSV} fileName={this.props.name + " שאלון יומי"}/>
                    </div>}  </div> : null}
            </div>
        )
    }
}

export default TableAns