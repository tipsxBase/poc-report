use serde::Serialize;

pub mod case;
pub mod category;
pub mod metric;
pub mod server;
pub mod shared_types;
pub mod statics;

pub struct Pagination {
    pub current: u64,
    pub size: u64,
}

#[derive(Serialize)]
pub struct PageResult<T> {
    pub records: Vec<T>,
    /// total num
    pub total: u64,
    /// current page index
    pub page_no: u64,
    /// default 10
    pub page_size: u64,
}
