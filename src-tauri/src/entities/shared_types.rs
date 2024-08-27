use rbatis::Error;

pub type RResult<T> = Result<T, Error>;

#[derive(serde::Serialize, Debug, Clone)]
pub struct Response<T> {
    pub message: String,
    pub success: bool,
    pub data: Option<T>,
}

pub type CommandResult<T> = Result<Response<T>, Response<()>>;

#[derive(serde::Serialize, Debug, Clone)]
pub struct PageResponse<T> {
    pub message: String,
    pub success: bool,
    pub data: Option<T>,
    pub total: u64,
    pub page_no: u64,
    pub page_size: u64,
}

pub type CommandPageResult<T> = Result<PageResponse<T>, PageResponse<()>>;

pub type EntityResult<T> = Result<T, anyhow::Error>;
