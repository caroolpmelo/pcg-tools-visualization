import React, {useEffect, useState} from 'react'
import './App.css';
import Sunburst from 'react-d3-zoomable-sunburst';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
// import json from "./data";

const SHEET_API = 'https://opensheet.elk.sh/1hJsZNdIPiENQZYqi2P75RMJmYcCeUtHBC6UalZ-fjE8/Tools+API';

var formatedData = { "name": "Ferramentas de PCG", "children": []};

async function GetData() {
  const response = await fetch(SHEET_API);
  const data = await response.json();
  return data;
}

async function FormatData() {
  const data = await GetData();
  // console.log(data);

  data.forEach(({ Area, Method, Algorithm, Tools, Count }) => {
    // check if Area exists
    if (formatedData["children"].some(areaItem => { return areaItem["name"] == Area })) {
      formatedData["children"].some(areaItem => {
        if (areaItem["name"] == Area){
          // check if Method exists
          if (areaItem["children"].some(methodItem => { return methodItem["name"] == Method })) {
            areaItem["children"].some(methodItem => {
              if (methodItem["name"] == Method) {
                //check if Algorithm exists
                if (methodItem["children"].some(algorithmItem => { return algorithmItem["name"] == Algorithm })) {
                  methodItem["children"].some(algorithmItem => {
                    if (algorithmItem["name"] == Algorithm) {
                      // check if Tools exists
                      // if (algorithmItem["children"].some(toolsItem => { return toolsItem["name"] == Tools })) {
                      //   // algorithmItem["children"].some(toolsItem => {
                      //   //   if(toolsItem["name"] == Tools) {
                      //   //     // if (!toolsItem["Count"]) {
                      //   //     //   // toolsItem["Count"] = Count;
                      //   //     // }
                      //   //   }
                      //   // });
                      //   console.log('nao tem')
                      // } else {
                        console.log('q')
                        if (Count) {
                          var newData = {
                            "name": Tools,
                            "Count": parseInt(Count)
                          };
                          algorithmItem["children"].push(newData);
                        }
                        // var newData = {
                        //   "name": Tools,
                        //   "children": [
                        //     {
                        //       "name": "Count",
                        //       "Count": Count
                        //     }
                        //   ]
                        // };
                        console.log("newData:" + newData)
                      // }
                    }
                  });
                } else {
                  var newData = {
                    "name": Algorithm,
                    "children": [
                      { "name": Tools }
                    ]
                  };
                  methodItem["children"].push(newData);
                }
              }
            });
          } else { // Method does not exist, create new
            // areaItem["children"] = [{"name": Method}];
            var newData = {
              "name": Method,
              "children": [
                {
                  "name": Algorithm,
                  "children": [
                    { "name": Tools }
                  ]
                }
              ]
            };
            areaItem["children"].push(newData);
          }
        }
      });
    } else { // Area does not exist, create new
      var newData = {
        "name": Area,
        "children": [
          {
            "name": Method,
            "children": [
              {
                "name": Algorithm,
                "children": [
                  { "name": Tools }
                ]
              }
            ]
          }
        ]
      };
      formatedData["children"].push(newData);
    }
  });
  console.log("FINAL");
  console.log(formatedData);
}

function App() {
  const [data, setData] = useState({
    data: {},
    criteria: "Count",
  });

  useEffect(() => {
    FormatData();
    setData({...data, data: formatedData});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Grid item xs={12} md={12} lg={12}>
          <Paper elevation={3}>
            <Sunburst
                data={data.data}
                scale="exponential"
                tooltipContent={ <div class="sunburstTooltip" style="position:absolute; color:'black'; z-index:10; background: #e2e2e2; padding: 5px; text-align: center;" /> }
                tooltip
                tooltipPosition="right"
                keyId="Sunburst"
                width={window.innerWidth * 0.8}
                value={data.criteria}
                height={window.innerHeight * 0.8}
            />
          </Paper>
        </Grid>
    </div>
  );
}

export default App;
