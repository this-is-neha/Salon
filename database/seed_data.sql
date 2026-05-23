INSERT INTO notification_templates (title, body_text, status) VALUES 
('Confirmation Template', 'Hello {{customer_name}}, your appointment for {{service_name}} is confirmed for {{start_time}}.', 'confirmed'),
('Cancellation Template', 'Hi {{customer_name}}, we are sorry to inform you that your {{service_name}} on {{start_time}} has been cancelled.', 'cancelled'),
('Completion Template', 'Dear {{customer_name}}, thank you for completing your {{service_name}} session today!', 'completed'),
('Pending Template', 'Hello {{customer_name}}, this is a reminder that your appointment for {{service_name}} is currently pending approval.', 'pending');


INSERT INTO services (name, description, price, duration_minutes)
VALUES 
('Haircut', 'Professional haircut and styling', 1500.00, 45),
('Facial', 'Deep cleansing and rejuvenating facial', 2500.00, 60),
('Manicure', 'Nail care and polish application', 1000.00, 40),
('Hair Coloring', 'Full hair color treatment', 4500.00, 120),
('Massage', 'Relaxing full body therapeutic massage', 3000.00, 60);