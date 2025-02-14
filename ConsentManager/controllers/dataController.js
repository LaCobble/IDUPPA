const pool = require('../config/db');

exports.getPersonalDataValues = async (req, res) => {
  try {
    const { idRef, dataTypeName, attributes } = req.query;
    const sql = `SELECT ?? FROM ?? WHERE idRef = ?`;
    const values = [attributes, dataTypeName, idRef];

    const [rows] = await pool.query(sql, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving personal data', error });
  }
};
