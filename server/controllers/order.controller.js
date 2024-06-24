let express = require('express');
let router = express.Router();
let $ = require('jquery');
const request = require('request');
const moment = require('moment');
const db = require('../config/db');

exports.createPayment = (req, res) => {

    function sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;



    // let config = require('config');

    let tmnCode = 'B89A5GDI'
    let secretKey = 'W8MI2RUWA31VSUCKOTDV3O1OGVHPZY4I'
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    let returnUrl = process.env.RETURN_URL

    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const sql = `UPDATE users SET vnp_TxnRef = ${orderId} WHERE id = ${req.body.user_id}`;

    db.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ vnpUrl: vnpUrl });
}


exports.vnpayReturn = (req, res) => {
    function sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }



    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    // let config = require('config');
    let tmnCode = 'B89A5GDI'
    let secretKey = 'W8MI2RUWA31VSUCKOTDV3O1OGVHPZY4I'

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            const sql = `UPDATE users SET coins = coins + ${vnp_Params['vnp_Amount'] / 1000} WHERE vnp_TxnRef = ${vnp_Params['vnp_TxnRef']}`;
            db.query(sql, function (error, results) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
            });
        }
        // res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
        // res.status(200).json({ code: vnp_Params['vnp_ResponseCode'], amount: vnp_Params['vnp_Amount'] / 100 });
        return res.redirect(process.env.PAY_SUCCESS_URL);
    } else {
        // res.render('success', { code: '97' })
        res.status(400).json({ code: '97' });
    }
}

