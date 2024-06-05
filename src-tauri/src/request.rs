use reqwest::{Client, Response};

pub async fn get_by_url(url: &str) -> Response {
    let client = Client::new();
    let response = client.get(url).send().await.expect("下载文件成功");
    response
}
