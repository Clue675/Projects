class VendorPerformance:
    def __init__(self, vendor_id, quality_rating, delivery_rating, overall_rating, quality_category, delivery_category, overall_category, quality_color, delivery_color, overall_color, record_date, notes):
        self.vendor_id = vendor_id
        self.quality_rating = quality_rating
        self.delivery_rating = delivery_rating
        self.overall_rating = overall_rating
        self.quality_category = quality_category
        self.delivery_category = delivery_category
        self.overall_category = overall_category
        self.quality_color = quality_color
        self.delivery_color = delivery_color
        self.overall_color = overall_color
        self.record_date = record_date
        self.notes = notes

    @staticmethod
    def update_performance_from_discrepancy_report(discrepancy_report_details, connection):
        with connection.cursor() as cursor:
            # Logic to fetch vendor_id, calculate new scores, and update records
            cursor.execute("""
                UPDATE vendor_performance
                SET /* updated fields based on discrepancy report details */
                WHERE vendor_id = %s
            """, (discrepancy_report_details['vendor_id'],))
            connection.commit()