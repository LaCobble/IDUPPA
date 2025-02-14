exports.eraseData = async (req, res) => {
    try {
      const { idRef, dataName, dataTypeName, primaryKeys } = req.body;
      const sql = `DELETE FROM ?? WHERE idRef = ? AND ?? = ?`;
      const values = [dataTypeName, idRef, Object.keys(primaryKeys)[0], Object.values(primaryKeys)[0]];

      await pool.query(sql, values);
      res.status(200).json({ message: 'Data erased successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error erasing data', error });
    }
  };
