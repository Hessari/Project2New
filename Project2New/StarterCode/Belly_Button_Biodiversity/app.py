import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Samples_Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the csv
    #stmt = db.session.query(Samples).statement
    print("HELLOO")
    df = pd.read_csv("CountriesAbbr_Cat_LifeExp_Pol.csv")
    print(df)


    # Return a list of the column names (sample names)
    return jsonify(list(df['Abbr']))


@app.route("/metadata/<sample>")
def sample_metadata(sample):
    df = pd.read_csv("CountriesAbbr_Cat_LifeExp_Pol.csv")
    df = df.astype(str)

    """Return the MetaData for a given sample."""
    data = df[df['Abbr']==sample]
    

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    
    sample_metadata["1. Country"] = data['Country'].item()
    sample_metadata["2. Code"] =  data['Abbr'].item()
    sample_metadata['3. Classification'] = data['Category'].item().upper()
    sample_metadata["4. Population"] = int(float(data['Population'].item()))
    sample_metadata["5. Life Expectancy"] = (data['LifeExpectancy'].item())

    print(sample_metadata)
    return jsonify(sample_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    df = pd.read_csv("CauseOfDeathPerCountry.csv")
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    #stmt = db.session.query(Samples).statement
    #df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    sample_data =  df.loc[:, ['Cause of Death', sample]].sort_values(by=sample, ascending=False).head(10)

    
    # Format the data to send as json
    data = {
        
        "otu_ids": list(sample_data['Cause of Death']),
        "sample_values": list(sample_data[sample]),
        "otu_labels": list(sample_data[sample]),
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run()
