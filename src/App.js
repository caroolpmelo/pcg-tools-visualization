import React, { useEffect, useState } from 'react'
import './App.css';
import Sunburst from 'react-d3-zoomable-sunburst';
import { Grid, Card } from '@mui/material';
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

function formatDataAsD3Group(data) {
  const groupedData = d3.groups(data, d => d.Area, d => d.Method, d => d.Algorithm, d => d.Tools);
  const algorithmsCount = d3.rollups(data, v => v.length, d => d.Algorithm);

  console.log("groupedData %o", groupedData);
  console.log("algorithmsCount %o", algorithmsCount);

  const groupedDataMap = groupedData.map(areaItem => {
    return {
      "name": areaItem[0],
      "children": areaItem[1].map(methodItem => {
        return {
          "name": methodItem[0],
          "children": methodItem[1].map(algorithmItem => {
            const foundAlgorithm = algorithmsCount.find(element => element[0] === algorithmItem[0]);
            return {
              "name": algorithmItem[0],
              "Count": foundAlgorithm[1],
              "toolsList": algorithmItem[1]
            }
          })
        }
      })
    }
  })
  console.log("groupedDataMap %o", groupedDataMap);

  return { "name": "Ferramentas de PCG", "children": groupedDataMap };
}

function App() {
  const [data, setData] = useState({});
  const [toolsList, setToolsList] = useState([]);
  
  const tooltopStyle = {
    position: 'absolute',
    color: 'black',
    'z-index': 10,
    background: '#e2e2e2',
    'text-align': 'center',
    'pointer-events': 'none'
  };
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    'text-align': 'left', 
    padding: '10px',
    margin: '5px',
    width: '600px'
  }
  const cardDivStyle = { 
    display: 'flex', 
    flexDirection: 'row'
  }

  const onGraphClick = (event) => {
    console.log("CLICK %o", event)
  
    if (event.parent !== null) { // not root
      if (event.children?.length) {
        event.children.forEach(element => {
          if (element.children) {
            element.children.forEach(subelement => {
              setToolsList(subelement.data?.toolsList);
              return;
            })
          }
          setToolsList(element.data?.toolsList);
          return;
        });
      }
      setToolsList(event.data.toolsList)
      return;
    }
  }

  useEffect(() => {
    const asyncFunction = async () => {
      const res = await fetchData();
      const formatedData = formatDataAsD3Group(res);
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
          <a href='https://cutt.ly/LHmWN6f'>Tabela de Dados</a> / <a href='https://github.com/caroolpmelo/pcg-tools-visualization'>Reposit??rio do projeto</a>
          <Sunburst
            data={data}
            scale="exponential"
            tooltipContent={<div class="sunburstTooltip" style={tooltopStyle} />}
            tooltip
            tooltipPosition="right"
            keyId="Sunburst"
            width={window.innerWidth * 0.8}
            value={"Count"}
            height={window.innerHeight * 0.5}
            onSelect={onGraphClick}
          />
          <div style={cardDivStyle}>
              {toolsList?.map((element) => {
                var subelement = element[1][0];
                return (
                <Card variant="outlined" sx={cardStyle} key={element[0]}>
                  <span>
                    Nome da ferramenta: {subelement.Tools}
                  </span>
                  <span>
                    <a href={subelement.Website}>Site</a> da ferramenta
                  </span>
                  <span>
                    Github Stars: {subelement["Github Stars"]}
                  </span>
                  <span>
                    Descri????o: {subelement.Description}
                  </span>
                  <span>
                    Sistema aplic??vel: {subelement["Engines/Systems"]}
                  </span>
                  <span>
                    ??rea de PCG: {subelement.Area}
                  </span>
                  <span>
                    M??todo de PCG: {subelement.Method}
                  </span>
                  <span>
                    Algoritmo de PCG: {subelement.Algorithm}
                  </span>
                </Card>) 
              })}
          </div>
      </Grid>
    </div>
  );
}

export default App;
