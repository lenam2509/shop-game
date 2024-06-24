var db = require('../config/db');

var jwt = require('jsonwebtoken');


exports.getUser = async function (req, res) {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        // console.log(token);
        if (!token) {
            return res.status(400).json({ message: 'Token not found' });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const id = decode.id;
        const sql = 'SELECT id, username, email, Coins FROM users WHERE id = ?';
        db.query(sql, [id], function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length == 0) {
                return res.status(400).json({ message: 'User not found' });
            }
            return res.status(200).json(results[0]);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}