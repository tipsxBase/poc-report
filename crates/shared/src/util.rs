use std::mem;

pub fn is_empty<T>(_: &T) -> bool {
    mem::size_of::<T>() == 0
}

pub fn like_pattern(key: &Option<String>) -> Option<String> {
    match key {
        Some(k) => {
            if String::is_empty(&k.trim().to_string()) {
                return Some(String::from(""));
            }
            return Some(format!("%{}%", k));
        }
        None => None,
    }
}
