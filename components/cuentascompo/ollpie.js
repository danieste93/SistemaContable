<Pie data={superdata} plugins={[ChartDataLabels]}  options={{
  
  responsive: true,
    
      legend: { display: false},
      plugins: {
        legend : {
          onClick:   (e, legendItem, legend) =>{
            const index = legendItem.datasetIndex;
            const type = legend.chart.config.type;
          
            if (type === 'pie' || type === 'doughnut') {
              pieDoughnutLegendClickHandler(e, legendItem, legend)
            } else {
              defaultLegendClickHandler(e, legendItem, legend);
            }
          
            
      
          }
          },
        datalabels: {
            backgroundColor: function(context) {
                return "white";
              },
            formatter: (value, ctx) => {
                let sum = 0;
                let ci = ctx.chart;
             
                let dataArr = ctx.chart.data.datasets[0].data;
                let acc = 0
                dataArr.forEach((d, i) => {
                  if (ci.getDataVisibility(i)) {
                    acc += d;
                  }
                });
                let percentage = (value*100 / acc).toFixed(0)+"%";
                return percentage;
            },
            color: 'black',
            borderRadius: 25,
            padding: 5,
            font: {
                size:"15px",
                weight: 'bold'
              },
        }}
   
    }} />