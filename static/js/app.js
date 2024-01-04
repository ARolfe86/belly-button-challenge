const url =  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let testSubjects = null;

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    // Translate data to an object array
    testSubjects = Translate(data);

    // Fill drop down menu
    fillDropdown(testSubjects);

    // Set initial data subject
    optionChanged(0);
});

function Translate(data) {
    let result = [];
    for (let i = 0; i < data.names.length; i++) {

        // Bubble sort
        for (let x = 0; x < data.samples[i].sample_values.length; x++) {
            for (let y = 0; y < data.samples[i].sample_values.length; y++) {
                if (data.samples[i].sample_values[x] > data.samples[i].sample_values[y]) {
                    // Swap sample values
                    let temp = data.samples[i].sample_values[x];
                    data.samples[i].sample_values[x] = data.samples[i].sample_values[y];
                    data.samples[i].sample_values[y] = temp;

                    // Swap otuIDs values
                    temp = data.samples[i].otu_ids[x];
                    data.samples[i].otu_ids[x] = data.samples[i].otu_ids[y];
                    data.samples[i].otu_ids[y] = temp;

                    // Swap otuLabels values
                    temp = data.samples[i].otu_labels[x];
                    data.samples[i].otu_labels[x] = data.samples[i].otu_labels[y];
                    data.samples[i].otu_labels[y] = temp;
                }

            }
        }
        // Create a test subject object
        let subject = {
            id: data.metadata[i].id,
            ethnicity: data.metadata[i].ethnicity,
            gender: data.metadata[i].gender,
            age: data.metadata[i].age,
            location: data.metadata[i].location,
            bbtype: data.metadata[i].bbtype,
            wfreq: data.metadata[i].wfreq,
            name: data.names[i],
            otuIds: data.samples[i].otu_ids,
            otuLabels: data.samples[i].otu_labels,
            sampleValues: data.samples[i].sample_values
        };
        result.push(subject);
    }
    return result;
}
        // Fill drop down with subject IDs
function fillDropdown(data) {
    let dropdown = d3.select("#selDataset");

    data.forEach(function(element, index) {
        let option = dropdown.append("option");
        option.property("value", index);
        option.text(element.name);
    });
}
        // Manually initialize the graph and metadata for the first subject
function optionChanged(index) {
    index = parseInt(index);
    updateMetadata(index);
    drawBarGraph(index);
    drawBubbleGraph(index);
}
        // Update the metadata panel for the selected subject
function updateMetadata(index) {
    let subject = testSubjects[index];

    let displayData = `<p>id: ${subject.id}</p>`;
    displayData += `<p>ethnicity: ${subject.ethnicity}</p>`;
    displayData += `<p>gender: ${subject.gender}</p>`;
    displayData += `<p>age: ${subject.age}</p>`;
    displayData += `<p>location: ${subject.location}</p>`;
    displayData += `<p>bbtype: ${subject.bbtype}</p>`;
    displayData += `<p>wfreq: ${subject.wfreq}</p>`;

    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(displayData);
} 
        // Plot bar graph
function drawBarGraph(index) {
    let subject = testSubjects[index];

    let trace = {
        x: subject.sampleValues.slice(0,10).reverse(),
        y: subject.otuIds.map(function (s){return "OTU " + s}).slice(0,10).reverse(),
        text: subject.otuLabels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h'
    };
    let data = [trace];
Plotly.newPlot("bar", data);  
};
        // Plot bubble graph
function drawBubbleGraph(index) {
    let subject = testSubjects[index];

    let trace = {
        x: subject.otuIds,
        y: subject.sampleValues,
        mode: 'markers',
        marker: {
            size: subject.sampleValues,
            color: subject.otuIds,
        },
        text: subject.otuLabels
    
    };
    let data = [trace];
Plotly.newPlot("bubble", data);
};