from flask_sqlalchemy import SQLAlchemy

# Assuming 'app' is initialized before this line
sql_db = SQLAlchemy()

class Training(sql_db.Model):
    id = sql_db.Column(sql_db.Integer, primary_key=True)
    firstName = sql_db.Column(sql_db.String(50))
    lastName = sql_db.Column(sql_db.String(50))
    badgeNumber = sql_db.Column(sql_db.String(50))
    title = sql_db.Column(sql_db.String(100))
    date = sql_db.Column(sql_db.DateTime)  # Changed to DateTime
    trainer = sql_db.Column(sql_db.String(50))

    @property
    def serialize(self):
        return {
            'id': self.id,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'badgeNumber': self.badgeNumber,
            'title': self.title,
            'date': self.date,
            'trainer': self.trainer
        }

    def __repr__(self):
        return f"<Training(id='{self.id}', firstName='{self.firstName}', lastName='{self.lastName}')>"

