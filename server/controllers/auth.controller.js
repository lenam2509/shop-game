var db = require('../config/db');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.register = async function (req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Hãy điền đầy đủ thông tin' });
        }
        // Check if user already exists
        db.query('SELECT email FROM users WHERE email = ?', [email], async function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            // Encrypt the password
            const hashedPassword = await bcrypt.hash(password, 8);
            // Insert user into database
            db.query('INSERT INTO users SET ?', { username: username, email: email, password: hashedPassword }, function (error, results) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.status(201).json({ message: 'Đăng ký thành công' });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// login

exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Hãy điền đầy đủ thông tin' });
        }
        // Check if user exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async function (error, results) {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length == 0) {
                return res.status(400).json({ message: 'Email không tồn tại' });
            }
            // Check if password is correct
            if (!bcrypt.compareSync(password, results[0].password)) {
                return res.status(400).json({ message: 'Mật khẩu không đúng' });
            }
            // Create token
            const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            // Send token in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none'
            });
            return res.status(200).json({ message: 'Đăng nhập thành công', token: token, user: { id: results[0].id, username: results[0].username, email: results[0].email, Coins: results[0].Coins, role: results[0].role } });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// logout

exports.logout = async function (req, res) {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

