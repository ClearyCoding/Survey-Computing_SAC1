**Create table with 5 columns; q1, q2, q3, q4, q5, all with 255 character strings as data types:**
    
    CREATE TABLE <uuid> (q1 varchar(255), q2 varchar(255), q3 varchar(255), q4 varchar(255), q5 varchar(255))

**Create table with 4 columns; a, b, c, d, all with integers as data types. For master count of answers**

    CREATE TABLE masterQ1 (a int, b int, c int, d int);

**Add column (probably not needed)**

    ALTER TABLE <uuid> ADD COLUMN q6 varchar(255); 

**Delete column (probably not needed)**

    ALTER TABLE <uuid> DROP COLUMN q6 varchar(255); 

**Initial data into table**

    INSERT INTO <uuid> (q1, q2, q3, q4, q5) VALUES ('a', 'b', 'b', 'd', 'c'); 

**Grab data from table**

    SELECT * FROM <uuid>; 

**Update all table data**

    UPDATE <uuid> SET q1 = 'a', q2 = 'b', q3 = 'c', q4 = 'd', q5 = 'e'; 

**Update q3 data**

    UPDATE <uuid> SET q3 = 'c'; 

**Update q3 data where key = 3, doesn't fit out current storage plan but it's here for continuity**

    UPDATE <uuid> SET q3 = 'c' WHERE key = 3;