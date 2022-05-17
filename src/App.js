import React, { useEffect, useState } from 'react'
import './App.css';
import Sunburst from 'react-d3-zoomable-sunburst';
import { Paper } from '@mui/material';
import { Grid } from '@mui/material';
// import json from "./data";
import * as d3 from "d3";

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

function testD3Group(data) {
  const grouped = d3.groups(data, d => d.Area, d => d.Method, d => d.Algorithm, d => d.Tools);
  const toolsCount = d3.rollup(data, v => v.length, d => d.Algorithm);
  // d => {return {"name": d.Tools, "Count": parseInt(d.Count)}});
  console.log("grouped %o", grouped);
  console.log("toolsCount %o", toolsCount);

  const myHierarchy = d3.hierarchy(grouped);
  console.log("myHierarchy %o", myHierarchy);

  const mapTest = grouped.map(areaItem => {
    return {
      "name": areaItem[0],
      "children": areaItem[1].map(methodItem => {
        return {
          "name": methodItem[0],
          "children": methodItem[1].map(algorithmItem => {
            return {
              "name": algorithmItem[0],
              "children": algorithmItem[1].map(toolItem => {
                return {
                  "name": toolItem[0],
                  "Count": parseInt(toolItem[1][0].Count)
                }
              })
            }
          })
        }
      })
    }
  })
  console.log("mapTest %o", mapTest);

  return { "name": "Ferramentas de PCG", "children": mapTest };
}

// function formatData(data) {
//   const setArea = [...new Set(data.map(d => d.Area))];
//   const setTest = setArea.map(areaValue => {
//     return {
//       "name": areaValue,
//       "children": data.filter(valueB => {
//         d3.group(data, d => d.Area)
//       })
//     }
//   });
//   // console.log("setTEst %o", setTest);

//   const childrenData = [...new Set(data.map(d => d.Area))].map(Area => {
//     return {
//       "name": Area,
//       "children": data.filter(d => d.Area === Area).map(d => {
//         return {
//           "name": d.Method,
//           "children": data.filter(a => a.Method === d.Method).map(() => {
//             return {
//               "name": d.Algorithm,
//               "children": data.filter(b => b.Algorithm === d.Algorithm).map(() => {
//                 return {
//                   "name": d.Tools,
//                   "Count": parseInt(d.Count)
//                 }
//               })
//             }
//           })
//         }
//       })
//     }
//   });
//   // console.log("childrenData")
//   // console.log(childrenData)
//   return { "name": "Ferramentas de PCG", "children": childrenData };
// }

function App() {
  const [data, setData] = useState({});
  // const [apiData, setApiData] = useState({});

  const tooltopStyle = {
    position:'absolute',
    color:'black',
    'z-index':10,
    background: '#e2e2e2',
    'text-align': 'center',
    'pointer-events': 'none'
  };

  useEffect(() => {
    const asyncFunction = async () => {
      const res = await fetchData();
      // console.log("fetchdata %o", res)

      // testD3Group(res);
      // const formatedData = formatData(res);
      const formatedData = testD3Group(res);
      // setApiData(formatedData)
      console.log("formatedData %o", formatedData)
      setData(formatedData);
    }
    asyncFunction();

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
            data={data}
            scale="exponential"
            tooltipContent={<div class="sunburstTooltip" style={tooltopStyle} />}
            tooltip
            tooltipPosition="right"
            keyId="Sunburst"
            width={window.innerWidth * 0.8}
            value={"Count"}
            height={window.innerHeight * 0.8}
          />
        </Paper>
      </Grid>
    </div>
  );
}

export default App;
