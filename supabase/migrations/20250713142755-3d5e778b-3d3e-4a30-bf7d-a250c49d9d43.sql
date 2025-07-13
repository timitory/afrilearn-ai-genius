
-- Let's check what institutions exist and also create a test institution for debugging
SELECT * FROM institutions;

-- If no institutions exist, let's create a test one
INSERT INTO institutions (name, code, admin_id) 
VALUES ('Test School', 'TEST123', '00000000-0000-0000-0000-000000000000');
