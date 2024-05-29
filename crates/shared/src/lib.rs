

pub mod sqlite {
    use std::fs;


    fn is_debug() -> bool {
        cfg!(debug_assertions)
    }

    pub fn get_database_path() -> String {
        let mut path = dirs_next::home_dir().unwrap();
        path.push(".poc_db");
    
        if !path.exists() {
            if let Err(_) = fs::create_dir(&path) {
                panic!("Failed to create 'poc_db' directory");
            }
        }
        
        let db_name = if is_debug() {"poc-report-dev.db"} else {"poc-report.db"};
        path.push(db_name);
        path.to_str().unwrap().to_string()
    }

    pub fn get_driver_url() -> String{
        let database = get_database_path();
        let mut url = String::from("sqlite://");
        url.push_str(&database);
        url
    }

    
}

