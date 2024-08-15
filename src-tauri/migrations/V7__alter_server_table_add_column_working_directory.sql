
ALTER TABLE poc_server ADD COLUMN working_directory TEXT;

UPDATE poc_server set working_directory = 'poc' where working_directory is null;

UPDATE poc_server set initial_state = 2 where initial_state  = 1;