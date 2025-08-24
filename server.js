const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pass@123',
  database: 'sahildb'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});


app.get('/ring', (req, res) => {
  const sql = 'SELECT * FROM ring';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/bangle', (req, res) => {
  const sql = 'SELECT * FROM bangle';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.get('/bracelet', (req, res) => {
  const sql = 'SELECT * FROM bracelet';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.get('/earring', (req, res) => {
  const sql = 'SELECT * FROM earring';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/solitaires', (req, res) => {
  const sql = 'SELECT * FROM solitaires';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/nacklace', (req, res) => {
  const sql = 'SELECT * FROM nacklace';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/gemstone', (req, res) => {
  const sql = 'SELECT * FROM gemstone';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});




app.get('/pendant', (req, res) => {
  const sql = 'SELECT * FROM pendant';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.get('/jewellery', (req, res) => {
  const sql = 'SELECT * FROM pendant UNION ALL SELECT * FROM ring UNION ALL SELECT * FROM bracelet SELECT * FROM bangle UNION ALL SELECT * FROM pendant UNION ALL solitaires SELECT * FROM nacklace UNION ALL SELECT * FROM earring UNION ALL';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.post("/users", (req, res) => {
  const { Mobile_no, Password } = req.body;

  if (!Mobile_no || !Password) {
    return res.status(400).json({ error: 'Mobile number and password are required' });
  }

  const sql = "INSERT INTO users (Mobile_no, Password) VALUES (?, ?)";
  db.query(sql, [Mobile_no, Password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "User registered successfully", id: result.insertId });
  });
});


app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});


app.get('/userdata/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM userdata WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
});

app.put("/userdata/:id", (req, res) => {
  const userId = req.params.id;
  const { First_Name, Last_Name, Phone, Email_id, City, Country, Zip_code, State, Address } = req.body;

  const updateSql = `
    UPDATE userdata
    SET First_Name = ?, Last_Name = ?, Phone = ?, Email_id = ?, City = ?, Country = ?, Zip_code = ?, State = ?, Address = ?
    WHERE id = ?
  `;

  db.query(updateSql, [First_Name, Last_Name, Phone, Email_id, City, Country, Zip_code, State, Address, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.affectedRows === 0) {
      
      const insertSql = `
        INSERT INTO userdata (id, First_Name, Last_Name, Phone, Email_id, City, Country, Zip_code, State, Address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [userId, First_Name, Last_Name, Phone, Email_id, City, Country, Zip_code, State, Address], (err2, results2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        return res.status(201).json({ message: "User profile created successfully", insertId: results2.insertId });
      });
    } else {
     
      res.json({ message: "Profile updated successfully" });
    }
  });
});



app.get('/useraddress/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM useraddress WHERE user_id = ?';  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('DB error in GET /useraddress/:userId:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log(`No address found for user_id: ${userId}`);
      return res.json(null);
    }
    res.json(results[0]);
  });
});

app.post('/useraddress', (req, res) => {
  const { user_id, Country, City, Zip_code, State, Address, Address2 } = req.body;
  console.log('POST /useraddress data:', req.body);

  if (!user_id || !Country || !City || !Zip_code || !State || !Address) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO useraddress (user_id, Country, City, Zip_code, State, Address, Address2) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [user_id, Country, City, Zip_code, State, Address, Address2], (err, result) => {
    if (err) {
      console.error('DB error in POST /useraddress:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Address inserted successfully", insertId: result.insertId });
  });
});



app.put('/useraddress/:userId', (req, res) => {
  const { userId } = req.params;
  const { Country, City, Zip_code, State, Address, Address2 } = req.body;
  console.log('PUT /useraddress/:userId data:', req.params, req.body);

  const sql = `UPDATE useraddress SET Country = ?, City = ?, Zip_code = ?, State = ?, Address = ?, Address2 = ? WHERE user_id = ?`;
  db.query(sql, [Country, City, Zip_code, State, Address, Address2, userId], (err, result) => {
    if (err) {
      console.error('DB error in PUT /useraddress/:userId:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address updated successfully' });
  });
});




app.get('/billing/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM billing WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Billing info not found' });
    }
    res.json(results[0]);
  });
});


app.get('/shipping/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM ShippingAdd WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Shipping info not found' });
    }
    res.json(results[0]);
  });
});

app.put('/billing/:userId', (req, res) => {
  const userId = req.params.userId;
  const {
    first_name,
    last_name,
    mobile,
    email_id,
    country,
    city,
    zip_code,
    state,
    landmark
  } = req.body;

  const sql = `
    INSERT INTO billing 
      (user_id, first_name, last_name, mobile, email_id, country, city, zip_code, state, landmark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      first_name = VALUES(first_name),
      last_name = VALUES(last_name),
      mobile = VALUES(mobile),
      email_id = VALUES(email_id),
      country = VALUES(country),
      city = VALUES(city),
      zip_code = VALUES(zip_code),
      state = VALUES(state),
      landmark = VALUES(landmark);
  `;

  const values = [userId, first_name, last_name, mobile, email_id, country, city, zip_code, state, landmark];

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Billing info inserted or updated successfully' });
  });
});


app.put('/shipping/:userId', (req, res) => {
  const userId = req.params.userId;
  const {
    first_name,
    last_name,
    phone,
    email_id,
    country,
    city,
    zip_code,
    state,
    shipping_add
  } = req.body;

  const sql = `
    INSERT INTO ShippingAdd 
      (user_id, first_name, last_name, phone, email_id, country, city, zip_code, state, shipping_add)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      first_name = VALUES(first_name),
      last_name = VALUES(last_name),
      phone = VALUES(phone),
      email_id = VALUES(email_id),
      country = VALUES(country),
      city = VALUES(city),
      zip_code = VALUES(zip_code),
      state = VALUES(state),
      shipping_add = VALUES(shipping_add);
  `;

  const values = [userId, first_name, last_name, phone, email_id, country, city, zip_code, state, shipping_add];

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Shipping info inserted or updated successfully' });
  });
});



app.post('/shipping', (req, res) => {
  const { user_id, first_name, last_name, phone, email_id, city, country, zip_code, state, shipping_add } = req.body;

  const sql = `
    INSERT INTO shipping (user_id, first_name, last_name, phone, email_id, city, country, zip_code, state, shipping_add)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, first_name, last_name, phone, email_id, city, country, zip_code, state, shipping_add], (err, result) => {
    if (err) {
      console.error("Error inserting shipping info:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Shipping info added", id: result.insertId });
  });
});


app.post('/billing', (req, res) => {
  const { user_id, first_name, last_name, mobile, email_id, city, country, zip_code, state, billing_landmark } = req.body;

  const sql = `
    INSERT INTO billing (user_id, first_name, last_name, mobile, email_id, city, country, zip_code, state, billing_landmark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, first_name, last_name, mobile, email_id, city, country, zip_code, state, billing_landmark], (err, result) => {
    if (err) {
      console.error("Error inserting billing info:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Billing info added", id: result.insertId });
  });
});



app.put('/card_details', (req, res) => {
  const { user_id, card_no, month, year, cvv } = req.body;

  if (!user_id || !card_no || !month || !year || !cvv) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
        INSERT INTO card_details (user_id, card_no, month, year, cvv)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            card_no = VALUES(card_no),
            month = VALUES(month),
            year = VALUES(year),
            cvv = VALUES(cvv)
    `;

  db.query(sql, [user_id, card_no, month, year, cvv], (err) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Failed to save card details' });
    }
    res.json({ message: 'Card details saved successfully' });
  });
});





app.post('/orders', (req, res) => {
  const { user_id, order_id, status, total, items } = req.body;

  if (!user_id || !order_id || !status || !total || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
        INSERT INTO orders (user_id, order_id, status, total, items)
        VALUES (?, ?, ?, ?, ?)
    `;

  db.query(sql, [user_id, order_id, status, total, JSON.stringify(items)], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Order saved successfully', orderId: result.insertId });
  });
});


app.get('/orders/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    
    const orders = results.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(orders);
  });
});


app.post('/contactdetails', (req, res) => {
  const { user_id, fullName, phone, emailId, msg } = req.body;

  const sql = `
    INSERT INTO ContactDetails (user_id, fullName, phone, emailId, msg)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, fullName, phone, emailId, msg], (err, result) => {
    if (err) {
      console.error("Error inserting billing info:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Billing info added", id: result.insertId });
  });
});


app.listen(3001, () => {
  console.log('Server running on port 3001');
});
