def categorize_performance(rating):
    if rating >= 98.0:
        return 'Excellent', 'Green'
    elif 95.0 <= rating < 98.0:
        return 'Satisfactory', 'Yellow'
    else:
        return 'Unacceptable', 'Red'

def insert_vendor_performance(conn, vendor_id, quality_score, delivery_score, record_date, notes):
    # Categorize and color-code the performance
    quality_category, quality_color = categorize_performance(quality_score)
    delivery_category, delivery_color = categorize_performance(delivery_score)
    overall_score = (quality_score + delivery_score) / 2
    overall_category, overall_color = categorize_performance(overall_score)

    # Insert data into the database
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO supplier_quality_records 
            (vendor_id, quality_rating, delivery_rating, overall_rating, 
             quality_category, delivery_category, overall_category, 
             quality_color, delivery_color, overall_color, 
             record_date, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (vendor_id, quality_score, delivery_score, overall_score, 
              quality_category, delivery_category, overall_category, 
              quality_color, delivery_color, overall_color, 
              record_date, notes))
        conn.commit()
