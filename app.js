const express = require('express');
const mysql = require('mysql');
const hbs = require('hbs');
const bodyParser = require('body-parser')

const app = express ();
const port = 5000;

//setting engine view bhs
app.set('view engine', 'hbs');

//setting parser data dari mysql ke appjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'datanovel'
}); 

koneksi.connect((err) => {
    if(err) throw err;
    console.log('Koneksi Database Berhasil Disambung');
});


//login
app.get('/usernames', (req, res) => {
    koneksi.query('SELECT * FROM user', (err, hasil) => {
        if(err) throw err;
        res.render('usernames', {
            judulHalaman: 'Data Novel',
            data: hasil
        });
    });
});

app.post('/usernames', (req, res) => {
    var usernames = req.body.usernames;
    var passwords = req.body.passwords;
    koneksi.query("SELECT * FROM user WHERE usernames=? AND passwords=?", 
    [ usernames, passwords ], 
    (err, hasil) => {
        if(err) throw err;
        if(hasil > 0){
            res.redirect('/data');
        } else {
            res.redirect('/usernames');
        }
    });
});


//data
app.get('/data', (req, res) => {
    koneksi.query('SELECT * FROM novel', (err, hasil) => {
        if(err) throw err;
        res.render('data', {
            judulHalaman: 'Data Novel',
            data: hasil
        });
    });
});

app.post('/data', (req, res) => {
    var judulbuku = req.body.inputjudulbuku;
    var tahunterbit = req.body.inputtahunterbit;
    var penerbit = req.body.inputpenerbit;
    var pengarang = req.body.inputpengarang;
    var stokbuku = req.body.inputstokbuku;
    var hargabuku = req.body.inputhargabuku
    koneksi.query('INSERT INTO novel(judul_buku, tahun_terbit, penerbit, pengarang, stok_buku, harga_buku) VALUES(?, ?, ?, ?, ?, ?)',
    [ judulbuku, tahunterbit, penerbit, pengarang, stokbuku, hargabuku ],
    (err, hasil) => {
        if(err) throw err;
        res.redirect('/data');
    }
    )
});

app.get('/hapus-data/:no_buku', (req, res) => {
    var no_buku = req.params.no_buku;
    koneksi.query('DELETE FROM novel WHERE no_buku=?', 
        [no_buku], (err, hasil) => {
            if(err) throw err;
            res.redirect('/data');
        }
    )
});




app.listen(port, () => {
    console.log(`App berjalan pada port ${port}`);
});