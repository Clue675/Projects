from app import db
from ..models.rejection_code import RejectionCode

class RejectionCodeService:

    @staticmethod
    def create_rejection_code(data):
        new_code = RejectionCode(
            code=data['code'],
            category=data['category'],
            description=data['description']
        )
        db.session.add(new_code)
        db.session.commit()
        return new_code

    @staticmethod
    def get_all_rejection_codes():
        return RejectionCode.query.all()

    @staticmethod
    def get_rejection_code_by_id(code_id):
        return RejectionCode.query.get(code_id)

    @staticmethod
    def update_rejection_code(code_id, data):
        rejection_code = RejectionCode.query.get(code_id)
        if rejection_code:
            rejection_code.code = data.get('code', rejection_code.code)
            rejection_code.category = data.get('category', rejection_code.category)
            rejection_code.description = data.get('description', rejection_code.description)
            db.session.commit()
            return rejection_code
        return None

    @staticmethod
    def delete_rejection_code(code_id):
        rejection_code = RejectionCode.query.get(code_id)
        if rejection_code:
            db.session.delete(rejection_code)
            db.session.commit()
            return True
        return False
