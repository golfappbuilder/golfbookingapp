-- Seed data for Golf Booking App

-- Insert sample courses
INSERT INTO courses (name, description, address, city, state, zip, phone, holes, par_total, price_weekday, price_weekend) VALUES
('Pine Valley Golf Club', 'A challenging championship course with beautiful pine-lined fairways', '1 Pine Valley Rd', 'Pine Valley', 'NJ', '08021', '555-0100', 18, 72, 75.00, 95.00),
('Oceanview Golf Resort', 'Stunning coastal views with ocean breeze challenges', '500 Oceanview Dr', 'Malibu', 'CA', '90265', '555-0200', 18, 71, 120.00, 150.00),
('Mountain Ridge Golf Course', 'Elevated fairways with spectacular mountain vistas', '2000 Highland Ave', 'Denver', 'CO', '80202', '555-0300', 18, 72, 55.00, 70.00),
('Lakeside Links', 'A serene course featuring water hazards and lakeside holes', '789 Lake Shore Blvd', 'Chicago', 'IL', '60601', '555-0400', 18, 70, 65.00, 85.00),
('Desert Oasis Golf Club', 'An oasis in the desert with lush green fairways', '1234 Cactus Way', 'Scottsdale', 'AZ', '85251', '555-0500', 18, 72, 90.00, 110.00);

-- Generate tee times for the next 7 days for each course
-- This will be run via the API or a separate script
-- Example for manual generation:
DO $$
DECLARE
    course_record RECORD;
    current_date DATE := CURRENT_DATE;
    day_offset INTEGER;
    hour INTEGER;
    minute INTEGER;
BEGIN
    FOR course_record IN SELECT id FROM courses LOOP
        FOR day_offset IN 0..6 LOOP
            FOR hour IN 6..17 LOOP
                FOR minute IN 0..50 BY 10 LOOP
                    INSERT INTO tee_times (course_id, tee_date, tee_time, available_slots)
                    VALUES (
                        course_record.id,
                        current_date + day_offset,
                        (hour || ':' || LPAD(minute::TEXT, 2, '0'))::TIME,
                        4
                    )
                    ON CONFLICT (course_id, tee_date, tee_time) DO NOTHING;
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
