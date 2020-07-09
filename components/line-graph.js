const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
const _ = require('lodash');
const Color = require('color');

const dateRange = [1988, 2015]

class LineGraph extends D3Component {
  getWidth() {
    return 800;
  }

  getHeight() {
    return 600;
  }

  // Called on initial component creation --
  // Set up data and persistent svg nodes
  initialize(node, props) {
    const margin = (this.margin = ({ top: 20, right: 160, bottom: 40, left: 60 }))
    const height = (this.height = this.getHeight())
    const width = (this.width = this.getWidth())

    const rawData = (this.rawData = props.data.filter(d => d.year >= dateRange[0] && d.year <= dateRange[1]));
    // Prep data for multi line chart
    // Note to self: a perfect place for synthesis of structure transformation
    // by example...
    const totalEmissions = rawData.filter(d => d.emissions_type === "Total emissions");
    const groupedData = _.groupBy(totalEmissions, d => d["company"]);
    const groupedMap = new Map(Object.entries(groupedData));
    const groupedArray = Array.from(groupedMap, ([name, values]) => ({
      name,
      values,
      ownership: values[0].ownership,
      country: values[0].country,
      region: values[0].region
    }));

    // Prep data for stacked area chart
    let years = _.uniq(totalEmissions.map(d => d.year)).sort()

    // sort companies by 2015 emissions
    this.emissionsPerCompany = _.chain(totalEmissions.filter(d => d.year === 2015))
      .keyBy(d => d.company)
      .mapValues(d => d.value)
      .value()
    this.companies = _.chain(totalEmissions.map(d => d.company))
      .uniq()
      .sortBy(c => {
        // Mostly sort by amount, but fudge a bit--
        // goal is a smoothly readable stacked chart

        if (c === "Gazprom") { return 0; }
        else if (c === "Iraq National Oil Company") { return -1; }
        else { return this.emissionsPerCompany[c] }
      })
      .reverse()
      .value()

    this.dataPerYear = years.map(year => {
      let row = { year: year }
      this.companies.forEach(c => {
        let datapoint = totalEmissions.find(d => d.year === year && d.company === c)
        if (datapoint) {
          row[c] = datapoint.value
        } else {
          row[c] = 0
        }
      })
      return row;
    })

    this.investorCompanies = this.companies.filter(c => totalEmissions.find(d => d.company === c).ownership === "Investor")

    this.investorDataPerYear = years.map(year => {
      let row = { year: year }
      this.investorCompanies.forEach(c => {
        let datapoint = totalEmissions.find(d => d.year === year && d.company === c)
        if (datapoint) {
          row[c] = datapoint.value
        } else {
          row[c] = 0
        }
      })
      return row;
    })

    const data = (this.data = groupedArray)

    const svg = (this.svg = d3.select(node).append('svg'))
    svg.attr("width", width).attr("height", height)

    this.paths = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")

    this.labels = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("text-anchor", "left")

    this.xAxis = svg.append("g").style("font-size", "12px")
    this.yAxis = svg.append("g").style("font-size", "12px")

    // axis labels
    svg.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height) + ")")
      .style("text-anchor", "middle")
      .text("Year");

    svg.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Emissions (MtCO2e)");

    // company details
    let companyTooltipPosition = { x: margin.left + 10, y: margin.top + 10 }
    this.companyTooltip = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .style("text-anchor", "left")
      .style("display", "none")

    this.companyTooltip
      .append("rect")
      .attr("width", "250")
      .attr("height", "75")
      .attr("fill", "rgba(0, 0, 0, 0.05)")
      .attr("x", companyTooltipPosition.x)
      .attr("y", companyTooltipPosition.y)

    this.companyName =
      this.companyTooltip
        .append("text")
        .attr("font-size", 14)
        .attr("font-weight", "bold")
        .attr("x", companyTooltipPosition.x)
        .attr("y", companyTooltipPosition.y)
        .attr("dy", "18px")
        .attr("dx", "12px")

    this.companyOwnership =
      this.companyTooltip
        .append("text")
        .attr("x", companyTooltipPosition.x)
        .attr("y", companyTooltipPosition.y)
        .attr("dy", "36px")
        .attr("dx", "12px")

    this.companyCountry =
      this.companyTooltip
        .append("text")
        .attr("x", companyTooltipPosition.x)
        .attr("y", companyTooltipPosition.y)
        .attr("dy", "50px")
        .attr("dx", "12px")

    this.companyEmissions =
      this.companyTooltip
        .append("text")
        .attr("x", companyTooltipPosition.x)
        .attr("y", companyTooltipPosition.y)
        .attr("dy", "64px")
        .attr("dx", "12px")

    this.ownershipOverlay = svg.append("g")

    this.update(props);
  }

  // Called on component update --
  // do the d3 data join and update the graphic
  update(props, oldProps) {
    let dataForLines;
    const xKey = "year"
    const yKey = "value"

    const margin = this.margin;
    const height = this.getHeight();
    const width = this.getWidth()
    const svg = this.svg

    svg.attr("width", width).attr("height", height)

    const activeStage = props.section;

    let colorPastel = d3.scaleOrdinal(d3.schemeSet3);
    let colorBold = d3.scaleOrdinal(d3.schemeSet3.slice(3));

    let xRange = dateRange;
    let yRange = [0, 12000];

    if (activeStage === "oneCompany") {
      yRange = [0, 2000]
    }

    if (activeStage === "investor") {
      yRange = [0, 6000]
    }

    // Set up axes
    let x = d3.scaleLinear()
      .domain(xRange)
      .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
      .domain(yRange).nice()
      .range([height - margin.bottom, margin.top])

    let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0).tickFormat(d3.format(".4")))

    let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .transition()
      .delay(500)
      .duration(1000)
      .call(d3.axisLeft(y))

    this.xAxis.call(xAxis);
    this.yAxis.call(yAxis);

    let area = d3.area()
      .x(d => x(d.data[xKey]))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))

    if (activeStage === "ownership") {
      this.ownershipOverlay
        .append("text")
        .attr("x", x(2000))
        .attr("y", y(6000))
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .attr("opacity", "0")
        .text("State-owned")

      this.ownershipOverlay
        .append("text")
        .attr("x", x(2000))
        .attr("y", y(1500))
        .attr("font-size", 20)
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .attr("opacity", "0")
        .text("Investor-owned")

      this.ownershipOverlay
        .selectAll("text")
        .transition()
        .delay(500)
        .duration(1000)
        .attr("opacity", "1")
    } else {
      this.ownershipOverlay.selectAll("text").remove()
    }


    let stackedData;

    let companiesSortedByOwnership = _.sortBy(this.companies, c => {
      return [
        this.rawData.find(d => d.company === c).ownership,
        10000 - this.emissionsPerCompany[c] // reverse sort by emissions
      ]
    })

    if (activeStage === "ownership" || activeStage === "investor") {
      stackedData = d3.stack().keys(this.companies).order(series => {
        let seriesOrder = series.map(d => d.key);
        let newOrder = companiesSortedByOwnership.map(c => seriesOrder.indexOf(c));
        return newOrder;
      })(this.dataPerYear);
    } else if (activeStage === "oneCompany") {
      stackedData = d3.stack().keys(this.companies)(this.dataPerYear);
    } else {
      stackedData = d3.stack().keys(this.companies)(this.dataPerYear);
    }

    let paths = this.paths.selectAll("path")
      .data(stackedData)
      .join("path")
      .attr('fill-opacity', '.85');

    if (activeStage === "investor") {
      // animation order reversed here--
      // animate position then color, to help w/ transition to "investor" section
      paths
        .transition()
        .delay(250)
        .duration(1000)
        .attr("d", area)
        .transition()
        .duration(250)
        .attr("fill", ({ key }) => {
          let ownership = this.rawData.find(d => d.company === key).ownership;
          if (ownership === "State") { return "#fff"; }
          else { return colorPastel(key); }
        })
        .attr("stroke", "#fff")
    } else {
      paths
        .transition()
        .duration(250)
        .attr("fill", ({ key }) => {
          if (activeStage === "ownership") {
            // todo: optimize this
            let ownership = this.rawData.find(d => d.company === key).ownership
            return colorBold(ownership);
          } else if (activeStage === "oneCompany") {
            if (key === "Saudi Aramco") { return colorPastel(key); }
            else { return "#fff"; }
          } else {
            return colorPastel(key);
          }
        })
        .attr("stroke", "#fff")
        .transition()
        .delay(250)
        .duration(1000)
        .attr("d", area)
    }

    // Set up hover effects
    const _this = this;
    paths
      .on('mouseover', function (d, i) {
        // don't allow for hovering on invisible areas
        let path = d3.select(this)
        if (path.attr('opacity') !== "0" && path.attr('fill') !== "rgb(255, 255, 255)") {
          d3.select(this)
            .attr('fill-opacity', '1');

          let metadata = _this.data.find(row => row.name === d.key)
          _this.companyName.text(d.key);
          _this.companyOwnership.text(`Ownership: ${metadata.ownership}`)
          _this.companyCountry.text(`Country: ${metadata.country}`)
          _this.companyEmissions.text(`Cumulative Emissions: ${d3.format(",")(_.sum(metadata.values.map(d => d.value)))} MtCO2e`)
          _this.companyTooltip.style("display", "block");
        }
      })
      .on('mouseout', function (d, i) {
        d3.select(this)
          .attr('fill-opacity', '.75');
        _this.companyTooltip.style("display", "none");
      })

    this.labels.selectAll("text")
      .data(stackedData)
      .join("text")
      .transition()
      .delay(() => {
        if (activeStage === "investor") return 250;
        else return 500;
      })
      .duration(1000)
      .attr("dy", "0.3em")
      .attr("dx", "0.1em")
      .attr("x", x(dateRange[1]))
      .attr("y", d => y(d3.mean(d.slice(-1)[0])))
      .attr("opacity", d => {
        if (activeStage === "investor" && this.investorCompanies.indexOf(d.key) === -1) {
          return "0"
        }

        if (activeStage === "oneCompany" && d.key !== "Saudi Aramco") {
          return "0"
        }

        // Hide labels for small areas
        let ys = d.slice(-1)[0];
        let height = ys[1] - ys[0];
        if (height < 200) {
          return "0";
        }

        return "1";
      })
      .text(d => d.key)
  }
}

module.exports = LineGraph;
