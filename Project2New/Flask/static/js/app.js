function buildMetadata(sample) {

  
    d3.json(`/metadata/${sample}`).then((data) => {
    console.log(data);

    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key}: ${value}`);
    });

  }); //end of metadata

  
  
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then((data) => {
    console.log(data);
    // not the best practices
    var topTenData = data.sample_values.map(function(a, b) {
      return {index: b, value: a}; });
    
    //descending orders
    topTenData.sort((a, b) => b.value - a.value)  ;

    topTenData = Object.entries(topTenData).slice(0,10).map(entry => entry[1]);
    console.log(topTenData);

    var pieData ={
        values: [] ,
        labels: [],
        hovertext:[],
        hoverinfo: "hovertext",
        type: "pie"
      };

    var pieLayout = {
		autosize: false,
		width: 700,
		height: 700
		//rgin: { t: 0, l: 0 }
    };
    


    Object.entries(topTenData).forEach(function([index, value]) {
      var key =value.index;
      pieData.values.push(data.sample_values[key]);
      pieData.labels.push(data.otu_ids[key]);
      //pieData.hovertext.push(data.otu_labels[key]);
      //pieData.text.push()
    });
console.log(pieData);
pieData = [pieData]
Plotly.plot("pie", pieData, pieLayout);



var bubbleLayout = {
  margin: { t: 0 },
  hovermode: "closest",
  title: "Top 10 Causes of Deaths" 
};
var bubbleData = [
  {
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: "markers",
    marker: {
      size: data.sample_values * 1.2,
      color: data.otu_ids,
      colorscale: "Blue"
    }
  }
];

Plotly.plot("bubble", bubbleData, bubbleLayout);

});
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // populate drop down box
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
