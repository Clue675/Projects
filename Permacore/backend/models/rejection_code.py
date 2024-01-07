# models/rejection_code.py

from ..utils.database import db
class RejectionCode(db.Model):
    __tablename__ = 'rejection_codes'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))

    def __repr__(self):
        return f'<RejectionCode {self.code}: {self.description}>'

