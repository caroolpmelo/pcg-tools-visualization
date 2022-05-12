import React, {useEffect, useState} from 'react'
import './App.css';
import Sunburst from 'react-d3-zoomable-sunburst';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
import json from "./data";

const SHEET_API = 'https://opensheet.elk.sh/1hJsZNdIPiENQZYqi2P75RMJmYcCeUtHBC6UalZ-fjE8/Tools+API';

function fetchData() {
  return fetch(SHEET_API)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log('Error:', e);
    });
}

function formatData(data) {
  const childrenData = [...new Set(data.map(d => d.Area))].map(Area => {
    return {
      "name": Area,
      "children": data.filter(d => d.Area === Area).map(d => {
        return {
          "name": d.Method,
          "children": data.filter(a => a.Method === d.Method).map(() => {
            return {
              "name": d.Algorithm,
              "children": data.filter(b => b.Algorithm === d.Algorithm).map(() => {
                return {
                  "name": d.Tools,
                  "Count": parseInt(d.Count)
                }
              })
            }
          })
        }
      })
    }
  });
  console.log("childrenData")
  console.log(childrenData)
  return { "name": "Ferramentas de PCG", "children": childrenData };
}

function App() {
  const [data, setData] = useState({
    data: {},
    criteria: "Count",
  });
  const [apiData, setApiData] = useState({});

  useEffect(() => {
    setApiData(fetchData().then(res => { formatData(res) }))
    console.log("apiData")
    console.log(apiData)
    setData({...data, data: apiData});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // position: absolute;
  // top: 0px;
  // left: 0px;
  // pointer-events: none;
  return (
    <div className="App">
      <Grid item xs={12} md={12} lg={12}>
          <Paper elevation={3}>
            <Sunburst
                data={data.data}
                scale="exponential"
                tooltipContent={ <div class="sunburstTooltip" style="position:absolute; color:'black'; z-index:10; background: #e2e2e2; text-align: center; pointer-events: none;" /> }
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
