async function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  const defaultURL = "/metadata/"+sample;
    let data = await d3.json(defaultURL);
    const layout = { margin: { t: 30, b: 100 } };
  
  let panel = d3.select("#sample-metadata")
    //panel.append("text").text(Object.entries(data))
    //console.log(Object.entries(data))
   // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    panel.html("")
    Object.entries(data).forEach(d => panel.append("text").text(d[0] + d[1]).append("br"));

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

async function buildCharts(sample) {
  const defaultURL = "/samples/" + sample;
  let data = await d3.json(defaultURL);
  //const layout = { margin: { t: 30, b: 100 } };
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let pie_data = {
    labels: data.otu_ids.slice(0, 10),
    values: data.sample_values.slice(0, 10),
    hovertext: data.otu_labels.slice(0, 10),
    type: "pie"
  }
  let layout = {
      title: "Belly Button Dataset"
    }
  Plotly.newPlot("pie", [pie_data], layout);
    // @TODO: Build a Bubble Chart using the sample data
  let bubble_data = {
    type: "scatter",
    x: data.otu_ids,
    y: data.sample_values,
    name: "Belly Button Dataset",
    text: data.otu_labels,
    mode: 'markers',
    marker: {
      size: data.sample_values,
      color: data.otu_ids
    }
  }
  
  //let layout = {
    //title: "Belly Button Data"
  //}
  Plotly.newPlot("bubble", [bubble_data], layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

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
