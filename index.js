const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'seguro_poliza.sqlite'
});

// Define a model for InsurancePolicy
const InsurancePolicy = sequelize.define('InsurancePolicy', {
  insurance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dniAfiliado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellidoAfiliado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreAfiliado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  insuranceAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  incidentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  incidentDetail: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Sync the database
sequelize.sync();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file for /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/save-insurance', async (req, res) => {
  const { insurance, dniAfiliado, apellidoAfiliado, nombreAfiliado, insuranceAmount, incidentDate, incidentDetail } = req.body;

  try {
    await InsurancePolicy.create({
      insurance,
      dniAfiliado,
      apellidoAfiliado,
      nombreAfiliado,
      insuranceAmount,
      incidentDate,
      incidentDetail
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Handle search
app.get('/search-insurance', async (req, res) => {
  const { insurance, year, month } = req.query;

  try {
    const results = await InsurancePolicy.findAll({
      where: {
        insurance,
        incidentDate: {
          [Sequelize.Op.between]: [new Date(year, month - 1, 1), new Date(year, month, 0)]
        }
      }
    });
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Seguro Poliza app listening at http://localhost:${port}`);
});
