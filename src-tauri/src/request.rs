use reqwest::{Client, Error, Response};

pub async fn get_by_url(url: &str) -> Response {
    let client = Client::new();
    let response = client.get(url).send().await.expect("下载文件失败");
    response
}

pub async fn get_by_url_safe(url: &str) -> Result<Response, Error> {
    let client = Client::new();
    client.get(url).send().await
}
