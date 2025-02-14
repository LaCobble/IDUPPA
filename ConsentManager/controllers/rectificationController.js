exports.rectifyData = async (req, res) => {
  try {
    const { idRef, dataName, dataTypeName, newValue, primaryKeys } = req.body;
    const sql = `UPDATE ?? SET ?? = ? WHERE idRef = ? AND ?? = ?`;
    const values = [dataTypeName, dataName, newValue, idRef, Object.keys(primaryKeys)[0], Object.values(primaryKeys)[0]];

    await pool.query(sql, values);
    res.status(200).json({ message: 'Data rectified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rectifying data', error });
  }
};
