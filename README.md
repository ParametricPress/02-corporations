# Carbon Majors

When we measure greenhouse gas emissions, we tend to aggregate the data by the countries where the emissions occurred. But what about the _producers_: the companies that extracted the fossil fuels in the first place?

## Local Setup

To run the article locally, make sure you have NodeJS and NPM installed. Then clone or download this repository. The main file is [index.idyll](index.idyll), this file defines the article using [Idyll markdown](https://idyll-lang.org/docs/syntax).

### Installing dependencies

1. Install local dependencies: `npm install`

### Running local dev server

1. Run `npm start` in the root of this project.

## Data Notes

Here are notes on reproducing the data pipeline for the article.

### National emissions data

Original data source: CDIAC
https://energy.appstate.edu/research/work-areas/cdiac-appstate

Raw data file: `data/nation.1751_2016.csv`

Aggregated by country in Excel: `data/national-emissions.csv`

IMPORTANT NOTE: CDIAC data is in units MtC. CAI data is in MtCO2. Multiply by 3.67 to convert from MtC to MtCO2, according to https://github.com/openclimatedata/cdiac-co2-fossil-national and https://archive.thinkprogress.org/the-biggest-source-of-mistakes-c-vs-co2-c0b077313b/

### Corporate emissions data

Original data source:
"sum ranking" Excel file from Richard Heede / CAI

Extracted Scope 1 emissions column into `data/entity-emissions.csv`